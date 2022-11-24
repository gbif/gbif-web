import resolver from './occurrence.resolver';
import typeDef from './occurrence.type';
import searchTypeDef from './occurrenceSearch.type';
import searchClusterTypeDef from './occurrenceClusterSearch.type';

export default {
  resolver,
  typeDef: [typeDef, searchTypeDef, searchClusterTypeDef],
};
