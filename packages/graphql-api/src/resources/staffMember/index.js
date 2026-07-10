import resolver from './staffMember.resolver';
import typeDef from './staffMember.type';
import staffMemberAPI from './staffMember.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    staffMemberAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
