import { EstablishmentMeansLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterEnumConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
// import { establishmentMeansSuggest } from '@/utils/suggestEndpoints';

export const establishmentMeansConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM, // could be a SUGGEST as well, but there isn't much to suggest as there aren't many options
  filterHandle: 'establishmentMeans',
  displayName: EstablishmentMeansLabel,
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
  about: () => <Message id="filters.establishmentMeans.description" />,
};
