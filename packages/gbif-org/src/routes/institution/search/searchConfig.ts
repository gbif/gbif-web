import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

export const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true,
      defaultType: PredicateType.Fuzzy,
      v1: {
        supportedTypes: ['fuzzy'],
      },
    },
    numberSpecimens: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    occurrenceCount: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
  },
};

const otherParams = [
  'q',
  'active',
  'country',
  'type',
  'discipline',
  'alternativeCode',
  'city',
  'name',
  'code',
  'numberSpecimens',
  'occurrenceCount',
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
