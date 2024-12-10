import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';

export const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true,
    },
    // name: {
    //   singleValue: true
    // },
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
  'active',
  'code',
  'personalCollection',
  'recordedBy',
  'contentType',
  'preservationType',
  'alternativeCode',
  'city',
  'country',
  'typeStatus',
  'descriptorCountry',
  'numberSpecimens',
  'institutionKey',
  'taxonKey',
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
