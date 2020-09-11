const NodeApi = require('./node.source');

module.exports = {
  resolver: require('./node.resolver'),
  typeDef: require('./node.type'),
  dataSource: {
    nodeAPI: NodeApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};