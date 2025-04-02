import { getFacet } from '../../getMetrics';
import { facetFields } from './helpers/fields';
import { SEARCH_RESULT_OPTIONS } from './resourceSearch.constants';

const getSourceSearch = (dataSources) => (args) =>
  dataSources.resourceSearchAPI.searchResources.call(
    dataSources.resourceSearchAPI,
    args,
  );

// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName, getSourceSearch);
  return dictionary;
};
const ResourceFacet = facetFields.reduce(facetReducer, {});

function elasticSearchTypeToGraphQLType(elasticSearchType) {
  return SEARCH_RESULT_OPTIONS.find(
    (option) => option.elasticSearchType === elasticSearchType,
  ).graphQLType;
}

function extendPredicateWithContentTypes(predicate) {
  const contentTypes = SEARCH_RESULT_OPTIONS.map(
    (option) => option.elasticSearchType,
  );
  const extraPredicate = {
    type: 'in',
    key: 'contentType',
    values: contentTypes,
  };
  // if the predicate is of type AND, then just add the extra to the array. Else wrap it in an AND
  if (predicate?.type === 'and') {
    return {
      ...predicate,
      predicates: [...predicate.predicates, extraPredicate],
    };
  }
  return {
    type: 'AND',
    predicates: [predicate, extraPredicate],
  };
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
    // resourceSearch: async (_, args, { dataSources, locale }) => {
    //   // Map the GraphQL input to the ElasticSearch input
    //   const { limit: size, offset: from, contentType, ...rest } = args?.input;
    //   let elasticSearchInput = {
    //     size,
    //     from,
    //     ...rest,
    //     // By default, restrict the search options to the ones the API supports
    //     contentType:
    //       contentType?.map(emumContentTypeToElasticSearchType) ??
    //       SEARCH_RESULT_OPTIONS.map((option) => option.elasticSearchType),
    //   };

    //   // Remove the null values from the input
    //   Object.entries(elasticSearchInput).forEach(([key, value]) => {
    //     if (key in elasticSearchInput && value == null)
    //       delete elasticSearchInput[key];
    //   });

    //   const searchResult = await dataSources.resourceSearchAPI.search(
    //     elasticSearchInput,
    //     locale,
    //   );

    //   return {
    //     count: searchResult.total,
    //     endOfRecords:
    //       searchResult.total <= searchResult.from + searchResult.size,
    //     limit: elasticSearchInput?.size ?? 10,
    //     offset: searchResult.from,
    //     results: searchResult.results,
    //   };
    // },
    resourceSearch: async (_parent, { predicate, ...params }) => {
      return {
        _predicate: predicate,
        _params: params,
      };
    },
  },
  ResourceSearchResult: {
    documents: (parent, query, { dataSources, locale }) => {
      return dataSources.resourceSearchAPI.searchResourceDocuments({
        query: {
          predicate: extendPredicateWithContentTypes(parent._predicate),
          ...parent._params,
          ...query,
        },
        locale,
      });
    },
    facet: (parent) => {
      return { _predicate: parent._predicate };
    },
    _meta: (parent, query, { dataSources }) => {
      return dataSources.resourceSearchAPI.meta({
        query: {
          predicate: extendPredicateWithContentTypes(parent._predicate),
          ...parent._params,
          ...query,
        },
      });
    },
  },
  ResourceFacet,
  Resource: {
    __resolveType: (src) => {
      const graphqlType = elasticSearchTypeToGraphQLType(src.contentType);
      if (graphqlType) return graphqlType;
      console.warn(
        `Unknown content type in resourceSearch.resolver.js: ${src.contentType}`,
      );
    },
  },
};
