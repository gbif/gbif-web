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
  mergeStructureIssues,
  normalizeReport,
  normalizeSteps,
  sortIssues,
} from './normalizeReport';
import type { Validation } from './types';
import { emptyLookups, ValidatorLookups } from './useValidatorLookups';

const lookups: ValidatorLookups = {
  ...emptyLookups,
  remarks: {
    COUNTRY_COORDINATE_MISMATCH: { id: 'COUNTRY_COORDINATE_MISMATCH', severity: 'WARNING' },
    RECORDED_DATE_INVALID: { id: 'RECORDED_DATE_INVALID', severity: 'WARNING' },
    ZERO_COORDINATE: { id: 'ZERO_COORDINATE', severity: 'WARNING' },
    MULTIMEDIA_URI_INVALID: { id: 'MULTIMEDIA_URI_INVALID', severity: 'WARNING' },
    // the occurrence remarks share names with ChecklistBank issues; they must not apply to those
    UNPARSABLE_NAME: { id: 'UNPARSABLE_NAME', severity: 'INFO' },
    LICENSE_MISSING_OR_UNKNOWN: { id: 'LICENSE_MISSING_OR_UNKNOWN', severity: 'INFO' },
  },
  categoryOrder: [
    'RESOURCE_INTEGRITY',
    'RESOURCE_STRUCTURE',
    'METADATA_CONTENT',
    'RECORD_STRUCTURE',
    'OCC_INTERPRETATION_BASED',
    'CLB_INTERPRETATION_BASED',
  ],
};

const fileNames = (validation: Validation) =>
  normalizeReport(validation, lookups).files.map((file) => file.fileName);

