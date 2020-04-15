const DatasetApi = require('./dataset.source');

module.exports = {
  resolver: require('./dataset.resolver'),
  typeDef: require('./dataset.type'),
  dataSource: {
    datasetAPI: new DatasetApi()
  }
};