import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true
    },
    geometry: {
      defaultType: PredicateType.Within,
      v1: {
        supportedTypes: ['within']
      }
    },
  } 
}

const otherParams = ['country', 'taxonKey', 'institutionKey', 'datasetKey', 'catalogNumber', 'recordedBy', 'higherGeography'];

otherParams.forEach(filter => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;