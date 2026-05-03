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
    sampleSizeValue: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    eventDate: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    humboldtTotalAreaSampledValue: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    humboldtSamplingEffortValue: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    humboldtEventDurationValue: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
  },
};

const otherParams = [
  'gadmGid',
  'country',

  'month',
  'continent',
  'dwcaExtension',

  'eventId',
  'eventType',

  'locality',
  'samplingProtocol',
  'sampleSizeUnit',
  'sampleSizeValue',

  'geometry',
  'hasCoordinate',
  'hasGeospatialIssue',
  'humboldtAreNonTargetTaxaFullyReported',
  'humboldtHasMaterialSamples',
  'humboldtHasNonTargetOrganisms',
  'humboldtHasNonTargetTaxa',
  'humboldtHasVouchers',
  'humboldtIsAbsenceReported',
  'humboldtIsAbundanceCapReported',
  'humboldtIsAbundanceReported',
  'humboldtIsDegreeOfEstablishmentScopeFullyReported',
  'humboldtIsGrowthFormScopeFullyReported',
  'humboldtIsLeastSpecificTargetCategoryQuantityInclusive',
  'humboldtIsLifeStageScopeFullyReported',
  'humboldtIsSamplingEffortReported',
  'humboldtIsTaxonomicScopeFullyReported',
  'humboldtIsVegetationCoverReported',
  'humboldtInventoryTypes',
  'humboldtProtocolNames',
  'humboldtSamplingPerformedBy',
  'humboldtSiteCount',
  'humboldtSamplingEffortUnit',
  'humboldtSamplingEffortValue',
  'humboldtTargetDegreeOfEstablishmentScope',
  'humboldtTargetGrowthFormScope',
  'humboldtTargetHabitatScope',
  'humboldtTargetLifeStageScope',
  'humboldtTotalAreaSampledUnit',
  'humboldtTotalAreaSampledValue',
  'humboldtEventDurationValue',
  'humboldtEventDurationUnit',
  'humboldtTargetTaxonomicScopeUsageName',
  'humboldtIsTaxonomicScopeFullyReported',
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
