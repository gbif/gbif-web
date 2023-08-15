import resolver from './vocabulary.resolver';
import typeDef from './vocabulary.type';
import vocabularyAPI from './vocabulary.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    vocabularyAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
