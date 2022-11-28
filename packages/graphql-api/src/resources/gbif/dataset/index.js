import datasetAPI from './dataset.source';
import * as resolver from './dataset.resolver';
import typeDef from './dataset.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    datasetAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
