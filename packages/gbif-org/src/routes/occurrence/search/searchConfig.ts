import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { Predicate, PredicateType } from '@/gql/graphql';

const config: FilterConfigType = {
  fields: {
    q: {
      hoist: true,
      singleValue: true,
      defaultType: PredicateType.Fuzzy,
      v1: {
        supportedTypes: ['fuzzy'],
      },
    },
    predicate: {
      singleValue: true,
      // The value is the raw JSON predicate as a string. We keep it as a plain
      // string in the URL (no special v1 type) so it round-trips through the
      // v1 serializer like any other equals-string param.
      v1: {
        supportedTypes: ['equals'],
      },
      // The stored value is the user's full predicate — either a JSON string
      // (when set via the custom predicate filter UI) or an already-parsed
      // object (when loaded from the URL via querystring.tryParse). Return it
      // as the predicate directly, instead of letting the generic logic wrap
      // it in an equals-shaped envelope that leaves a stray `key` field on
      // download predicates.
      serializer: ({ values }): Predicate | null => {
        const raw = values?.[0];
        if (raw == null) return null;
        let parsed: unknown = raw;
        if (typeof raw === 'string') {
          try {
            parsed = JSON.parse(raw);
          } catch {
            return null;
          }
        }
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed as Predicate;
      },
    },
    geometry: {
      defaultType: PredicateType.Within,
      v1: {
        supportedTypes: ['within'],
      },
    },
    year: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    coordinateUncertaintyInMeters: {
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
    eventDate: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    taxonKey: {
      takesChecklistKey: true,
    },
    iucnRedListCategory: {
      takesChecklistKey: true,
    },
    taxonomicIssue: {
      takesChecklistKey: true,
    },
    lastInterpreted: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    distanceFromCentroidInMeters: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    endDayOfYear: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    startDayOfYear: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    geologicalTime: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
  },
};

const otherParams = [
  'gadmGid',
  'publishingOrg',
  'hostingOrganizationKey',
  'networkKey',
  'country',
  'publishingCountry',
  'institutionKey',
  'collectionKey',
  'datasetKey',

  'establishmentMeans',
  'sex',
  'lifeStage',

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
  'typeStatus',
  'issue',
  'taxonomicIssue',
  'occurrenceStatus',

  'projectId',
  'recordedById',
  'identifiedById',
  'occurrenceId',
  'organismId',
  'higherGeography',
  'eventId',
  'parentEventId',
  'fieldNumber',
  'taxonId',

  'isInCluster',
  'isSequenced',
  'repatriated',

  'recordedBy',
  'identifiedBy',

  'catalogNumber',
  'preparations',
  'lithostratigraphy',
  'biostratigraphy',
  'geologicalTime',
  'sampleSizeUnit',
  'locality',
  'waterBody',
  'stateProvince',
  'samplingProtocol',
  'verbatimScientificName',
  'datasetId',

  'islandGroup',
  'island',
  'georeferencedBy',
  'datasetName',
  'programme',
  'gbifRegion',
  'publishedByGbifRegion',

  'geometry',
  'hasCoordinate',
  'hasGeospatialIssue',
  'distanceFromCentroidInMeters',
  'lastInterpreted',
  'pathway',
  'degreeOfEstablishment',
  'associatedSequences',
  'previousIdentifications',
  'organismQuantityType',
  'endDayOfYear',
  'startDayOfYear',
  'gbifId',
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
