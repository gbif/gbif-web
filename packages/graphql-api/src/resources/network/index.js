const NetworkApi = require('./network.source');

module.exports = {
  resolver: require('./network.resolver'),
  typeDef: require('./network.type'),
  dataSource: {
    networkAPI: NetworkApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};