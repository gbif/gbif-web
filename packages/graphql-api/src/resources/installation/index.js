import resolver from './installation.resolver';
import typeDef from './installation.type';
import installationAPI from './installation.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    installationAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
