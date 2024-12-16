import { booleanLabel } from '@/components/filters/displayNames';
import { HelpText } from '@/components/helpText';
import { filterBoolConfig, filterConfigTypes } from '@/components/filters/filterTools';

export const isInClusterConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'isInCluster',
  displayName: booleanLabel,
  filterTranslation: 'filters.isInCluster.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceIsInClusterFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: isInCluster(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const isSequencedConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'isSequenced',
  displayName: booleanLabel,
  filterTranslation: 'filters.isSequenced.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceisSequencedFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: isSequenced(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};
