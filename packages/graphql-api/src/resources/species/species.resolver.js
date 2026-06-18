export default {
  Query: {
    speciesKey: (parent, { key }, { dataSources }) => {
      return dataSources.speciesAPI.speciesByKey({
        key,
      });
    },
  },
};
