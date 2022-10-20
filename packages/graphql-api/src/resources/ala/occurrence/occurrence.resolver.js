import getOccurrenceFacet from './helpers/getOccurrenceFacet';
import fieldsWithOccurrenceFacetSupport from './helpers/fieldsWithOccurrenceFacetSupport';

const occurrenceFacetReducer = (dictionary, facetName) => {
  // eslint-disable-next-line no-param-reassign
  dictionary[facetName] = getOccurrenceFacet(facetName);
  return dictionary;
};

const OccurrenceFacet = fieldsWithOccurrenceFacetSupport.reduce(
  occurrenceFacetReducer,
  {},
);

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    biocacheSearch: (parent, args, { dataSources }) =>
      dataSources.occurrenceAPI.searchBiocache(args),
  },
  OccurrenceFacet,
  Occurrence: {
    imageMeta: (parent, args, { dataSources }) =>
      parent.image ? dataSources.imagesAPI.getMeta(parent.image) : null,
  },
};
