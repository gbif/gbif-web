import { NotFoundError } from '#/helpers/GraphQL404Error';
import { RESORUCE_OPTIONS } from './resource.constants';

function elasticSearchTypeToGraphQLType(elasticSearchType) {
  return RESORUCE_OPTIONS.find(
    (option) => option.elasticSearchType === elasticSearchType,
  ).graphQLType;
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    resource: async (
      _,
      { id, alias },
      { dataSources, locale, preview },
      info,
    ) => {
      if (typeof id === 'string') {
        return dataSources.resourceAPI.getEntryById({
          id,
          locale,
          preview,
          info,
        });
      }

      if (typeof alias === 'string') {
        return dataSources.resourceSearchAPI
          .getFirstEntryByQuery({ urlAlias: alias }, locale)
          .then((data) => {
            if (!data) {
              throw new NotFoundError();
            }
            if (preview) {
              // less useful as the resourceSearch cannot use the preview param, but at least it gets fresh data, but it isn't the draft version
              info.cacheControl.setCacheHint({
                maxAge: 1, // seconds
              });
            }
            return data;
          });
      }

      throw new Error('Either id or alias must be provided');
    },
  },
  Resource: {
    __resolveType: (src) => {
      const graphqlType = elasticSearchTypeToGraphQLType(src.contentType);
      if (graphqlType) return graphqlType;
      console.warn(
        `Unknown content type in resource.resolver.js: ${src.contentType}`,
      );
    },
  },
};
