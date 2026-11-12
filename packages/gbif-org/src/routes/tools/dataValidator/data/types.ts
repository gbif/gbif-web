import type { DataValidatorValidationQuery } from '@/gql/graphql';

// Shapes of the validator result as the GraphQL API returns it. Enums are open strings: the result
// changes with new formats, and parsing must not break.
export type Validation = NonNullable<DataValidatorValidationQuery['validation']>;

// DOWNLOADING, SUBMITTED, ACCEPTED, QUEUED, WAITING_FOR_CHECKLISTBANK, RUNNING, FINISHED, FAILED,
// ABORTED, NOT_FOUND, or a status added later
export type ValidationStatus = string;

export type ValidationMetrics = NonNullable<Validation['metrics']>;
export type ValidationStep = NonNullable<ValidationMetrics['stepTypes']>[number];
export type FileInfo = NonNullable<ValidationMetrics['files']>[number];
export type TermInfo = NonNullable<FileInfo['terms']>[number];
export type IssueInfo = NonNullable<FileInfo['issues']>[number];
export type IssueSample = NonNullable<IssueInfo['samples']>[number];
export type DwcExtension = NonNullable<FileInfo['extension']>;
