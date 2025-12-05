import { CountryLabel, GadmGidLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterSuggestConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import { gadGidSuggest } from '@/utils/suggestEndpoints';

export const gadmGidConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gadmGid',
  displayName: GadmGidLabel,
  filterTranslation: 'filters.gadmGid.name',
  suggestConfig: gadGidSuggest,
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query EventPublisherFacet($q: String, $predicate: Predicate) {
      search: eventSearch(q: $q, predicate: $predicate) {
        facet {
          field: gadmGid {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.gadmGid.description" />,
  group: 'location',
};

export const countryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'country',
  displayName: CountryLabel,
  filterTranslation: 'filters.country.name',
  // suggest will be provided by the useFilters hook
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query EventCountryFacet($q: String, $predicate: Predicate) {
      search: eventSearch(q: $q, predicate: $predicate) {
        facet {
          field: country {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.occurrenceCountry.description" />,
  group: 'location',
};
