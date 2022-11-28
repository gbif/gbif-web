/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    institutionSearch: (parent, args, { dataSources }) =>
      dataSources.institutionAPI.searchInstitutions({ query: args }),
    institution: (parent, { key }, { dataSources }) =>
      dataSources.institutionAPI.getInstitutionByKey({ key }),
  },
  Institution: {
    collections: ({ key }, { limit, offset }, { dataSources }) => {
      return dataSources.collectionAPI.getCollectionsByInstitutionKey({
        key,
        limit,
        offset,
      });
    },
    collectionCount: ({ key }, args, { dataSources }) => {
      return dataSources.collectionAPI
        .getCollectionsByInstitutionKey({ key, limit: 1000 })
        .then((data) => data.length);
    },
    replacedByInstitution: ({ replacedBy }, args, { dataSources }) => {
      if (!replacedBy) return null;
      return dataSources.institutionAPI.getInstitutionByKey({
        key: replacedBy,
      });
    },
    occurrenceCount: ({ key }, args, { dataSources }) => {
      if (!key) return null;
      return dataSources.occurrenceAPI
        .searchOccurrenceDocuments({
          query: {
            predicate: { type: 'equals', key: 'institutionKey', value: key },
          },
        })
        .then((response) => response.total);
    },
    // someField: ({ fieldWithKey: key }, args, { dataSources }) => {
    //   if (typeof key === 'undefined') return null;
    //   dataSources.someAPI.getSomethingByKey({ key })
    // },
  },
};
