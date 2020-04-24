const ParticipantApi = require('./participant.source');

module.exports = {
  resolver: require('./participant.resolver'),
  typeDef: require('./participant.type'),
  dataSource: {
    participantAPI: new ParticipantApi()
  }
};