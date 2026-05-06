export const apiConstants = {
  api: import.meta.env.PUBLIC_API,
  v1Endpoint: import.meta.env.PUBLIC_API_V1,
  v2Endpoint: import.meta.env.PUBLIC_API_V2,
  taxonApi: import.meta.env.PUBLIC_API_V2 + '/experimental/taxon',
  occurrenceSearch: import.meta.env.PUBLIC_API_V1 + '/occurrence/search',
  literatureSearch: import.meta.env.PUBLIC_API_V1 + '/literature/search',
  organization: import.meta.env.PUBLIC_API_V1 + '/organization',
  datasetSearch: import.meta.env.PUBLIC_API_V1 + '/dataset/search',
};
