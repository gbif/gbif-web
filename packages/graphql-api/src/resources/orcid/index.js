import resolver from './orcid.resolver';
import typeDef from './orcid.type';
import orcidAPI from './orcid.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    orcidAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
