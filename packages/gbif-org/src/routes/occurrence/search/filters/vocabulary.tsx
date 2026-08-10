import {
  DegreeOfEstablishmentLabel,
  EstablishmentMeansLabel,
  LifeStageLabel,
  PathwayLabel,
  SexLabel,
  TargetGeneLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterSuggestConfig,
} from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import { parseSequenceFilterValue } from '@/utils/sequenceSearch';
import { pathwaySuggest } from '@/utils/suggestEndpoints';
// import { establishmentMeansSuggest } from '@/utils/suggestEndpoints';

export const establishmentMeansConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM, // could be a SUGGEST as well, but there isn't much to suggest as there aren't many options
  filterHandle: 'establishmentMeans',
  displayName: EstablishmentMeansLabel,
  filterTranslation: 'filters.establishmentMeans.name',
  // suggestConfig: establishmentMeansSuggest,
  facetQuery: `
    query OccurrenceEstablishmentMeansFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: establishmentMeans {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.establishmentMeans.description" />,
  group: 'occurrence',
};

export const lifeStageConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM, // could be a SUGGEST as well, but there isn't much to suggest as there aren't many options
  filterHandle: 'lifeStage',
  displayName: LifeStageLabel,
  filterTranslation: 'filters.lifeStage.name',
  facetQuery: `
    query OccurrenceLifeStageFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: lifeStage {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.lifeStage.description" />,
  group: 'occurrence',
  allowExistence: true,
  allowNegations: true,
};

export const nucleotideSequenceTargetGeneConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'nucleotideSequenceTargetGene',
  displayName: TargetGeneLabel,
  filterTranslation: 'filters.nucleotideSequenceTargetGene.name',
  // When the "Similar sequences" filter is active the sequence is nested: an occurrence can
  // carry several sequences, so a plain facet would count every gene present on the matched
  // occurrences — including other-gene sequences that merely co-occur with the matched one, and
  // selecting those yields zero results (they don't correlate with the matched sequence IDs).
  // Passing `sequenceIds` correlates the facet to the matched sequences, so only their own
  // gene(s) are listed and counted. `sequenceIds` are the in-memory IDs resolved by
  // useSequenceAugmentedFilter; absent → facet behaves as before.
  facetQuery: /* GraphQL */ `
    query OccurrenceTargetGeneFacet($q: String, $predicate: Predicate, $sequenceIds: [String]) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: nucleotideSequenceTargetGene(size: 100, sequenceIds: $sequenceIds) {
            name: key
            count
          }
        }
      }
    }
  `,
  extraFacetVariables: (filter) => {
    const ids = parseSequenceFilterValue(filter?.must?.nucleotideSequenceId?.[0])?.ids;
    return ids && ids.length > 0 ? { sequenceIds: ids } : {};
  },
  about: () => <Message id="filters.nucleotideSequenceTargetGene.description" />,
  group: 'nucleotideSequence',
  allowExistence: true,
  allowNegations: true,
};

export const sexConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM, // could be a SUGGEST as well, but there isn't much to suggest as there aren't many options
  filterHandle: 'sex',
  displayName: SexLabel,
  filterTranslation: 'filters.sex.name',
  facetQuery: `
    query OccurrenceSexFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: sex {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.sex.description" />,
  group: 'occurrence',
  allowExistence: true,
  allowNegations: true,
};

export const pathwayConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'pathway',
  displayName: PathwayLabel,
  filterTranslation: 'filters.pathway.name',
  suggestConfig: pathwaySuggest,
  facetQuery: /* GraphQL */ `
    query OccurrencePathwayFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: pathway(size: 10) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.preservationType.description" />,
  group: 'occurrence',
  allowExistence: true,
  allowNegations: true,
};

export const degreeOfEstablishmentConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'degreeOfEstablishment',
  displayName: DegreeOfEstablishmentLabel,
  filterTranslation: 'filters.degreeOfEstablishment.name',
  // suggestConfig: degreeOfEstablishmentSuggest,
  facetQuery: /* GraphQL */ `
    query OccurrenceDegreeOfEstablishmentFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: degreeOfEstablishment(size: 20) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.preservationType.description" />,
  group: 'occurrence',
  allowExistence: true,
  allowNegations: true,
};

// export const typeStatusConfig: filterEnumConfig = {
//   filterType: filterConfigTypes.ENUM,
//   filterHandle: 'typeStatus',
//   displayName: TypeStatusVocabularyLabel,
//   // options: typeStatusOptions,
//   allowNegations: true,
//   allowExistence: true,
//   filterTranslation: 'filters.typeStatus.name',
//   facetQuery: /* GraphQL */ `
//     query OccurrenceTypeStatusFacet($q: String, $predicate: Predicate) {
//       search: occurrenceSearch(q: $q, predicate: $predicate) {
//         facet {
//           field: typeStatus(size: 100) {
//             name: key
//             count
//           }
//         }
//       }
//     }
//   `,
//   about: () => <Message id="filters.typeStatus.description" />,
// };
