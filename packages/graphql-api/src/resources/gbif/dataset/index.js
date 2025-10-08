import datasetAPI from './dataset.source';
import * as resolver from './dataset.resolver';
import typeDef from './dataset.type';
import checklistBankTypeDef from './checklistBankDataset.type';
import datasetByPredicateAPI from './datasetByPredicate.source';

export default {
  resolver,
  typeDef: [typeDef, checklistBankTypeDef],
  dataSource: {
    datasetAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
    datasetByPredicateAPI,
  },
};
