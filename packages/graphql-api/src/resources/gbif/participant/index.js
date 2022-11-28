import resolver from './participant.resolver';
import typeDef from './participant.type';
import participantAPI from './participant.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    participantAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
