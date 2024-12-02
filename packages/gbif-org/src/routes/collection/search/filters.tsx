import {
  CountryLabel,
  IdentityLabel,
  InstitutionLabel,
  TaxonLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterFreeTextConfig,
  FilterSetting,
  filterSuggestConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { useIntl } from 'react-intl';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import country from '@/enums/basic/country.json';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCallback, useEffect, useState } from 'react';
import { SuggestFnProps } from '@/components/filters/suggest';
import { institutionKeySuggest, taxonKeySuggest } from '@/utils/suggestEndpoints';

const institutionKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'institutionKey',
  displayName: InstitutionLabel,
  filterTranslation: 'filters.institutionKey.name',
  suggestConfig: institutionKeySuggest,
  facetQuery: `
    query CollectionInstitutionFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: institutionKey {
            name
            count
          }
        }
      }
    }
  `,
};

const countryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'country',
  displayName: CountryLabel,
  filterTranslation: 'filters.country.name',
  // suggest will be provided by the useFilters hook
  facetQuery: `
    query CollectionCountryFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: country {
            name
            count
          }
        }
      }
    }
  `,
};

const taxonKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'taxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggestConfig: taxonKeySuggest
};

const descriptorCountryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'descriptorCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.collectionDescriptorCountry.name',
};

const freeTextConfig: filterFreeTextConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

export function useFilters({ searchConfig }: { searchConfig: FilterConfigType }): {
  filters: Record<string, FilterSetting>;
} {
  const { formatMessage } = useIntl();
  const [countries, setCountries] = useState<{ key: string; title: string }[]>([]);
  const [filters, setFilters] = useState<Record<string, FilterSetting>>({});

  // first translate relevant enums
  useEffect(() => {
    const countryValues = country.map((code) => ({
      key: code,
      title: formatMessage({ id: `enums.countryCode.${code}` }),
    }));
    if (hash(countries) !== hash(countryValues)) {
      setCountries(countryValues);
    }
  }, [formatMessage, countries]);

  const countrySuggest = useCallback(
    ({ q }: SuggestFnProps) => {
      // instead of just using indexOf or similar. This has the benefit of reshuffling records based on the match, check for abrivations etc
      const filtered = matchSorter(countries, q ?? '', { keys: ['title', 'key'] });
      return { promise: Promise.resolve(filtered), cancel: () => {} };
    },
    [countries]
  );

  useEffect(() => {
    const nextFilters = {
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      // code: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      country: generateFilters({
        config: { ...countryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      descriptorCountry: generateFilters({
        config: { ...descriptorCountryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      institutionKey: generateFilters({
        config: { ...institutionKeyConfig },
        searchConfig,
        formatMessage,
      }),
      taxonKey: generateFilters({
        config: { ...taxonKeyConfig },
        searchConfig,
        formatMessage,
      }),

      // publishingOrg: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      // hostingOrg: generateFilters({ config: hostingOrgConfig, searchConfig, formatMessage }),
      // projectId: generateFilters({ config: projectIdConfig, searchConfig, formatMessage }),

      // license: generateFilters({ config: licenceConfig, searchConfig, formatMessage }),
      // type: generateFilters({ config: datasetTypeConfig, searchConfig, formatMessage }),
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
