const getTaxonFacet = (facetKey) =>
  (parent, { limit = 10, offset = 0 }, { dataSources }) => {
    const query = { ...parent._query, limit: 0, facet: facetKey, facetLimit: limit, facetOffset: offset };
    return dataSources.taxonAPI.searchTaxa({query})
      .then(data => (
        [
          ...data.facets[0].counts
            .map(
              facet => ({ ...facet, _query: { ...parent._query, [facetKey]: facet.name } })
            )
        ]
      )
      );
  }

/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    taxonSearch: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({ query }),
    taxon: (parent, { key }, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key })
  },
  Taxon: {
    dataset: ({ datasetKey }, args, { dataSources }) =>
      dataSources.datasetAPI.getDatasetByKey({ key: datasetKey })
  },
  TaxonSearchResult: {
    facet: (parent) => ({ _query: {...parent._query, limit: undefined, offset: undefined} }), // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
  },
  TaxonFacet: {
    rank: getTaxonFacet('rank'),
    status: getTaxonFacet('status'),
    higherTaxon: getTaxonFacet('highertaxonKey'),
    issue: getTaxonFacet('issue'),
  },
  TaxonFacetResult: {
    taxonSearch: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({ query: {...parent._query, ...query} }),
  },
  TaxonBreakdown: {
    taxon: ({name:key}, args, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key }),
    taxonSearch: (parent, query, { dataSources }) =>
      dataSources.taxonAPI.searchTaxa({ query: {...parent._query, ...query} }),
  }
};