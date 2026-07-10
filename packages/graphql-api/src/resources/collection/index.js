import collectionAPI from './collection.source';
import resolver from './collection.resolver';
import typeDef from './collection.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    collectionAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
