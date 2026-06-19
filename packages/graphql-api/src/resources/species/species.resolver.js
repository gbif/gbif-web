import config from '@/config';

export default {
  Query: {
    speciesKey: (parent, { key }, { dataSources }) => {
      return dataSources.speciesAPI.speciesByKey({
        key,
      });
    },
  },
  SpeciesKey: {
    taxon: async ({ taxonID, datasetKey, key }, { ifDatasetKey }, { dataSources }) => {
      if (!taxonID || !datasetKey) {
        return null;
      }
      // allow filtering to only expand some datasets
      if (ifDatasetKey && datasetKey !== ifDatasetKey) {
        return null;
      }
      // the backbone is a special case apparently as backbone taxonIDs do not resolve,
      // unlike other all(?) other checklists
      // https://github.com/gbif/taxon-ws/issues/72
      const taxonKey = datasetKey === config.gbifBackboneUUID ? key : taxonID;

      return dataSources.taxonAPI.getTaxon({ datasetKey, key: taxonKey });
    },
  },
};
