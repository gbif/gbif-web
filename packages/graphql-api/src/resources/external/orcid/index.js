const OrcidApi = require('./orcid.source');

module.exports = {
  resolver: require('./orcid.resolver'),
  typeDef: require('./orcid.type'),
  dataSource: {
    orcidAPI: OrcidApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};