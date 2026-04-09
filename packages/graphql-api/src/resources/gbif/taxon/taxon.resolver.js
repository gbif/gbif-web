import config from '@/config';

const DEFAULT_CHECKLIST_KEY =
  config.defaultChecklist ?? 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c'; // Backbone key for classification

function stringCompare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

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
    return dataSources.taxonAPI
      .taxonSearch({ datasetKey: parent._datasetKey, query })
      .then((data) => [
        ...data.facets[0].counts.map((facet) => ({
          ...facet,
          // attach the query, but add the facet as a filter
          _query: {
            ...parent._query,
            [facetKey]: facet.name,
          },
          _datasetKey: parent._datasetKey,
        })),
      ]);
  };

const sharedTaxonFields = {
  dataset: ({ datasetKey }, args, { dataSources }) =>
    dataSources.datasetAPI.getDatasetByKey({ key: datasetKey }),
  // sourceDataset: ({ sourceDatasetKey }, args, { dataSources }) =>
  //   dataSources.datasetAPI.getDatasetByKey({ key: sourceDatasetKey }),
  acceptedTaxon: (
    { acceptedNameUsageID, datasetKey },
    args,
    { dataSources },
  ) => {
    if (!acceptedNameUsageID) return null;
    return dataSources.taxonAPI.getTaxon({
      key: acceptedNameUsageID,
      datasetKey,
    });
  },
  occurrenceMedia: (
    { taxonID, datasetKey = DEFAULT_CHECKLIST_KEY },
    args,
    { dataSources },
  ) => {
    return dataSources.taxonAPI.getTaxonOccurrenceMedia({
      taxonKey: taxonID,
      checklistKey: datasetKey,
      limit: 10,
      offset: 0,
      mediaType: 'stillImage',
      ...args,
    });
  },
  breakdown: (
    { taxonID, datasetKey = DEFAULT_CHECKLIST_KEY }, // TODO: taxonapi the default value should never be relevant, but currently the API is unstable and only return a datasetKey once in a while.
    { sortByCount },
    { dataSources },
  ) =>
    dataSources.taxonAPI
      .taxonBreakdown({ datasetKey, key: taxonID })
      .then((response) => {
        const breakdown = !sortByCount
          ? response?.breakdown
          : (response.breakdown ?? [])
              .filter((t) => t.species > 0)
              .sort((a, b) => b.species - a.species);
        return { ...response, breakdown };
      }),
  wikiData: ({ taxonID }, args, { dataSources }) =>
    dataSources.wikidataAPI.getWikiDataTaxonData(taxonID).then((response) => {
      // sort them by label
      return {
        ...response,
        identifiers: response.identifiers.sort((a, b) =>
          stringCompare(a.label.value, b.label.value),
        ),
      };
    }),
  relatedInfo: (
    { taxonID, datasetKey = DEFAULT_CHECKLIST_KEY },
    args,
    { dataSources },
  ) =>
    dataSources.taxonAPI
      .getRelatedTaxonInfo({ key: taxonID, datasetKey })
      .then((response) => {
        return {
          ...response,
          // sort griis list by countryCode
          griis: (response.griis ?? []).sort((a, b) =>
            stringCompare(a.countryCode, b.countryCode),
          ),
        };
      }),
  related: (
    { taxonID, datasetKey = DEFAULT_CHECKLIST_KEY },
    args,
    { dataSources },
  ) =>
    dataSources.taxonAPI.getRelated({
      key: taxonID,
      datasetKey,
      query: args,
    }),
  children: (
    { taxonID, datasetKey = DEFAULT_CHECKLIST_KEY },
    args,
    { dataSources },
  ) =>
    dataSources.taxonAPI.getChildren({
      key: taxonID,
      datasetKey,
      query: args,
    }),
  parentTree: (
    { taxonID, datasetKey = DEFAULT_CHECKLIST_KEY },
    args,
    { dataSources },
  ) =>
    dataSources.taxonAPI.getParents({
      key: taxonID,
      datasetKey,
    }),
};

