import downloadAPI from './download.source';
import resolver from './download.resolver';
import typeDef from './download.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    downloadAPI,
  },
};
