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
      // the backbone is a special case apparently as backbone taxonIDs do not resolve,
      // unlike other all(?) other checklists
      // https://github.com/gbif/taxon-ws/issues/72
      const taxonKey = datasetKey === config.gbifBackboneUUID ? key : taxonID;

      return dataSources.taxonAPI.getTaxon({ datasetKey, key: taxonKey }).catch((err) => {
        // if the taxon is not found, return null instead of throwing an error since this is completely
        // expected. Not all past speciesKeys have a match and there is no reason to treat this as an exceptional case.
        if (err.extensions?.response?.status === 404) {
          return null;
        }
        throw err;
      });
    },
  },
};
