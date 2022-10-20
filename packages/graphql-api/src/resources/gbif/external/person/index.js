import resolver from './person.resolver';
import typeDef from './person.type';
import personAPI from './person.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    personAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
