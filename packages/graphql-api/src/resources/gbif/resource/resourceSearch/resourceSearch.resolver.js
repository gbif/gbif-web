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
    resourceSearch: async (
      _parent,
      { predicate, q, eventFiltering, ...params },
    ) => {
      // Apply content type filtering first
      const extendedPredicate = extendPredicateWithContentTypes(predicate);

      // Determine if event filtering should be applied
      const contentType = params.contentType?.map(
        emumContentTypeToElasticSearchType,
      );
      const includesEvents = !contentType || contentType.includes('event');

      // Use provided eventFiltering, or default to 'upcoming' if events are included
      const finalEventFiltering = includesEvents
        ? eventFiltering || 'upcoming'
        : undefined;

      return {
        _predicate: extendedPredicate,
        _q: q,
        _params: params,
        _eventFiltering: finalEventFiltering,
      };
    },
  },
  ResourceSearchResult: {
    documents: (parent, query, { dataSources, locale }) => {
      return dataSources.resourceSearchAPI.searchResourceDocuments({
        query: {
          predicate: parent._predicate,
          q: parent._q,
          ...parent._params,
          ...query,
        },
        locale,
        eventFiltering: parent._eventFiltering,
      });
    },
    facet: (parent) => {
      return { _predicate: parent._predicate, _q: parent._q };
    },
    _meta: (parent, query, { dataSources }) => {
      return dataSources.resourceSearchAPI.meta({
        query: {
          predicate: parent._predicate,
          q: parent._q,
          ...parent._params,
          ...query,
        },
        eventFiltering: parent._eventFiltering,
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

function extendPredicateWithContentTypes(predicate) {
  const contentTypes = SEARCH_RESULT_OPTIONS.map(
    (option) => option.elasticSearchType,
  );

  const extraPredicate = {
    type: 'in',
    key: 'contentType',
    values: contentTypes,
  };

  if (!predicate) {
    return extraPredicate;
  }
  // if the predicate is of type AND, then just add the extra to the array. Else wrap it in an AND
  if (predicate?.type === 'and') {
    return {
      ...predicate,
      predicates: [...predicate.predicates, extraPredicate],
    };
  }
  return {
    type: 'and',
    predicates: [predicate, extraPredicate],
  };
}
