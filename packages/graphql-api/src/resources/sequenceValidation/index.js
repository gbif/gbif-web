import resolver from './sequenceValidation.resolver';
import sequenceValidationAPI from './sequenceValidation.source';
import typeDef from './sequenceValidation.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    sequenceValidationAPI,
  },
};
