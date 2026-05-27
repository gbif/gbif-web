import {
  ContinentLabel,
  DurationUnitLabel,
  DwcaExtensionLabel,
  MonthLabel,
} from '@/components/filters/displayNames';
import { filterConfigTypes, filterEnumConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import continentOptions from '@/enums/basic/continent.json';
import monthOptions from '@/enums/basic/month.json';
import { termToGroup } from '../humboldtTerms';

export const monthConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'month',
  displayName: MonthLabel,
  options: monthOptions,
  filterTranslation: 'filters.month.name',
  facetQuery: /* GraphQL */ `
    query EventMonthFacet($q: String, $query: EventSearchInput) {
      search: eventSearch(q: $q, query: $query) {
        facet {
          field: month {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.month.description" />,
  group: 'event',
};

export const humboldtEventDurationUnitConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'humboldtEventDurationUnit',
  displayName: DurationUnitLabel,
  filterTranslation: 'filters.eventDurationUnit.name',
  about: () => <Message id="filters.eventDurationUnit.description" />,
  facetQuery: `
    query humboldtEventDurationUnit($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        facet {
          field: humboldtEventDurationUnit {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['eventDurationUnit'],
};

export const continentConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'continent',
  displayName: ContinentLabel,
  allowExistence: false,
  allowNegations: false,
  options: continentOptions,
  filterTranslation: 'filters.continent.name',
  facetQuery: /* GraphQL */ `
    query EventContinentFacet($q: String, $query: EventSearchInput) {
      search: eventSearch(q: $q, query: $query) {
        facet {
          field: continent {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.continent.description" />,
  group: 'location',
};

export const dwcaExtensionConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'dwcaExtension',
  displayName: DwcaExtensionLabel,
  // options: dwcaExtensionOptions,
  allowNegations: false,
  allowExistence: false,
  filterTranslation: 'filters.dwcaExtension.name',
  facetQuery: /* GraphQL */ `
    query EventDwcaExtensionFacet($q: String, $query: EventSearchInput) {
      search: eventSearch(q: $q, query: $query) {
        facet {
          field: dwcaExtension {
            name
            count
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.isSequenced.description" />,
  group: 'other',
};
