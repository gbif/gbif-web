/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query a map the result
 * @param {String} facetKey
 */
const getTaxonFacet =
  (facetKey) =>
    (parent, { limit = 10, offset = 0 }, { dataSources }) => {
      // generate the species search query, by inherting from the parent query, and map limit/offset to facet equivalents
      const query = {
        ...parent._query,
        limit: 0,
        facet: facetKey,
        facetLimit: limit,
        facetOffset: offset,
      };
      // query the API, and throw away anything but the facet counts
      return dataSources.taxonAPI.searchTaxa({ query }).then((data) => [
        ...data.facets[0].counts.map((facet) => ({
          ...facet,
          // attach the query, but add the facet as a filter
          _query: {
            ...parent._query,
            [facetKey]: facet.name,
          },
        })),
      ]);
    };

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    taxonSearch: (parent, { query = {}, ...args } = {}, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({ query: { ...args, ...query } }),
    backboneSearch: (parent, { query = {}, ...args } = {}, { dataSources }) =>
      dataSources.taxonAPI.searchBackbone({ query: { ...args, ...query } }),
    taxon: (parent, { key }, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key }),
    checklistRoots: (parent, { datasetKey: key, ...query }, { dataSources }) =>
      dataSources.taxonAPI.getChecklistRoots({ key, query }),
    taxonSuggestions: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.getSuggestions(query)
  },
  Taxon: {
    dataset: ({ datasetKey }, args, { dataSources }) =>
      dataSources.datasetAPI.getDatasetByKey({ key: datasetKey }),
    formattedName: ({ key }, args, { dataSources }) =>
      dataSources.taxonAPI.getParsedName({ key }),
    wikiData: ({ key }, args, { dataSources }) =>
      dataSources.wikidataAPI.getWikiDataTaxonData(key),
    backboneTaxon: ({ key, nubKey }, args, { dataSources }) => {
      if (typeof nubKey === 'undefined' || key === nubKey) return null;
      return dataSources.taxonAPI.getTaxonByKey({ key: nubKey });
    },
    taxonImages_volatile: ({ key, nubKey }, { size }, { dataSources }) =>
      dataSources.taxonMediaAPI.getRepresentativeImages({ taxon: nubKey ?? key, dataSources, size }),
  },
  TaxonSearchResult: {
    facet: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
    }), // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
  },
  TaxonFacet: {
    rank: getTaxonFacet('rank'),
    status: getTaxonFacet('status'),
    highertaxonKey: getTaxonFacet('highertaxonKey'),
    issue: getTaxonFacet('issue'),
  },
  TaxonFacetResult: {
    taxonSearch: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({
        query: { ...parent._query, ...query },
      }),
  },
  TaxonBreakdown: {
    taxon: ({ name: key }, args, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key }),
    taxonSearch: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({
        query: { ...parent._query, ...query },
      }),
  },
};
