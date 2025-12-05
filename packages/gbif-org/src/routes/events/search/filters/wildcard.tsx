import { WildcardLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterWildcardConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';

export const sampleSizeUnitConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'sampleSizeUnit',
  queryKey: 'sampleSizeUnit',
  displayName: WildcardLabel,
  filterTranslation: 'filters.sampleSizeUnit.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query EventCatalogNumberFacet($q: String, $predicate: Predicate, $size: Int){
      search: eventSearch(q: $q, predicate: $predicate) {
        cardinality {
          total: sampleSizeUnit
        }
        facet {
          field: sampleSizeUnit(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.sampleSizeUnit.description" />,
  group: 'event',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const eventTypeConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'eventType',
  queryKey: 'eventType',
  displayName: WildcardLabel,
  filterTranslation: 'filters.eventType.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query EventCatalogNumberFacet($q: String, $predicate: Predicate, $size: Int){
      search: eventSearch(q: $q, predicate: $predicate) {
        cardinality {
          total: eventType
        }
        facet {
          field: eventType(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.eventType.description" />,
  group: 'event',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const localityConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'locality',
  queryKey: 'locality',
  displayName: WildcardLabel,
  filterTranslation: 'filters.locality.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query EventCatalogNumberFacet($q: String, $predicate: Predicate, $size: Int){
      search: eventSearch(q: $q, predicate: $predicate) {
        cardinality {
          total: locality
        }
        facet {
          field: locality(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.locality.description" />,
  group: 'location',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};

export const samplingProtocolConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'samplingProtocol',
  queryKey: 'samplingProtocol',
  displayName: WildcardLabel,
  filterTranslation: 'filters.samplingProtocol.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query EventCatalogNumberFacet($q: String, $predicate: Predicate, $size: Int){
      search: eventSearch(q: $q, predicate: $predicate) {
        cardinality {
          total: samplingProtocol
        }
        facet {
          field: samplingProtocol(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.samplingProtocol.description" />,
  group: 'event',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
};
