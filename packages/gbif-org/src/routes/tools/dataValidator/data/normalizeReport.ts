import { isInProgress } from './pollingMachine';
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
  lookups: Pick<ValidatorLookups, 'remarks'>
): Severity {
  // as portal16: ChecklistBank's own levels are not GBIF indexing errors
  if (category === CLB_CATEGORY) return 'WARNING';
  return lookups.remarks[issue]?.severity ?? 'WARNING';
}

// The validator sends one EML_GBIF_SCHEMA issue per schema error. Issues with the same name in a
// file become one, keeping the first one's position, all samples and the summed count.
export function mergeSameIssues(issues: IssueInfo[]): IssueInfo[] {
  const byName = new Map<string, IssueInfo>();
  const merged: IssueInfo[] = [];
  for (const issue of issues) {
    const name = issue.issue ?? 'UNKNOWN';
    const first = byName.get(name);
    if (!first) {
      const copy = { ...issue, samples: [...(issue.samples ?? [])] };
      byName.set(name, copy);
      merged.push(copy);
      continue;
    }
    first.samples = [...(first.samples ?? []), ...(issue.samples ?? [])];
    const a = toNumber(first.count);
    const b = toNumber(issue.count);
    if (a !== undefined || b !== undefined) first.count = (a ?? 0) + (b ?? 0);
  }
  return merged;
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
  let coreRowType: string | undefined;
  let extensionCount = 0;

  const reportFiles = files.map((file): ReportFile => {
    if (file.fileType === 'CORE') coreRowType = file.rowType;
    if (file.fileType === 'EXTENSION') extensionCount++;

    const byCategory = new Map<string, ReportIssue[]>();
    for (const raw of mergeSameIssues(file.issues ?? [])) {
      const issue = raw.issue ?? 'UNKNOWN';
      const category = raw.issueCategory ?? 'UNKNOWN';
      const severity = getIssueSeverity(issue, category, lookups);

      const reportIssue: ReportIssue = {
        issue,
        issueCategory: category,
        severity,
        count: toNumber(raw.count),
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
  };
}

export type DisplayStep = ValidationStep & { stepType: string; status: string };

// a step that will never run because the job ended (failed, aborted) before reaching it
export const NOT_RUN = 'NOT_RUN';
const WAITING_STEP = new Set(['PENDING', 'QUEUED', 'WAITING_FOR_CHECKLISTBANK']);

// Steps without a status are pending; while the job is QUEUED the first of them is the queued one.
// Once the job has ended, steps that never started are NOT_RUN.
export function normalizeSteps(
  steps: ValidationStep[] | null | undefined,
  jobStatus: string | undefined
): DisplayStep[] {
  let queuedFound = false;
  const ended = !!jobStatus && !isInProgress(jobStatus);
  return [...(steps ?? [])]
    .filter((step) => typeof step?.stepType === 'string')
    .sort((a, b) => (a.executionOrder ?? 0) - (b.executionOrder ?? 0))
    .map((step) => {
      if (ended && (!step.status || WAITING_STEP.has(step.status))) {
        return { ...step, status: NOT_RUN } as DisplayStep;
      }
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
