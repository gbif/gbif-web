import config from '@/config';

const DEFAULT_CHECKLIST_KEY =
  config.defaultChecklist ?? 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c'; // Backbone key for classification

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    taxonInfo: (parent, { datasetKey, key }, { dataSources }) =>
      dataSources.taxonAPI.getTaxonInfo({ datasetKey, key }),
    taxon: (parent, { datasetKey, key }, { dataSources }) =>
      dataSources.taxonAPI.getTaxon({ datasetKey, key }),
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
    vernacularName: ({ vernacularNames }, { language = 'eng' }) => {
      if (!vernacularNames || vernacularNames.length < 1) return null;
      const filtered = vernacularNames.filter(
        (item) => item.language === language,
      );
      if (filtered.length === 0) return null;
      // count how frequent each vernacularName is used
      const counts = filtered.reduce((acc, item) => {
        acc[item.vernacularName] = (acc[item.vernacularName] || 0) + 1;
        return acc;
      }, {});
      // sort the list by the frequency of the vernacularName, this is simply to avoid the odd outliers that occasionally appear since it is a list stiched together from multiple sources
      filtered.sort(
        (a, b) => counts[b.vernacularName] - counts[a.vernacularName],
      );
      return filtered[0];
    },
  },
  Taxon: {
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
    // sourceTaxon: ({ sourceID, sourceDatasetKey }, args, { dataSources }) => {
    //   if (!sourceID || !sourceDatasetKey) return null;
    //   return dataSources.taxonAPI.getTaxon({
    //     key: sourceID,
    //     datasetKey: sourceDatasetKey,
    //   });
    // },
    occurrenceMedia: ({ taxonID, datasetKey }, args, { dataSources }) => {
      if (datasetKey !== DEFAULT_CHECKLIST_KEY) {
        return {
          count: 0,
          results: [],
          offset: args.offset,
          limit: args.limit,
          endOfRecords: true,
        }; // occurrence media is only precached for our primary taxonomy. colXR at time of writing
      }

      return dataSources.taxonAPI.getTaxonOccurrenceMedia({
        taxonKey: taxonID,
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
  },
};
