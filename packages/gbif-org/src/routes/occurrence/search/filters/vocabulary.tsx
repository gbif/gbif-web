import {
  establishmentMeansLabel,
} from '@/components/filters/displayNames';
import { filterConfigTypes, filterEnumConfig } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';
// import { establishmentMeansSuggest } from '@/utils/suggestEndpoints';

export const establishmentMeansConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM, // could be a SUGGEST as well, but there isn't much to suggest as there aren't many options
  filterHandle: 'establishmentMeans',
  displayName: establishmentMeansLabel,
  filterTranslation: 'filters.establishmentMeans.name',
  // suggestConfig: establishmentMeansSuggest,
  facetQuery: `
    query OccurrenceEstablishmentMeansFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: establishmentMeans {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};