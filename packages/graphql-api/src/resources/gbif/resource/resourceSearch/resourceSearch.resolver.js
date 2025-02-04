import { SEARCH_RESULT_OPTIONS } from './resourceSearch.constants';

function emumContentTypeToElasticSearchType(enumContentType) {
  return SEARCH_RESULT_OPTIONS.find(
    (option) => option.enumContentType === enumContentType,
  ).elasticSearchType;
}

function elasticSearchTypeToGraphQLType(elasticSearchType) {
  return SEARCH_RESULT_OPTIONS.find(
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
    resourceSearch: async (_, args, { dataSources, locale }) => {
      // Map the GraphQL input to the ElasticSearch input
      const { limit: size, offset: from, contentType, ...rest } = args?.input;
      let elasticSearchInput = {
        size,
        from,
        ...rest,
        // By default, restrict the search options to the ones the API supports
        contentType:
          contentType?.map(emumContentTypeToElasticSearchType) ??
          SEARCH_RESULT_OPTIONS.map((option) => option.elasticSearchType),
      };

      // Remove the null values from the input
      Object.entries(elasticSearchInput).forEach(([key, value]) => {
        if (key in elasticSearchInput && value == null)
          delete elasticSearchInput[key];
      });

      const searchResult = await dataSources.resourceSearchAPI.search(
        elasticSearchInput,
        locale,
      );

      return {
        count: searchResult.total,
        endOfRecords:
          searchResult.total <= searchResult.from + searchResult.size,
        limit: elasticSearchInput?.size ?? 10,
        offset: searchResult.from,
        results: searchResult.results,
      };
    },
  },
  SingleSearchResult: {
    __resolveType: (src) => {
      const graphqlType = elasticSearchTypeToGraphQLType(src.contentType);
      if (graphqlType) return graphqlType;
      console.warn(
        `Unknown content type in resourceSearch.resolver.js: ${src.contentType}`,
      );
    },
  },
};
