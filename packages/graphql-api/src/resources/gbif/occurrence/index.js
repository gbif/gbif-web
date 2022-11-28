import resolver from './occurrence.resolver';
import typeDef from './occurrence.type';
import searchTypeDef from './occurrenceSearch.type';
import searchClusterTypeDef from './occurrenceClusterSearch.type';
import occurrenceAPI from './occurrence.source';

export default {
  resolver,
  typeDef: [typeDef, searchTypeDef, searchClusterTypeDef],
  dataSource: {
    occurrenceAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
