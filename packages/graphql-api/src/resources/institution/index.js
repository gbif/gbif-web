const InstitutionApi = require('./institution.source');

module.exports = {
  resolver: require('./institution.resolver'),
  typeDef: require('./institution.type'),
  dataSource: {
    institutionAPI: InstitutionApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};