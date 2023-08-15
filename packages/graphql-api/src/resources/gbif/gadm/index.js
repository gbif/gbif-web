import resolver from './gadm.resolver';
import typeDef from './gadm.type';
import gadmAPI from './gadm.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    gadmAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
