const ParticipantApi = require('./participant.source');

module.exports = {
  resolver: require('./participant.resolver'),
  typeDef: require('./participant.type'),
  dataSource: {
    participantAPI: ParticipantApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};