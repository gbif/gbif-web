import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterWildcardConfig } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';
import { institutionKeySuggest } from '@/utils/suggestEndpoints';

export const waterBodyConfig: filterWildcardConfig = {
  filterType: filterConfigTypes.WILDCARD,
  filterHandle: 'waterBody',
  displayName: IdentityLabel,
  filterTranslation: 'filters.waterBody.name',
  suggestConfig: institutionKeySuggest,
  facetQuery: `
    query OccurrenceWaterBodyFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: waterBody {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};
