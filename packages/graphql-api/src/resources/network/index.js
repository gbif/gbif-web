import resolver from './network.resolver';
import typeDef from './network.type';
import networkAPI from './network.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    networkAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
