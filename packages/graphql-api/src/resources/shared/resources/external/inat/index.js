import resolver from './inat.resolver';
import typeDef from './inat.type';
import inatAPI from './inat.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    inatAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
