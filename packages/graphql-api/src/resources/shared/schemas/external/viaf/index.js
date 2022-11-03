import resolver from './viaf.resolver';
import typeDef from './viaf.type';
import viafAPI from './viaf.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    viafAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
