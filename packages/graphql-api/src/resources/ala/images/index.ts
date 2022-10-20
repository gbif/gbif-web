import resolver from './images.resolver';
import typeDef from './images.type';
import imagesAPI from './images.source';

export default {
  resolver,
  typeDef,
  dataSource: {
    imagesAPI,
  },
};
