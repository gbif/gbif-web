import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

export const searchConfig: FilterConfigType = {
  fields: {
    q: {
      singleValue: true,
      defaultType: PredicateType.Fuzzy,
      v1: {
        supportedTypes: ['fuzzy'],
      },
    },
  },
};

const otherParams = [
  'countriesOfCoverage',
  'topics',
  'countriesOfResearcher',
  'contractCountry',
  'gbifProgrammeAcronym',
  'purposes',
];

otherParams.forEach((filter) => {
  searchConfig.fields = searchConfig.fields ?? {};
  searchConfig.fields[filter] = searchConfig.fields[filter] || {};
});
