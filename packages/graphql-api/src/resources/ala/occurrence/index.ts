import resolver from './occurrence.resolver';
import typeDef from './occurrence.type';
import occurrenceAPI from './occurrence.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    occurrenceAPI,
  },
};
