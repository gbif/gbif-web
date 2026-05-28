import resolver from './directoryPerson.resolver';
import typeDef from './directoryPerson.type';
import directoryPersonAPI from './directoryPerson.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    directoryPersonAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
