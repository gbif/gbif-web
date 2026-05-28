import resolver from './taxonMedia.resolver';
import typeDef from './taxonMedia.type';
import taxonMediaAPI from './taxonMedia.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    taxonMediaAPI,
  },
};
