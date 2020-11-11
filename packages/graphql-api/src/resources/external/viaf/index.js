const ViafApi = require('./viaf.source');

module.exports = {
  resolver: require('./viaf.resolver'),
  typeDef: require('./viaf.type'),
  dataSource: {
    viafAPI: ViafApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};