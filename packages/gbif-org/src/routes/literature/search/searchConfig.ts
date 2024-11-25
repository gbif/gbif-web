import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';

export const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true,
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
