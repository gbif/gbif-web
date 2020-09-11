const InstallationApi = require('./installation.source');

module.exports = {
  resolver: require('./installation.resolver'),
  typeDef: require('./installation.type'),
  dataSource: {
    installationAPI: InstallationApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};