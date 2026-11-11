import { clbIssueLevels } from './clbIssueLevels';
import type {
  FileInfo,
  IssueInfo,
  IssueSample,
  TermInfo,
  Validation,
  ValidationStep,
} from './types';
import type { ValidatorLookups } from './useValidatorLookups';

export const CLB_CATEGORY = 'CLB_INTERPRETATION_BASED';
export const OCC_CATEGORY = 'OCC_INTERPRETATION_BASED';
const RESOURCE_STRUCTURE = 'RESOURCE_STRUCTURE';

// same preference as the validator backend uses to pick the ColDP file the issues are reported on
const COLDP_MAIN_ROW_TYPES = ['NameUsage', 'Taxon', 'Name', 'Reference'];

// used when the EvaluationCategory enumeration cannot be fetched
export const FALLBACK_CATEGORY_ORDER = [
  'RESOURCE_INTEGRITY',
  'RESOURCE_STRUCTURE',
  'METADATA_CONTENT',
  'RECORD_STRUCTURE',
  OCC_CATEGORY,
  CLB_CATEGORY,
];

const FILE_TYPE_ORDER = ['META_DESCRIPTOR', 'METADATA', 'CORE', 'EXTENSION'];

// ERROR, WARNING, INFO, or whatever a remark lists
export type Severity = string;

export type ReportIssue = {
  issue: string;
  issueCategory: string;
  severity: Severity;
  count?: number;
  extra?: string;
  // merged UNKNOWN_TERM and DUPLICATED_TERM issues: one entry per original issue
  relatedData?: unknown[];
  samples?: IssueSample[];
};

export type ReportCategory = { category: string; issues: ReportIssue[] };

export type ReportFile = {
  // safe for element ids and CSS selectors, unlike file names
  anchor: string;
  fileName?: string;
  fileType?: string;
  rowType?: string;
  count?: number;
  indexedCount?: number;
  idTerm?: string;
  terms: TermInfo[];
  hasInterpretedCounts: boolean;
  categories: ReportCategory[];
  issueCount: number;
};

export type SummaryIssue = { id: string; severity: Severity };

export type Report = {
  fileFormat?: string;
  indexeable?: boolean;
  hasIssues: boolean;
  summary: Array<{ category: string; issues: SummaryIssue[] }>;
  coreRowType?: string;
  extensionCount: number;
  files: ReportFile[];
  unknownTerms: Set<string>;
  zippedButNotDwca: boolean;
};

function severityRank(severity: Severity) {
  if (severity === 'INFO') return 3;
  if (severity === 'WARNING') return 2;
  return 1;
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function sortIssues<T extends { severity: Severity; count?: number }>(issues: T[]): T[] {
  return issues
    .map((issue, index) => ({ issue, index }))
    .sort(
      (a, b) =>
        severityRank(a.issue.severity) - severityRank(b.issue.severity) ||
        (b.issue.count ?? 0) - (a.issue.count ?? 0) ||
        a.index - b.index
    )
    .map(({ issue }) => issue);
}

function orderByCategory<T>(entries: Array<[string, T]>, categoryOrder: string[]) {
  const rank = (category: string) => {
    const index = categoryOrder.indexOf(category);
    return index === -1 ? categoryOrder.length : index;
  };
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => rank(a.entry[0]) - rank(b.entry[0]) || a.index - b.index)
    .map(({ entry }) => entry);
}

// ChecklistBank names its issues in lower case with spaces ("accepted name missing"); the
// translations use the enum names
export function normalizeClbIssueName(issue: IssueInfo): IssueInfo {
  if (issue.issueCategory !== CLB_CATEGORY || typeof issue.issue !== 'string') return issue;
  return { ...issue, issue: issue.issue.toUpperCase().replace(/ /g, '_') };
}

