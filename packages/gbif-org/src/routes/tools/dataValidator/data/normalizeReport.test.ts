import { describe, expect, it } from 'vitest';
import coldp from './__fixtures__/coldp.json';
import dwcaClean from './__fixtures__/dwcaClean.json';
import dwcaWithIssues from './__fixtures__/dwcaWithIssues.json';
import failed from './__fixtures__/failed.json';
import notIndexable from './__fixtures__/notIndexable.json';
import running from './__fixtures__/running.json';
import {
  assignColdpFileTypes,
  FALLBACK_CATEGORY_ORDER,
  fileSize,
  getIssueSeverity,
  mergeSameIssues,
  normalizeReport,
  normalizeSteps,
  sortIssues,
  NOT_RUN,
} from './normalizeReport';
import type { Validation } from './types';

const categoryOrder = [
  'RESOURCE_INTEGRITY',
  'RESOURCE_STRUCTURE',
  'METADATA_CONTENT',
  'RECORD_STRUCTURE',
  'OCC_INTERPRETATION_BASED',
  'CLB_INTERPRETATION_BASED',
];

const fileNames = (validation: Validation) =>
  normalizeReport(validation, categoryOrder).files.map((file) => file.fileName);

describe('normalizeReport: DWCA with issues', () => {
  const report = normalizeReport(dwcaWithIssues as Validation, categoryOrder);

  it('orders files meta descriptor, metadata, core, extension', () => {
    expect(report.files.map((file) => file.fileType)).toEqual([
      'META_DESCRIPTOR',
      'METADATA',
      'CORE',
      'EXTENSION',
    ]);
  });

  it('gives every file an anchor that is safe as a CSS id', () => {
    expect(report.files.map((file) => file.anchor)).toEqual([
      'validator-file-0',
      'validator-file-1',
      'validator-file-2',
      'validator-file-3',
    ]);
  });

  it('reports the core row type and counts extensions', () => {
    expect(report.coreRowType).toBe('http://rs.tdwg.org/dwc/terms/Occurrence');
    expect(report.extensionCount).toBe(1);
    expect(report.indexeable).toBe(true);
    expect(report.hasIssues).toBe(true);
  });

  it('merges EML_GBIF_SCHEMA into one issue with the first sample of each', () => {
    const eml = report.files[1];
    const schema = eml.categories
      .flatMap((category) => category.issues)
      .find((issue) => issue.issue === 'EML_GBIF_SCHEMA');
    expect(schema?.samples).toHaveLength(2);
    expect(schema?.samples?.[0].relatedData?.message).toMatch(/^cvc-complex-type/);
  });

  it('orders categories by the EvaluationCategory enumeration', () => {
    const core = report.files[2];
    expect(core.categories.map((category) => category.category)).toEqual([
      'RESOURCE_INTEGRITY',
      'OCC_INTERPRETATION_BASED',
    ]);
    expect(report.summary.map((entry) => entry.category)).toEqual([
      'RESOURCE_INTEGRITY',
      'RESOURCE_STRUCTURE',
      'METADATA_CONTENT',
      'OCC_INTERPRETATION_BASED',
    ]);
  });

  it('orders issues by severity, then by count', () => {
    const core = report.files[2];
    const occurrence = core.categories.find((c) => c.category === 'OCC_INTERPRETATION_BASED')!;
    expect(occurrence.issues.map((issue) => issue.issue)).toEqual([
      'ZERO_COORDINATE',
      'COUNTRY_COORDINATE_MISMATCH',
      'RECORDED_DATE_INVALID',
    ]);
  });

  it('takes severities from the API and defaults to WARNING', () => {
    const summary = Object.fromEntries(
      report.summary.flatMap((entry) => entry.issues.map((issue) => [issue.id, issue.severity]))
    );
    expect(summary.LICENSE_MISSING_OR_UNKNOWN).toBe('INFO');
    expect(summary.RECORD_NOT_UNIQUELY_IDENTIFIED).toBe('WARNING');
    expect(summary.EML_GBIF_SCHEMA).toBe('WARNING');
  });

  it('drops empty sample lists and keeps counts as numbers', () => {
    const zero = report.files[2].categories
      .flatMap((category) => category.issues)
      .find((issue) => issue.issue === 'ZERO_COORDINATE');
    expect(zero?.samples).toBeUndefined();
    expect(zero?.count).toBe(25);
  });

  it('notes whether a file has interpreted counts', () => {
    expect(report.files[2].hasInterpretedCounts).toBe(true);
    expect(report.files[3].hasInterpretedCounts).toBe(false);
  });
});

