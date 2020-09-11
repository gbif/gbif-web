const DatasetApi = require('./dataset.source');

module.exports = {
  resolver: require('./dataset.resolver'),
  typeDef: require('./dataset.type'),
  dataSource: {
    datasetAPI: DatasetApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};