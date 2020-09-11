const CollectionApi = require('./collection.source');

module.exports = {
  resolver: require('./collection.resolver'),
  typeDef: require('./collection.type'),
  dataSource: {
    collectionAPI: CollectionApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};