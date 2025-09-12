export type Endpoints = {
  graphqlEndpoint: string;
  translationsEntryEndpoint: string;
  formsEndpoint: string;
  feedbackEndpoint: string;
  v1Endpoint: string;
  contentSearchEndpoint: string;
};

export function getEndpoints(): Endpoints {
  const endpoints: Endpoints = {
    translationsEntryEndpoint: import.meta.env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT,
    graphqlEndpoint: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT,
    contentSearchEndpoint: import.meta.env.PUBLIC_CONTENT_SEARCH,
    formsEndpoint: import.meta.env.PUBLIC_FORMS_ENDPOINT,
    feedbackEndpoint: import.meta.env.PUBLIC_FEEDBACK_ENDPOINT,
    v1Endpoint: import.meta.env.PUBLIC_API_V1,
  };

  return endpoints;
}