// ColDP results come without a file type. The file the issues are reported on is the core, the
// others are extensions.
export function assignColdpFileTypes(files: FileInfo[]): FileInfo[] {
  if (files.some((file) => file.fileType === 'CORE')) return files;
  const untyped = files.filter((file) => !file.fileType);
  if (untyped.length === 0) return files;

  let main = untyped.find((file) => (file.issues?.length ?? 0) > 0);
  if (!main) {
    const rank = (file: FileInfo) => {
      const index = COLDP_MAIN_ROW_TYPES.indexOf(file.rowType?.split('/').pop() ?? '');
      return index === -1 ? COLDP_MAIN_ROW_TYPES.length : index;
    };
    main = untyped.reduce((best, file) => (rank(file) < rank(best) ? file : best));
  }
  return files.map((file) =>
    file.fileType ? file : { ...file, fileType: file === main ? 'CORE' : 'EXTENSION' }
  );
}

export function getIssueSeverity(
  issue: string,
  category: string | undefined,
  lookups: Pick<ValidatorLookups, 'remarks' | 'nonIndexableIssues'>
): Severity {
  if (category === CLB_CATEGORY) return clbIssueLevels[issue] ?? 'WARNING';
  const remark = lookups.remarks[issue];
  if (remark?.severity) return remark.severity;
  return lookups.nonIndexableIssues.has(issue) ? 'ERROR' : 'WARNING';
}

const MERGED_RELATED_DATA = new Set(['UNKNOWN_TERM', 'DUPLICATED_TERM']);
const MERGED_SAMPLES = 'EML_GBIF_SCHEMA';

// One RESOURCE_STRUCTURE issue each for UNKNOWN_TERM, DUPLICATED_TERM (collecting relatedData)
// and EML_GBIF_SCHEMA (collecting the first sample of each), appended after the other issues.
export function mergeStructureIssues(issues: IssueInfo[]): IssueInfo[] {
  const kept = issues.filter(
    (issue) => !MERGED_RELATED_DATA.has(issue.issue ?? '') && issue.issue !== MERGED_SAMPLES
  );
  const merged: IssueInfo[] = [];
  for (const name of MERGED_RELATED_DATA) {
    const matching = issues.filter((issue) => issue.issue === name);
    if (matching.length > 0) {
      merged.push({
        issue: name,
        issueCategory: RESOURCE_STRUCTURE,
        relatedData: matching.map((issue) => issue.relatedData),
      });
    }
  }
  const emlIssues = issues.filter((issue) => issue.issue === MERGED_SAMPLES);
  if (emlIssues.length > 0) {
    merged.push({
      issue: MERGED_SAMPLES,
      issueCategory: RESOURCE_STRUCTURE,
      samples: emlIssues
        .map((issue) => issue.samples?.[0])
        .filter((sample): sample is IssueSample => !!sample),
    });
  }
  return [...kept, ...merged];
}

function collectTerms(values: unknown[] | undefined, into: Set<string>) {
  for (const value of values ?? []) {
    if (typeof value === 'string') into.add(value);
    else if (Array.isArray(value)) collectTerms(value, into);
  }
}

function fileAnchor(index: number) {
  return `validator-file-${index}`;
}

