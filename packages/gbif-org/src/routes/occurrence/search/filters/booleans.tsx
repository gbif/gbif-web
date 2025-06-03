import { booleanLabel } from '@/components/filters/displayNames';
import { filterBoolConfig, filterConfigTypes } from '@/components/filters/filterTools';
import { Message } from '@/components/message';

export const isInClusterConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'isInCluster',
  displayName: booleanLabel,
  filterTranslation: 'filters.isInCluster.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceIsInClusterFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: isInCluster(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.isInCluster.description" />,
  group: 'other',
};

export const isSequencedConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'isSequenced',
  displayName: booleanLabel,
  filterTranslation: 'filters.isSequenced.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceisSequencedFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: isSequenced(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.isSequenced.description" />,
  group: 'other',
};

export const repatriatedConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'repatriated',
  displayName: booleanLabel,
  filterTranslation: 'filters.repatriated.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceRepatriatedFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: repatriated(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.repatriated.description" />,
  group: 'provenance',
};
