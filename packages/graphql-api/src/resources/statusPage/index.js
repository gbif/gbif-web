import statusPageAPI from './statusPage.source';
import resolver from './statusPage.resolver';
import typeDef from './statusPage.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    statusPageAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