describe('normalizeReport: DWCA with issues', () => {
  const report = normalizeReport(dwcaWithIssues as Validation, lookups);

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

  it('merges UNKNOWN_TERM and DUPLICATED_TERM into one issue each, collecting relatedData', () => {
    const meta = report.files[0];
    const issues = meta.categories.flatMap((category) => category.issues);
    expect(issues.map((issue) => issue.issue)).toEqual(['UNKNOWN_TERM', 'DUPLICATED_TERM']);
    expect(issues[0].relatedData).toEqual([
      'http://unknown.org/myCustomField',
      'http://example.org/otherField',
    ]);
    expect(issues[0].issueCategory).toBe('RESOURCE_STRUCTURE');
    expect(report.unknownTerms).toEqual(
      new Set([
        'http://unknown.org/myCustomField',
        'http://example.org/otherField',
        'http://rs.tdwg.org/dwc/terms/eventDate',
      ])
    );
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

  it('takes severities from the remarks and defaults to WARNING', () => {
    const summary = Object.fromEntries(
      report.summary.flatMap((entry) => entry.issues.map((issue) => [issue.id, issue.severity]))
    );
    expect(summary.LICENSE_MISSING_OR_UNKNOWN).toBe('INFO');
    expect(summary.RECORD_NOT_UNIQUELY_IDENTIFIED).toBe('WARNING');
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
    const report = normalizeReport(dwcaClean as Validation, lookups);
    expect(report.hasIssues).toBe(false);
    expect(report.summary).toEqual([]);
    expect(report.files.every((file) => file.issueCount === 0)).toBe(true);
  });

  it('reports a non-indexable file and a zip that was not read as an archive', () => {
    const report = normalizeReport(notIndexable as Validation, lookups);
    expect(report.indexeable).toBe(false);
    expect(report.zippedButNotDwca).toBe(true);
    expect(report.summary[0].issues.map((issue) => issue.id)).toEqual([
      'RECORD_IDENTIFIER_NOT_FOUND',
      'CORE_ROWTYPE_UNDETERMINED',
    ]);
  });

  it('does not crash on a FAILED job without metrics', () => {
    const report = normalizeReport(failed as Validation, lookups);
    expect(report.files).toEqual([]);
    expect(report.hasIssues).toBe(false);
  });

  it('handles a partial result while running', () => {
    expect(fileNames(running as Validation)).toEqual(['meta.xml']);
  });

  it('tolerates missing and unknown values', () => {
    const report = normalizeReport(
      {
        status: 'FINISHED',
        fileFormat: 'DWC_DP',
        metrics: {
          files: [
            { fileName: 'a', fileType: null, issues: [{ issueCategory: 'NEW_CATEGORY' }] },
            { fileName: 'b', fileType: 'NEW_TYPE', terms: null, issues: null },
          ],
        },
      },
      emptyLookups
    );
    expect(report.files.map((file) => file.fileName)).toEqual(['a', 'b']);
    expect(report.summary).toEqual([
      { category: 'NEW_CATEGORY', issues: [{ id: 'UNKNOWN', severity: 'WARNING' }] },
    ]);
  });

  it('falls back to a fixed category order without the enumeration', () => {
    const report = normalizeReport(dwcaWithIssues as Validation, {
      ...lookups,
      categoryOrder: undefined,
    });
    const order = report.summary.map((entry) => entry.category);
    expect(order).toEqual(
      [...order].sort(
        (a, b) => FALLBACK_CATEGORY_ORDER.indexOf(a) - FALLBACK_CATEGORY_ORDER.indexOf(b)
      )
    );
  });
});

describe('normalizeReport: ColDP', () => {
  const report = normalizeReport(coldp as Validation, lookups);

  it('makes the file with issues the core and the others extensions', () => {
    expect(report.files.map((file) => [file.fileName, file.fileType])).toEqual([
      ['NameUsage.tsv', 'CORE'],
      ['Reference.tsv', 'EXTENSION'],
      ['Name.tsv', 'EXTENSION'],
    ]);
    expect(report.extensionCount).toBe(2);
  });

  it('normalises ChecklistBank issue names and uses their levels', () => {
    const clb = report.files[0].categories.find((c) => c.category === 'CLB_INTERPRETATION_BASED')!;
    expect(clb.issues.map((issue) => [issue.issue, issue.severity])).toEqual([
      ['ACCEPTED_NAME_MISSING', 'ERROR'],
      ['UNPARSABLE_NAME', 'ERROR'],
      ['BRAND_NEW_ISSUE', 'WARNING'],
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
    const report = normalizeReport({ ...(coldp as Validation), fileFormat: 'DWCA' }, lookups);
    expect(report.files.every((file) => file.fileType === undefined)).toBe(true);
  });
});

describe('getIssueSeverity', () => {
  it('uses the ChecklistBank level for ChecklistBank issues, never the occurrence remark', () => {
    expect(getIssueSeverity('UNPARSABLE_NAME', 'CLB_INTERPRETATION_BASED', lookups)).toBe('ERROR');
  });

  it('marks non-indexable issues as errors when they are known', () => {
    const withCritical = { ...lookups, nonIndexableIssues: new Set(['DWCA_UNREADABLE']) };
    expect(getIssueSeverity('DWCA_UNREADABLE', 'RESOURCE_STRUCTURE', withCritical)).toBe('ERROR');
    expect(getIssueSeverity('DWCA_UNREADABLE', 'RESOURCE_STRUCTURE', lookups)).toBe('WARNING');
  });
});

describe('mergeStructureIssues', () => {
  it('leaves other issues in place and appends the merged ones', () => {
    const merged = mergeStructureIssues([
      { issue: 'UNKNOWN_TERM', relatedData: 'a' },
      { issue: 'OTHER' },
      { issue: 'EML_GBIF_SCHEMA', samples: [] },
    ]);
    expect(merged.map((issue) => issue.issue)).toEqual([
      'OTHER',
      'UNKNOWN_TERM',
      'EML_GBIF_SCHEMA',
    ]);
    expect(merged[2].samples).toEqual([]);
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
    [51234, { value: 51, unit: 'kilobyte' }],
    [99999, { value: 100, unit: 'kilobyte' }],
    [100000, { value: 0.1, unit: 'megabyte' }],
    [2345678, { value: 2.3, unit: 'megabyte' }],
    ['400000', { value: 0.4, unit: 'megabyte' }],
    [undefined, undefined],
    ['n/a', undefined],
  ])('formats %j', (bytes, expected) => {
    expect(fileSize(bytes)).toEqual(expected);
  });
});
