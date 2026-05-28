import resolver from './literature.resolver';
import typeDef from './literature.type';
import literatureAPI from './literature.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    literatureAPI,
  },
};
