// same as getMetrics, but with url params instead of predicates

// example of a "getSearchFunction" function
// const getSourceSearch = (dataSources) => (args) =>
//   dataSources.collectionAPI.searchCollections.call(
//     dataSources.collectionAPI,
//     args,
//   );

/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query a map the result
 * @param {String} field
 * @param {Function} getSearchFunction
 */
export const getFacet =
  (field, getSearchFunction) =>
  (parent, { limit = 10, offset = 0 }, { dataSources }) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the species search query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      ...parent._query,
      limit: 0,
      facet: field,
      facetLimit: limit,
      facetOffset: offset,
    };
    // query the API, and throw away anything but the facet counts
    return searchApi({ query }).then((data) => [
      ...data.facets[0].counts.map((facet) => ({
        ...facet,
        // attach the query, but add the facet as a filter
        _query: {
          ...parent._query,
          [field]: facet.name,
        },
      })),
    ]);
  };

/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query a map the result
 * @param {String} field
 * @param {Function} getSearchFunction
 */
export const getCardinality =
  (field, getSearchFunction) =>
  (parent, args, { dataSources }) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the species search query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      ...parent._query,
      limit: 0,
      facet: field,
      facetLimit: 0,
      facetOffset: 0,
    };
    // query the API, and throw away anything but the facet counts
    return searchApi({ query }).then((data) => data.facets?.[0]?.cardinality);
  };
