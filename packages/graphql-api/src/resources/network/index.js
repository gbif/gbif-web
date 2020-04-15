const NetworkApi = require('./network.source');

module.exports = {
  resolver: require('./network.resolver'),
  typeDef: require('./network.type'),
  dataSource: {
    networkAPI: new NetworkApi()
  }
};