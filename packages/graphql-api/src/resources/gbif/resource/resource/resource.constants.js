// This array defines all the content types you can get through the resource API
// elasticSearchType is the name of the content type in elastic search
// graphQLType is the name of the GraphQL type the entry should be mapped to
export const RESORUCE_OPTIONS = Object.freeze([
  {
    elasticSearchType: 'programme',
    graphQLType: 'Programme',
  },
  {
    elasticSearchType: 'dataUse',
    graphQLType: 'DataUse',
  },
  {
    elasticSearchType: 'event',
    graphQLType: 'MeetingEvent',
  },
  {
    elasticSearchType: 'notification',
    graphQLType: 'Notification',
  },
  {
    elasticSearchType: 'news',
    graphQLType: 'News',
  },
  {
    elasticSearchType: 'project',
    graphQLType: 'GbifProject',
  },
  {
    elasticSearchType: 'composition',
    graphQLType: 'Composition',
  },
  {
    elasticSearchType: 'tool',
    graphQLType: 'Tool',
  },
  {
    elasticSearchType: 'document',
    graphQLType: 'Document',
  },
  {
    elasticSearchType: 'article',
    graphQLType: 'Article',
  },
  {
    elasticSearchType: 'help',
    graphQLType: 'Help',
  },
  {
    elasticSearchType: 'literature',
    graphQLType: 'Literature',
  },
  {
    elasticSearchType: 'network',
    graphQLType: 'NetworkProse',
  },
]);