describe('normalizeReport: other results', () => {
  it('reports a clean DWCA as having no issues', () => {
    const report = normalizeReport(dwcaClean as Validation, categoryOrder);
    expect(report.hasIssues).toBe(false);
    expect(report.summary).toEqual([]);
    expect(report.files.every((file) => file.issueCount === 0)).toBe(true);
  });

  it('passes the indexable flag through as the API reports it', () => {
    const report = normalizeReport(notIndexable as Validation, categoryOrder);
    expect(report.indexeable).toBe(false);
    expect(report.summary[0].issues).toEqual([
      { id: 'OCCURRENCE_NOT_UNIQUELY_IDENTIFIED', severity: 'WARNING' },
    ]);
  });

  it('does not crash on a FAILED job without metrics', () => {
    const report = normalizeReport(failed as Validation, categoryOrder);
    expect(report.files).toEqual([]);
    expect(report.hasIssues).toBe(false);
  });

  it('handles a partial result while running', () => {
    expect(fileNames(running as Validation)).toEqual(['meta.xml']);
  });

  it('tolerates missing and unknown values', () => {
    const report = normalizeReport({
      key: 'k',
      status: 'FINISHED',
      fileFormat: 'DWC_DP',
      metrics: {
        files: [
          { fileName: 'a', fileType: null, issues: [{ issueCategory: 'NEW_CATEGORY' }] },
          { fileName: 'b', fileType: 'NEW_TYPE', terms: null, issues: null },
        ],
      },
    });
    expect(report.files.map((file) => file.fileName)).toEqual(['a', 'b']);
    expect(report.summary).toEqual([
      { category: 'NEW_CATEGORY', issues: [{ id: 'UNKNOWN', severity: 'WARNING' }] },
    ]);
  });

  it('falls back to a fixed category order without the enumeration', () => {
    const report = normalizeReport(dwcaWithIssues as Validation);
    const order = report.summary.map((entry) => entry.category);
    expect(order).toEqual(
      [...order].sort(
        (a, b) => FALLBACK_CATEGORY_ORDER.indexOf(a) - FALLBACK_CATEGORY_ORDER.indexOf(b)
      )
    );
  });
});

