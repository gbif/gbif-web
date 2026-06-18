import { merge } from 'lodash';
import speciesResolver from './species.resolver';
import speciesTypeDef from './species.type';
import speciesAPI from './species.source';

export default {
  resolver: merge({}, speciesResolver),
  typeDef: [speciesTypeDef],
  dataSource: {
    speciesAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
