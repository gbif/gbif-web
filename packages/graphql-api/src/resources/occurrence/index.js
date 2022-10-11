const OccurrenceApi = require('./occurrence.source');

module.exports = {
  resolver: require('./occurrence.resolver'),
  typeDef: [require('./occurrence.type'), require('./occurrenceSearch.type'), require('./occurrenceClusterSearch.type')],
  dataSource: {
    occurrenceAPI: OccurrenceApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};