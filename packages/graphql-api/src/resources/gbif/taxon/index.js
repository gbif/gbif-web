import { merge } from 'lodash';
import taxonResolver from './taxon.resolver';
import taxonDetailsResolver from './taxonDetails.resolver';
import taxonTypeDef from './taxon.type';
import taxonDetailsTypeDef from './taxonDetails.type';
import taxonAPI from './taxon.source';

export default {
  resolver: merge({}, taxonResolver, taxonDetailsResolver),
  typeDef: [taxonTypeDef, taxonDetailsTypeDef],
  dataSource: {
    taxonAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