function getVernacularName({ vernacularNames }, { language = 'eng' }) {
  if (!vernacularNames || vernacularNames.length < 1) return null;
  const filtered = vernacularNames.filter((item) => item.language === language);
  if (filtered.length === 0) return null;
  // count how frequent each vernacularName is used
  const counts = filtered.reduce((acc, item) => {
    acc[item.vernacularName] = (acc[item.vernacularName] || 0) + 1;
    return acc;
  }, {});
  // sort the list by the frequency of the vernacularName, this is simply to avoid the odd outliers that occasionally appear since it is a list stiched together from multiple sources
  filtered.sort((a, b) => counts[b.vernacularName] - counts[a.vernacularName]);
  return filtered[0];
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
    taxonSearch: (
      parent,
      { datasetKey = DEFAULT_CHECKLIST_KEY, query, ...args },
      { dataSources },
    ) =>
      dataSources.taxonAPI.taxonSearch({
        query: { ...args, ...query },
        datasetKey,
      }),
    taxonInfo: (
      parent,
      { datasetKey = DEFAULT_CHECKLIST_KEY, key },
      { dataSources },
    ) => dataSources.taxonAPI.getTaxonInfo({ datasetKey, key }),
    taxon: (
      parent,
      { datasetKey = DEFAULT_CHECKLIST_KEY, key },
      { dataSources },
    ) => dataSources.taxonAPI.getTaxon({ datasetKey, key }),
    speciesMatchByUsageKey: (
      parent,
      { usageKey, checklistKey = DEFAULT_CHECKLIST_KEY },
      { dataSources },
    ) =>
      dataSources.taxonAPI.getSpeciesMatchByUsageKey({
        usageKey,
        checklistKey,
      }),
    checklistMetadata: (parent, { checklistKey }, { dataSources }) =>
      dataSources.taxonAPI.getChecklistMetadata({ checklistKey }),
    datasetRoots: (
      parent,
      { datasetKey = DEFAULT_CHECKLIST_KEY },
      { dataSources },
    ) => dataSources.taxonAPI.getDatasetTree({ datasetKey }),
  },
  TaxonSearchResult: {
    facet: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
      _datasetKey: parent._datasetKey,
    }), // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
  },
  TaxonFacet: {
    taxonRank: getTaxonFacet('taxonRank'),
    taxonomicStatus: getTaxonFacet('taxonomicStatus'),
    issue: getTaxonFacet('issue'),
    taxonId: getTaxonFacet('taxonId'),
  },
  TaxonResult: {
    vernacularName: getVernacularName,
  },
  TaxonFacetResult_taxonId: {
    taxon: ({ name: key, _datasetKey }, args, { dataSources }) =>
      dataSources.taxonAPI.getTaxonInfo({ key, datasetKey: _datasetKey }),
    taxonSearch: (
      { _datasetKey, _query },
      { query, ...args },
      { dataSources },
    ) =>
      dataSources.taxonAPI.taxonSearch({
        datasetKey: _datasetKey,
        query: { ..._query, ...args, ...query },
      }),
  },
  ChecklistMetaMainIndex: {
    version: async ({ clbDatasetKey }, args, { dataSources }) => {
      try {
        const response = await dataSources.taxonAPI.getChecklistBankDataset({
          clbDatasetKey,
        });
        return response?.version;
      } catch (e) {
        console.error(
          `Error fetching version from ChecklistBank for dataset ${clbDatasetKey}`,
          e,
        );
        return null;
      }
    },
  },
  TaxonInfo: {
    // dataset: ({ datasetKey }, args, { dataSources }) =>
    //   dataSources.datasetAPI.getDatasetByKey({ key: datasetKey }),
    // wikiData: ({ key }, args, { dataSources }) =>
    //   dataSources.wikidataAPI.getWikiDataTaxonData(key),
    // backboneTaxon: ({ key, nubKey }, args, { dataSources }) => {
    //   if (typeof nubKey === 'undefined' || key === nubKey) return null;
    //   return dataSources.taxonAPI.getTaxonByKey({ key: nubKey });
    // },
    // acceptedTaxon: ({ key, acceptedKey }, args, { dataSources }) => {
    //   if (typeof acceptedKey === 'undefined' || key === acceptedKey)
    //     return null;
    //   return dataSources.taxonAPI.getTaxonByKey({ key: acceptedKey });
    // },
    // mapCapabilities: ({ key }, args, { dataSources }) => {
    //   if (typeof key === 'undefined') return null;
    //   return dataSources.occurrenceAPI.getMapCapabilities({ taxonKey: key });
    // },
    vernacularName: getVernacularName,
    scientificName: ({ taxon }) => taxon?.scientificName,
    label: ({ taxon }) => taxon?.scientificName,
    namePublishedIn: ({ taxon, bibliography }) => {
      if (!taxon?.namePublishedInID) return null;
      return (
        bibliography.find((b) => b.referenceID === taxon.namePublishedInID)
          ?.citation ?? null
      );
    },
  },
  TaxonSimple: {
    ...sharedTaxonFields,
    acceptedNameUsage: (
      { acceptedNameUsageID, datasetKey },
      args,
      { dataSources },
    ) => {
      if (!acceptedNameUsageID) return null;
      return dataSources.taxonAPI
        .getTaxon({
          key: acceptedNameUsageID,
          datasetKey,
        })
        .then((response) => {
          return response?.scientificName;
        });
    },
  },
  TaxonFull: {
    ...sharedTaxonFields,
  },
  TaxonChild: {
    childrenTree: sharedTaxonFields.children,
  },
  Griis: {
    dataset: ({ datasetKey }, args, { dataSources }) =>
      dataSources.datasetAPI.getDatasetByKey({ key: datasetKey }),
    isCountry: ({ locationID, countryCode }) => {
      if (!countryCode) return false;
      if (!locationID) return true;
      return locationID.startsWith('iso:') && locationID.length === 6;
    },
  },
};
