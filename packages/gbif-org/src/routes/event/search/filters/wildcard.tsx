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
    query EventSampleSizeUnitFacet($q: String, $query: EventSearchInput, $size: Int){
      search: eventSearch(q: $q, query: $query) {
        
        facet {
          field: sampleSizeUnit(size: $size) {
            name
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
    query EventTypeFacet($q: String, $query: EventSearchInput, $size: Int){
      search: eventSearch(q: $q, query: $query) {
        cardinality {
          total: eventType
        }
        facet {
          field: eventType(size: $size) {
            name
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

/* export const localityConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'locality',
  queryKey: 'locality',
  displayName: WildcardLabel,
  filterTranslation: 'filters.locality.name',
  allowExistence: true,
  allowNegations: true,
  suggestQuery: `
    query EventLocalityFacet($q: String, $query: EventSearchInput){
      search: eventSearch(q: $q, query: $query) {
       
        facet {
          field: locality{
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.locality.description" />,
  group: 'location',
  defaultDescription: () => <Message id="dashboard.notVocabularyWarning" />,
}; */
