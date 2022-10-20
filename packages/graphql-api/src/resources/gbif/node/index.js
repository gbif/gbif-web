import resolver from './node.resolver';
import typeDef from './node.type';
import nodeAPI from './node.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    nodeAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
