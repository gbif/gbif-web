import { FilterType } from '@/contexts/filter';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { Predicate, PredicateType } from '@/gql/graphql';
import { parseSequenceFilterValue } from '@/utils/sequenceSearch';

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
    // The GraphQL facet field is `nucleotideSequenceTargetGene` (GraphQL names can't
    // contain dots), but the predicate key must be the dotted `nucleotideSequence.targetGene`
    // that the es-api / v1 understand (es-api upper-snake-cases it to
    // NUCLEOTIDE_SEQUENCE_TARGET_GENE).
    nucleotideSequenceTargetGene: {
      defaultKey: 'nucleotideSequence.targetGene',
    },
    nucleotideSequenceSequenceLength: {
      defaultKey: 'nucleotideSequence.sequenceLength',
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    // The "similar sequences" filter persists only { sequence, selected } in the URL; the
    // matched nucleotideSequenceIDs are recomputed and injected (as `ids`) into the
    // in-memory filter value by useSequenceAugmentedFilter. The serializer turns those IDs
    // into an `in` predicate on the nested field. While the sequence is still resolving
    // (no `ids` yet) it emits nothing.
    nucleotideSequenceId: {
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
        const { ids } = parsed as { ids?: string[] };
        if (!Array.isArray(ids) || ids.length === 0) return null;
        return {
          type: PredicateType.In,
          key: 'nucleotideSequence.nucleotideSequenceID',
          values: [...new Set(ids)],
        };
      },
    },
    // URL-only synthetic fields. In memory the "Sequence similarity" filter is a single handle
    // (nucleotideSequenceId holding { sequence, selected }); for a readable URL it is split into
    // these two params by urlEncodeFilter/urlDecodeFilter below. They are registered here so the
    // params are observed and round-tripped; serializer:()=>null keeps them out of the predicate
    // should they ever appear in the filter directly.
    'nucleotideSequence.sequence': { singleValue: true, serializer: () => null },
    'nucleotideSequence.similarity': { singleValue: true, serializer: () => null },
  },
  // Map the single in-memory handle to/from the two readable URL params. Applied only in the URL
  // layer (useFilterParams) so the predicate and the popover keep using `nucleotideSequenceId`.
  urlEncodeFilter: (filter: FilterType): FilterType => {
    const raw = filter?.must?.nucleotideSequenceId?.[0];
    if (raw == null) return filter;
    const value = parseSequenceFilterValue(raw);
    if (!value?.sequence) return filter;
    const { nucleotideSequenceId, ...restMust } = filter.must ?? {};
    return {
      ...filter,
      must: {
        ...restMust,
        'nucleotideSequence.sequence': [value.sequence],
        'nucleotideSequence.similarity': [JSON.stringify(value.selected ?? [])],
      },
    };
  },
  urlDecodeFilter: (filter: FilterType): FilterType => {
    const must = filter?.must;
    const seq = must?.['nucleotideSequence.sequence']?.[0];
    if (must == null || seq == null) return filter;
    const simRaw = must['nucleotideSequence.similarity']?.[0];
    let selected: string[] = [];
    if (Array.isArray(simRaw)) {
      selected = simRaw.map(String);
    } else if (typeof simRaw === 'string') {
      try {
        const parsed = JSON.parse(simRaw);
        if (Array.isArray(parsed)) selected = parsed.map(String);
      } catch {
        /* leave selected empty */
      }
    }
    const {
      'nucleotideSequence.sequence': _seq,
      'nucleotideSequence.similarity': _sim,
      ...restMust
    } = must;
    return {
      ...filter,
      must: {
        ...restMust,
        nucleotideSequenceId: [JSON.stringify({ sequence: String(seq), selected })],
      },
    };
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
