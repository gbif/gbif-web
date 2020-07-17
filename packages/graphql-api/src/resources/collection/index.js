const CollectionApi = require('./collection.source');

module.exports = {
  resolver: require('./collection.resolver'),
  typeDef: require('./collection.type'),
  dataSource: {
    collectionAPI: new CollectionApi()
  }
};