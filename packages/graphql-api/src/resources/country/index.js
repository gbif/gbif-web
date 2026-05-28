import countryAPI from './country.source';
import resolver from './country.resolver';
import typeDef from './country.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    countryAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
