const OrganizationApi = require('./organization.source');

module.exports = {
  resolver: require('./organization.resolver'),
  typeDef: require('./organization.type'),
  dataSource: {
    organizationAPI: new OrganizationApi()
  }
};