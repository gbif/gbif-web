import { WildcardLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterWildcardConfig } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';

export const waterBodyConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'waterBody',
  displayName: WildcardLabel,
  filterTranslation: 'filters.waterBody.name',
  suggestQuery: `
    query OccurrenceWaterBodyFacet($predicate: Predicate, $size: Int){
      search: occurrenceSearch(predicate: $predicate) {
        cardinality {
          total: waterBody
        }
        facet {
          field: waterBody(size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};
