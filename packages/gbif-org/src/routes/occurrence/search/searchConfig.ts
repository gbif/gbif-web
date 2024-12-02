import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true,
    },
    geometry: {
      defaultType: PredicateType.Within,
      v1: {
        supportedTypes: ['within'],
      },
    },
    publisherKey: {
      defaultKey: 'publishingOrg',
    },
  },
};

const otherParams = [
  'gadmGid',
  'hostingOrganizationKey',
  'networkKey',
  'publisherKey',
  'country',
  'publishingCountry',
  'taxonKey',
  'institutionKey',
  'collectionKey',
  'datasetKey',

  'establishmentMeans',
  
  'institutionCode',
  'collectionCode',
  'recordNumber',

  'license',
  'basisOfRecord',
  'mediaType',
  'month',
  'continent',
  'protocol',
  'dwcaExtension',
  'iucnRedListCategory',
  'typeStatus',
  'issue',
  'occurrenceStatus',
  
  'projectId',
  'recordedById',
  'identifiedById',
  'occurrenceId',
  'organismId',
  'higherGeography',
  'eventId',
  
  'isInCluster',

  'catalogNumber',
  'recordedBy',
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
