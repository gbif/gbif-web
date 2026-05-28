import resolver from './validation.resolver';
import validationAPI from './validation.source';
import typeDef from './validation.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    validationAPI,
  },
};
