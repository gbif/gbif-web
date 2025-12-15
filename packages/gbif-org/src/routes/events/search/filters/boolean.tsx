import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterBoolConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import { termToGroup } from '../humboldtTerms';

export const humboldtIsAbundanceCapReportedConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'humboldtIsAbundanceCapReported',
  displayName: IdentityLabel,
  filterTranslation: 'filters.isAbundanceCapReported.name',
  facetQuery: `
    query HumboldtIsAbundanceCapReported($query: EventSearchInput){
      search: eventSearch(query: $query) {
        
        facet {
          field: humboldtIsAbundanceCapReported {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.isAbundanceCapReported.description" />,
  group: termToGroup['isAbundanceCapReported'],
};

export const humboldtIsAbundanceReportedConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'humboldtIsAbundanceReported',
  displayName: IdentityLabel,
  filterTranslation: 'filters.isAbundanceReported.name',
  facetQuery: `
    query HumboldtIsAbundanceCapReported($query: EventSearchInput){
      search: eventSearch(query: $query) {
        
        facet {
          field: humboldtIsAbundanceReported {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.isAbundanceReported.description" />,
  group: termToGroup['isAbundanceReported'],
};
