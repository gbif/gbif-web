import localContextAPI from './localContext.source';
import typeDef from './localContext.type';
import resolver from './localContext.resolver';

export default {
  resolver,
  typeDef,
  dataSource: {
    localContextAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
