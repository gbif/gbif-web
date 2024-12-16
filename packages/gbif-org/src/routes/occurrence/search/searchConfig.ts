import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true,
      defaultType: PredicateType.Fuzzy,
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
    year: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    coordinateUncertainty: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    depth: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    organismQuantity: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    sampleSizeValue: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    relativeOrganismQuantity: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    elevation: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
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
  'isSequenced',

  'recordedBy',
  'identifiedBy',

  'catalogNumber',
  'sampleSizeUnit',
  'locality',
  'waterBody',
  'stateProvince',
  'samplingProtocol',
  'verbatimScientificName',

  'geometry',
  'hasCoordinate',
  'hasGeospatialIssue',
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
