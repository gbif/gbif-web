import localContextAPI from './localContext.source';
import typeDef from './localContext.type';

export default {
  typeDef,
  dataSource: {
    localContextAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
