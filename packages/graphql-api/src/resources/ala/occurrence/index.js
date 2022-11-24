import shared from '../../shared/resources/occurrence';
import occurrenceAPI from './occurrence.source';

const { resolver, typeDef } = shared;

export default {
  resolver,
  typeDef,
  dataSource: {
    occurrenceAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
