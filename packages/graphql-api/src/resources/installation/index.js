const InstallationApi = require('./installation.source');

module.exports = {
  resolver: require('./installation.resolver'),
  typeDef: require('./installation.type'),
  dataSource: {
    installationAPI: new InstallationApi()
  }
};