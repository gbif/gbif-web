import { NotFoundError } from '@/helpers/GraphQL404Error';
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
      { id, alias, machineIdentifier },
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

      if (typeof alias === 'string' || typeof machineIdentifier === 'string') {
        const lookupQuery =
          typeof alias === 'string'
            ? { urlAlias: alias }
            : { machineIdentifier };
        const data = await dataSources.resourceSearchAPI.getFirstEntryByQuery(
          lookupQuery,
          locale,
        );

        if (!data) {
          throw new NotFoundError();
        }

        // If preview mode, re-fetch by ID to get draft content from Contentful
        if (preview && data.id) {
          return dataSources.resourceAPI.getEntryById({
            id: data.id,
            locale,
            preview,
            info,
          });
        }

        return data;
      }

      throw new Error(
        'Either id, alias, or machineIdentifier must be provided',
      );
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
