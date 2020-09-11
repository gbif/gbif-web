const OrganizationApi = require('./organization.source');

module.exports = {
  resolver: require('./organization.resolver'),
  typeDef: require('./organization.type'),
  dataSource: {
    organizationAPI: OrganizationApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};