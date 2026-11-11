// Loose shapes of the validator API (gbif-validator `Validation`). Every field is optional and
// enums are open strings: the response changes with new formats, and parsing must not break.

// DOWNLOADING, SUBMITTED, ACCEPTED, QUEUED, WAITING_FOR_CHECKLISTBANK, RUNNING, FINISHED, FAILED,
// ABORTED, NOT_FOUND, or a status added later
export type ValidationStatus = string;

export type ValidationStep = {
  stepType?: string;
  status?: string;
  executionOrder?: number;
  message?: string;
};

export type IssueSample = {
  recordId?: string;
  relatedData?: Record<string, unknown> | null;
};

export type IssueInfo = {
  issue?: string;
  issueCategory?: string;
  count?: number | string;
  extra?: string;
  relatedData?: unknown;
  samples?: IssueSample[] | null;
};

export type TermInfo = {
  term?: string;
  rawIndexed?: number;
  interpretedIndexed?: number | null;
};

export type FileInfo = {
  fileType?: string | null;
  fileName?: string;
  rowType?: string;
  count?: number;
  indexedCount?: number | null;
  idTerm?: string;
  terms?: TermInfo[] | null;
  issues?: IssueInfo[] | null;
};

export type ValidationMetrics = {
  indexeable?: boolean;
  files?: FileInfo[] | null;
  stepTypes?: ValidationStep[] | null;
  receivedMediaType?: string;
  error?: string;
};

export type Validation = {
  key?: string;
  created?: string;
  modified?: string;
  file?: string;
  fileSize?: number | string;
  fileFormat?: string;
  status?: ValidationStatus;
  metrics?: ValidationMetrics | null;
};

export type InterpretationRemark = {
  id: string;
  severity?: string;
};

export type DwcExtension = {
  identifier: string;
  title?: string;
  description?: string;
  url?: string;
};
