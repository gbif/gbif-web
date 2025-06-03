import {
  DegreeOfEstablishmentLabel,
  EstablishmentMeansLabel,
  LifeStageLabel,
  PathwayLabel,
  SexLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterSuggestConfig,
} from '@/components/filters/filterTools';
import { Message } from '@/components/message';
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
    query OccurrenceLifeStageFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
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

export const sexConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM, // could be a SUGGEST as well, but there isn't much to suggest as there aren't many options
  filterHandle: 'sex',
  displayName: SexLabel,
  filterTranslation: 'filters.sex.name',
  facetQuery: `
    query OccurrenceSexFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
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
    query OccurrencePathwayFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
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
    query OccurrenceDegreeOfEstablishmentFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
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