export function normalizeReport(validation: Validation, lookups: ValidatorLookups): Report {
  const metrics = validation.metrics ?? {};
  const categoryOrder = lookups.categoryOrder ?? FALLBACK_CATEGORY_ORDER;

  let files: FileInfo[] = (metrics.files ?? []).map((file) => ({
    ...file,
    issues: (file.issues ?? []).map(normalizeClbIssueName),
  }));
  if (validation.fileFormat === 'COLDP') files = assignColdpFileTypes(files);

  const summaryMap = new Map<string, Map<string, SummaryIssue>>();
  const unknownTerms = new Set<string>();
  let coreRowType: string | undefined;
  let extensionCount = 0;

  const reportFiles = files.map((file): ReportFile => {
    if (file.fileType === 'CORE') coreRowType = file.rowType;
    if (file.fileType === 'EXTENSION') extensionCount++;

    const byCategory = new Map<string, ReportIssue[]>();
    for (const raw of mergeStructureIssues(file.issues ?? [])) {
      const issue = raw.issue ?? 'UNKNOWN';
      const category = raw.issueCategory ?? 'UNKNOWN';
      const severity = getIssueSeverity(issue, category, lookups);
      if (MERGED_RELATED_DATA.has(issue)) collectTerms(raw.relatedData as unknown[], unknownTerms);

      const reportIssue: ReportIssue = {
        issue,
        issueCategory: category,
        severity,
        count: toNumber(raw.count),
        extra: raw.extra,
        relatedData: Array.isArray(raw.relatedData) ? raw.relatedData : undefined,
        samples: raw.samples && raw.samples.length > 0 ? raw.samples : undefined,
      };
      if (!byCategory.has(category)) byCategory.set(category, []);
      byCategory.get(category)!.push(reportIssue);

      if (!summaryMap.has(category)) summaryMap.set(category, new Map());
      summaryMap.get(category)!.set(issue, { id: issue, severity });
    }

    const categories = orderByCategory([...byCategory.entries()], categoryOrder).map(
      ([category, issues]) => ({ category, issues: sortIssues(issues) })
    );

    return {
      anchor: '',
      fileName: file.fileName,
      fileType: file.fileType ?? undefined,
      rowType: file.rowType,
      count: toNumber(file.count),
      indexedCount: toNumber(file.indexedCount),
      idTerm: file.idTerm,
      terms: file.terms ?? [],
      hasInterpretedCounts: (file.terms ?? []).some(
        (term) => typeof term.interpretedIndexed === 'number'
      ),
      categories,
      issueCount: categories.reduce((sum, category) => sum + category.issues.length, 0),
    };
  });

  const fileRank = (file: ReportFile) => {
    const index = FILE_TYPE_ORDER.indexOf(file.fileType ?? '');
    return index === -1 ? FILE_TYPE_ORDER.length : index;
  };
  const orderedFiles = reportFiles
    .map((file, index) => ({ file, index }))
    .sort((a, b) => fileRank(a.file) - fileRank(b.file) || a.index - b.index)
    .map(({ file }, index) => ({ ...file, anchor: fileAnchor(index) }));

  const summary = orderByCategory([...summaryMap.entries()], categoryOrder).map(
    ([category, issues]) => ({ category, issues: sortIssues([...issues.values()]) })
  );

  return {
    fileFormat: validation.fileFormat,
    indexeable: metrics.indexeable,
    hasIssues: summary.length > 0,
    summary,
    coreRowType,
    extensionCount,
    files: orderedFiles,
    unknownTerms,
    zippedButNotDwca:
      typeof metrics.receivedMediaType === 'string' &&
      metrics.receivedMediaType.includes('zip') &&
      validation.fileFormat !== 'DWCA',
  };
}

export type DisplayStep = ValidationStep & { stepType: string; status: string };

// Steps without a status are pending; while the job is QUEUED the first of them is the queued one.
export function normalizeSteps(
  steps: ValidationStep[] | null | undefined,
  jobStatus: string | undefined
): DisplayStep[] {
  let queuedFound = false;
  return [...(steps ?? [])]
    .filter((step) => typeof step?.stepType === 'string')
    .sort((a, b) => (a.executionOrder ?? 0) - (b.executionOrder ?? 0))
    .map((step) => {
      if (step.status) return step as DisplayStep;
      if (jobStatus === 'QUEUED' && !queuedFound) {
        queuedFound = true;
        return { ...step, status: 'QUEUED' } as DisplayStep;
      }
      return { ...step, status: 'PENDING' } as DisplayStep;
    });
}

export type FileSize = { value: number; unit: 'kilobyte' | 'megabyte' };

// same thresholds as portal16: kB below 100 000 bytes, MB from there
export function fileSize(bytes: unknown): FileSize | undefined {
  const value = toNumber(bytes);
  if (value === undefined || value < 0) return undefined;
  if (value < 100000) return { value: Math.round(value / 1000), unit: 'kilobyte' };
  return { value: Math.round(value / 100000) / 10, unit: 'megabyte' };
}
