import { ContinentLabel, DwcaExtensionLabel, MonthLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterEnumConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import continentOptions from '@/enums/basic/continent.json';
import monthOptions from '@/enums/basic/month.json';

export const monthConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'month',
  displayName: MonthLabel,
  options: monthOptions,
  allowNegations: true,
  allowExistence: true,
  filterTranslation: 'filters.month.name',
  facetQuery: /* GraphQL */ `
    query EventMonthFacet($q: String, $predicate: Predicate) {
      search: eventSearch(q: $q, predicate: $predicate) {
        facet {
          field: month(size: 12) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.month.description" />,
  group: 'event',
};

export const continentConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'continent',
  displayName: ContinentLabel,
  allowExistence: true,
  allowNegations: false,
  options: continentOptions,
  filterTranslation: 'filters.continent.name',
  facetQuery: /* GraphQL */ `
    query EventContinentFacet($q: String, $predicate: Predicate) {
      search: eventSearch(q: $q, predicate: $predicate) {
        facet {
          field: continent {
            name: key
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
  allowNegations: true,
  allowExistence: true,
  filterTranslation: 'filters.dwcaExtension.name',
  facetQuery: /* GraphQL */ `
    query EventDwcaExtensionFacet($q: String, $predicate: Predicate) {
      search: eventSearch(q: $q, predicate: $predicate) {
        facet {
          field: dwcaExtension(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.isSequenced.description" />,
  group: 'other',
};
