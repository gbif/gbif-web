import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

export const searchConfig: FilterConfigType = {
  fields: {
    q: {
      singleValue: true
    },
    country: {
      singleValue: true
    },
    institutionKey: {},
    taxonKey: {},
    geometry: {
      defaultType: PredicateType.Within,
      v1: {
        supportedTypes: ['within']
      }
    }
  } 
}