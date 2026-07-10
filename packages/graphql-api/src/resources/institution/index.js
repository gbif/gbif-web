import resolver from './institution.resolver';
import typeDef from './institution.type';
import institutionAPI from './institution.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    institutionAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
