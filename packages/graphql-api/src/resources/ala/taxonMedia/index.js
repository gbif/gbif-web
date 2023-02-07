import taxonMediaAPI from './taxonMedia.source';

export default {
  dataSource: {
    taxonMediaAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
