import resolver from './organization.resolver';
import typeDef from './organization.type';
import organizationAPI from './organization.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    organizationAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
