export type RelatedDatasetRow = {
  key: string;
  val: string;
};

export type DerivedDatasetPayload = {
  title: string;
  sourceUrl: string;
  description: string;
  originalDownloadDOI?: string;
  registrationDate?: string;
  relatedDatasets: Record<string, number>;
};

export type RegistrationResult = {
  doi: string;
};

export type ServerError = {
  code?: string;
  message?: string;
};
