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
    year: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
  },
};

const otherParams = [
  'year',
  'literatureType',
  'relevance',
  'topics',
  'q',
  'publishingOrganizationKey',
  'gbifDatasetKey',
  'countriesOfResearcher',
  'countriesOfCoverage',
  'gbifTaxonKey',
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