describe('normalizeReport: ColDP', () => {
  const report = normalizeReport(coldp as Validation, categoryOrder);

  it('makes the file with issues the core and the others extensions', () => {
    expect(report.files.map((file) => [file.fileName, file.fileType])).toEqual([
      ['NameUsage.tsv', 'CORE'],
      ['Reference.tsv', 'EXTENSION'],
      ['Name.tsv', 'EXTENSION'],
    ]);
    expect(report.extensionCount).toBe(2);
  });

  it('normalises ChecklistBank issue names and shows them as warnings', () => {
    const clb = report.files[0].categories.find((c) => c.category === 'CLB_INTERPRETATION_BASED')!;
    expect(clb.issues.map((issue) => [issue.issue, issue.severity])).toEqual([
      ['BRAND_NEW_ISSUE', 'WARNING'],
      ['ACCEPTED_NAME_MISSING', 'WARNING'],
      ['UNPARSABLE_NAME', 'WARNING'],
    ]);
  });

  it('only renames ChecklistBank issues', () => {
    const occurrence = report.files[0].categories.find(
      (c) => c.category === 'OCC_INTERPRETATION_BASED'
    )!;
    expect(occurrence.issues[0].issue).toBe('SCIENTIFIC_NAME_ASSEMBLED');
  });

  it('picks the core by row type when no file has issues', () => {
    const files = assignColdpFileTypes([
      { fileName: 'Reference.tsv', rowType: 'x/Reference' },
      { fileName: 'Other.tsv', rowType: 'x/Other' },
      { fileName: 'Name.tsv', rowType: 'x/Name' },
      { fileName: 'Taxon.tsv', rowType: 'x/Taxon' },
    ]);
    expect(files.map((file) => file.fileType)).toEqual([
      'EXTENSION',
      'EXTENSION',
      'EXTENSION',
      'CORE',
    ]);
  });

  it('leaves files alone when one is already the core', () => {
    const input = [{ fileType: 'CORE' }, { fileName: 'x' }];
    expect(assignColdpFileTypes(input)).toBe(input);
  });

  it('only assigns types for ColDP', () => {
    const report = normalizeReport({ ...(coldp as Validation), fileFormat: 'DWCA' }, categoryOrder);
    expect(report.files.every((file) => file.fileType === undefined)).toBe(true);
  });
});

describe('getIssueSeverity', () => {
  it('takes the severity the API resolved', () => {
    expect(getIssueSeverity({ issue: 'ZERO_COORDINATE', severity: 'INFO' })).toBe('INFO');
  });

  it('falls back to WARNING for an issue without a remark', () => {
    expect(
      getIssueSeverity({
        issue: 'EML_NOT_FOUND',
        issueCategory: 'RESOURCE_STRUCTURE',
        severity: null,
      })
    ).toBe('WARNING');
  });
});

describe('mergeSameIssues', () => {
  it('combines issues with the same name at the first one, keeping all samples', () => {
    const merged = mergeSameIssues([
      { issue: 'EML_GBIF_SCHEMA', samples: [{ relatedData: { ERROR: 'a' } }] },
      { issue: 'OTHER' },
      { issue: 'EML_GBIF_SCHEMA', samples: [{ relatedData: { ERROR: 'b' } }] },
    ]);
    expect(merged.map((issue) => issue.issue)).toEqual(['EML_GBIF_SCHEMA', 'OTHER']);
    expect(merged[0].samples).toEqual([
      { relatedData: { ERROR: 'a' } },
      { relatedData: { ERROR: 'b' } },
    ]);
  });

  it('adds up counts and leaves its input unchanged', () => {
    const input = [
      { issue: 'X', count: 2, samples: [] },
      { issue: 'X', count: '3' },
    ];
    expect(mergeSameIssues(input)[0].count).toBe(5);
    expect(input[0]).toEqual({ issue: 'X', count: 2, samples: [] });
  });

  it('keeps issues with the same name in different categories apart', () => {
    const merged = mergeSameIssues([
      { issue: 'X', issueCategory: 'CLB_INTERPRETATION_BASED', count: 1 },
      { issue: 'X', issueCategory: 'OCC_INTERPRETATION_BASED', count: 2 },
    ]);
    expect(merged.map((issue) => [issue.issueCategory, issue.count])).toEqual([
      ['CLB_INTERPRETATION_BASED', 1],
      ['OCC_INTERPRETATION_BASED', 2],
    ]);
  });
});

describe('sortIssues', () => {
  it('is stable for equal severity and count', () => {
    const sorted = sortIssues([
      { id: 'a', severity: 'WARNING' },
      { id: 'b', severity: 'ERROR' },
      { id: 'c', severity: 'WARNING' },
      { id: 'd', severity: 'SOMETHING_NEW' },
    ]);
    expect(sorted.map((issue) => issue.id)).toEqual(['b', 'd', 'a', 'c']);
  });
});

