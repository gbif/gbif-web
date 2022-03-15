const EventApi = require('./event.source');

module.exports = {
  resolver: require('./event.resolver'),
  typeDef: [require('./event.type'), require('./eventSearch.type')],
  dataSource: {
    eventAPI: EventApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};