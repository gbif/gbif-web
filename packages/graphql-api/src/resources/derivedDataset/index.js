import resolver from './derivedDataset.resolver';
import derivedDatasetAPI from './derivedDataset.source';
import typeDef from './derivedDataset.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    derivedDatasetAPI,
  },
};
