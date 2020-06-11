const InstitutionApi = require('./institution.source');

module.exports = {
  resolver: require('./institution.resolver'),
  typeDef: require('./institution.type'),
  dataSource: {
    institutionAPI: new InstitutionApi()
  }
};