describe('normalizeSteps', () => {
  it('sorts by execution order and marks steps without a status as pending', () => {
    const steps = normalizeSteps(running.metrics.stepTypes, 'RUNNING');
    expect(steps.map((step) => [step.stepType, step.status])).toEqual([
      ['VALIDATOR_UPLOAD_ARCHIVE', 'FINISHED'],
      ['VALIDATOR_VALIDATE_ARCHIVE', 'FINISHED'],
      ['VALIDATOR_DWCA_TO_VERBATIM', 'RUNNING'],
      ['VALIDATOR_VERBATIM_TO_INTERPRETED', 'PENDING'],
      ['VALIDATOR_COLLECT_METRICS', 'PENDING'],
    ]);
  });

  it('marks the first step without a status as queued while the job is queued', () => {
    const steps = normalizeSteps(
      [
        { stepType: 'B', executionOrder: 2 },
        { stepType: 'A', executionOrder: 1 },
      ],
      'QUEUED'
    );
    expect(steps.map((step) => step.status)).toEqual(['QUEUED', 'PENDING']);
  });

  it('marks steps that never started as not run once the job has failed', () => {
    const steps = normalizeSteps(
      [
        { stepType: 'UPLOAD', executionOrder: 1, status: 'FINISHED' },
        { stepType: 'VALIDATE', executionOrder: 2, status: 'FAILED' },
        { stepType: 'EXTRACT', executionOrder: 3 },
        { stepType: 'INTERPRET', executionOrder: 4, status: 'QUEUED' },
      ],
      'FAILED'
    );
    expect(steps.map((step) => step.status)).toEqual(['FINISHED', 'FAILED', NOT_RUN, NOT_RUN]);
  });

  it('marks a step that was still running as not run once the job has ended', () => {
    const steps = normalizeSteps(
      [
        { stepType: 'UPLOAD', executionOrder: 1, status: 'FINISHED' },
        { stepType: 'VALIDATE', executionOrder: 2, status: 'RUNNING' },
      ],
      'ABORTED'
    );
    expect(steps.map((step) => step.status)).toEqual(['FINISHED', NOT_RUN]);
  });

  it('keeps steps pending while the job is still running', () => {
    const steps = normalizeSteps([{ stepType: 'A', executionOrder: 1 }], 'RUNNING');
    expect(steps[0].status).toBe('PENDING');
  });

  it('does not change its input', () => {
    const input = [{ stepType: 'A', executionOrder: 1 }];
    normalizeSteps(input, 'QUEUED');
    expect(input).toEqual([{ stepType: 'A', executionOrder: 1 }]);
  });

  it('accepts missing steps', () => {
    expect(normalizeSteps(undefined, 'RUNNING')).toEqual([]);
  });
});

describe('fileSize', () => {
  it.each([
    [0, { value: 0, unit: 'byte' }],
    [320, { value: 320, unit: 'byte' }],
    [51234, { value: 51.2, unit: 'kilobyte' }],
    [2345678, { value: 2.3, unit: 'megabyte' }],
    ['400000', { value: 400, unit: 'kilobyte' }],
    [3000000000, { value: 3, unit: 'gigabyte' }],
    [undefined, undefined],
    ['n/a', undefined],
  ])('formats %j', (bytes, expected) => {
    expect(fileSize(bytes)).toEqual(expected);
  });
});

describe('normalizeReport: extensions', () => {
  it('keeps the registered extension of each file and of the core', () => {
    const occurrence = { identifier: 'dwc:Occurrence', title: 'Occurrence' };
    const report = normalizeReport({
      key: 'k',
      metrics: {
        files: [
          {
            fileName: 'occurrence.txt',
            fileType: 'CORE',
            rowType: 'dwc:Occurrence',
            extension: occurrence,
          },
          { fileName: 'other.txt', fileType: 'EXTENSION', rowType: 'x', extension: null },
        ],
      },
    });
    expect(report.coreExtension).toEqual(occurrence);
    expect(report.files.map((file) => file.extension)).toEqual([occurrence, undefined]);
  });
});
