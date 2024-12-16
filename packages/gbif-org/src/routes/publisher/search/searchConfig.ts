import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

export const searchConfig: FilterConfigType = {
  fields: {
    q: {
      singleValue: true,
      defaultType: PredicateType.Fuzzy,
    },
    country: {
      singleValue: true,
    },
  },
};
