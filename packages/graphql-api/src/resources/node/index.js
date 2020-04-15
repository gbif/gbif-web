const NodeApi = require('./node.source');

module.exports = {
  resolver: require('./node.resolver'),
  typeDef: require('./node.type'),
  dataSource: {
    nodeAPI: new NodeApi()
  }
};