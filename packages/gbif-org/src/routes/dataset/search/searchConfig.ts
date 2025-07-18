import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true,
      defaultType: PredicateType.Fuzzy,
      v1: {
        supportedTypes: ['fuzzy'],
      },
    },
    country: {
      singleValue: true,
    },
  },
};
const otherParams = [
  'license',
  'publishingCountry',
  'projectId',
  'hostingOrg',
  'publishingOrg',
  'networkKey',
  'hostingCountry',
  'taxonKey',
  'subtype',
  'type',
  'endorsingNodeKey',
  'installationKey',
  'endpointType',
  'dwcaExtension',
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
