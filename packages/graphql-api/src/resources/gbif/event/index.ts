import resolver from './event.resolver';
import typeDef from './event.type';
import eventAPI from './event.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    eventAPI,
  },
};
