// This array defines all the content types that are searchable in the resource search
// elasticSearchType is the name of the content type in elastic search
// graphQLType is the name of the GraphQL type the entry should be mapped to
// enumContentType is the value of the content type in the ContentType enum used to filter the results
export const SEARCH_RESULT_OPTIONS = Object.freeze([
  {
    elasticSearchType: 'dataUse',
    graphQLType: 'DataUse',
    enumContentType: 'DATA_USE',
  },
  {
    elasticSearchType: 'event',
    graphQLType: 'MeetingEvent',
    enumContentType: 'EVENT',
  },
  {
    elasticSearchType: 'notification',
    graphQLType: 'Notification',
    enumContentType: 'NOTIFICATION',
  },
  {
    elasticSearchType: 'news',
    graphQLType: 'News',
    enumContentType: 'NEWS',
  },
  {
    elasticSearchType: 'project',
    graphQLType: 'GbifProject',
    enumContentType: 'PROJECT',
  },
  {
    elasticSearchType: 'composition',
    graphQLType: 'Composition',
    enumContentType: 'COMPOSITION',
  },
  {
    elasticSearchType: 'tool',
    graphQLType: 'Tool',
    enumContentType: 'TOOL',
  },
  {
    elasticSearchType: 'document',
    graphQLType: 'Document',
    enumContentType: 'DOCUMENT',
  },
  {
    elasticSearchType: 'article',
    graphQLType: 'Article',
    enumContentType: 'ARTICLE',
  },
  {
    elasticSearchType: 'help',
    graphQLType: 'Help',
    enumContentType: 'HELP',
  },
  {
    elasticSearchType: 'literature',
    graphQLType: 'Literature',
    enumContentType: 'LITERATURE',
  },
  {
    elasticSearchType: 'programme',
    graphQLType: 'Programme',
    enumContentType: 'PROGRAMME',
  },
  {
    elasticSearchType: 'network',
    graphQLType: 'NetworkProse',
    enumContentType: 'NETWORK',
  },
]);
