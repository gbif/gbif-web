const LiteratureApi = require('./literature.source');

module.exports = {
  resolver: require('./literature.resolver'),
  typeDef: require('./literature.type'),
  dataSource: {
    literatureAPI: LiteratureApi
  }
};