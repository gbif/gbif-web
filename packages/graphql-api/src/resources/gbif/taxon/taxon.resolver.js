import config from '#/config';
import axios from 'axios';
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
      dataSources.taxonAPI.getSuggestions(query),
    taxonBySourceId: (parent, { sourceId, datasetKey }, { dataSources }) =>
      dataSources.taxonAPI.getTaxonBySourceId({ sourceId, datasetKey }),
  },
  Taxon: {
    dataset: ({ datasetKey }, args, { dataSources }) =>
      dataSources.datasetAPI.getDatasetByKey({ key: datasetKey }),
    formattedName: (
      { key, scientificName },
      { useFallback },
      { dataSources },
    ) => {
      return dataSources.taxonAPI
        .getParsedName({ key })
        .then((formattedName) => {
          return formattedName;
        })
        .catch((err) => {
          if (useFallback) {
            return name;
          }
          throw err;
        });
    },
    wikiData: ({ key }, args, { dataSources }) =>
      dataSources.wikidataAPI.getWikiDataTaxonData(key),
    backboneTaxon: ({ key, nubKey }, args, { dataSources }) => {
      if (typeof nubKey === 'undefined' || key === nubKey) return null;
      return dataSources.taxonAPI.getTaxonByKey({ key: nubKey });
    },
    acceptedTaxon: ({ key, acceptedKey }, args, { dataSources }) => {
      if (typeof acceptedKey === 'undefined' || key === acceptedKey)
        return null;
      return dataSources.taxonAPI.getTaxonByKey({ key: acceptedKey });
    },
    taxonImages_volatile: ({ key, nubKey }, { size }, { dataSources }) =>
      dataSources.taxonMediaAPI.getRepresentativeImages({
        taxon: nubKey ?? key,
        dataSources,
        size,
      }),
    speciesCount: ({ key }, args, { dataSources }) =>
      getTaxonFacet('rank')(
        { _query: { higherTaxonKey: key } },
        { limit: 100 },
        { dataSources },
      ).then((data) => {
        return data.find((d) => d.name === 'SPECIES')?.count || 0;
      }),
    checklistBankBreakdown: async ({ key }, args, { dataSources }) => {
      const taxon = await dataSources.taxonAPI.getTaxonByKey({ key });
      if (taxon.origin === 'DENORMED_CLASSIFICATION') {
        return null;
      }
      const dataset = await dataSources.datasetAPI.getDatasetByKey({
        key: taxon.datasetKey,
      });
      const clbDatasetKey = dataset?.identifiers.find(
        (i) => i.type === 'CLB_DATASET_KEY',
      )?.identifier;

      if (clbDatasetKey) {
        const breakdown = await axios.get(
          `https://api.checklistbank.org/dataset/${clbDatasetKey}/taxon/${
            taxon.datasetKey === config.gbifBackboneUUID ? key : taxon.taxonID
          }/breakdown`,
        );
        return breakdown.data
          .filter((t) => t.species > 0)
          .map((t) => ({
            ...t,
            children: t.children
              .filter((c) => c.species > 0)
              .sort((a, b) => b.species - a.species),
          }))
          .sort((a, b) => b.species - a.species);
      }
      console.log(
        `No CLB_DATASET_KEY found in identifiers for dataset ${dataset?.key}`,
      );
      console.log(dataset?.identifiers);

      return null;
    },
  },
  TaxonSearchResult: {
    facet: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
    }), // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
  },
  TaxonFacet: {
    rank: getTaxonFacet('rank'),
    status: getTaxonFacet('status'),
    higherTaxonKey: getTaxonFacet('highertaxonKey'),
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
