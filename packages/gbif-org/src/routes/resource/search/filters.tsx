import country from '@/enums/basic/country.json';
import { CountryLabel, IdentityLabel } from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterFreeTextConfig,
  FilterSetting,
  filterSuggestConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { SuggestFnProps } from '@/components/filters/suggest';
import { matchSorter } from 'match-sorter';
import { hash } from '@/utils/hash';

const freeTextConfig: filterFreeTextConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

const countriesOfCoverageConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'countriesOfCoverage',
  displayName: CountryLabel,
  filterTranslation: 'filters.countriesOfCoverage.name',
  facetQuery: /* GraphQL */ `
    query ResourceCoverageCountryFacet($predicate: Predicate) {
      search: resourceSearch(predicate: $predicate) {
        facet {
          field: countriesOfCoverage {
            name: key
            count
          }
        }
      }
    }
  `,
};

export function useFilters({ searchConfig }: { searchConfig: FilterConfigType }): {
  filters: Record<string, FilterSetting>;
} {
  const { formatMessage } = useIntl();
  const [countries, setCountries] = useState<{ key: string; title: string }[]>([]);

  const [filters, setFilters] = useState<Record<string, FilterSetting>>({});

  // TODO move to custom hook as it is repeated a lot
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
      countriesOfCoverage: generateFilters({
        config: { ...countriesOfCoverageConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
    };
    setFilters(nextFilters);
  }, [searchConfig, formatMessage]);

  return { filters };
}
