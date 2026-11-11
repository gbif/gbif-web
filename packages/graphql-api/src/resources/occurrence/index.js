import resolver from './occurrence.resolver';
import occurrenceAPI from './occurrence.source';
import occurrenceV1API from './occurrenceV1.source';
import typeDef from './occurrence.type';
import searchTypeDef from './occurrenceSearch.type';

export default {
  resolver,
  typeDef: [typeDef, searchTypeDef],
  dataSource: {
    occurrenceAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
    occurrenceV1API,
  },
};
