import country from '@/enums/basic/country.json';
import {
  booleanLabel,
  CountryLabel,
  IdentityLabel,
  PurposesLabel,
  TopicsLabel,
} from '@/components/filters/displayNames';
import {
  filterBoolConfig,
  filterConfigTypes,
  filterEnumConfig,
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
import topicsOptions from '@/enums/cms/topics.json';

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

const topicsConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'topics',
  displayName: TopicsLabel,
  options: topicsOptions,
  filterTranslation: 'filters.topics.name',
  facetQuery: /* GraphQL */ `
    query ResourceTopicsFacet($predicate: Predicate) {
      search: resourceSearch(predicate: $predicate) {
        facet {
          field: topics(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const countriesOfResearcherConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'countriesOfResearcher',
  displayName: CountryLabel,
  filterTranslation: 'filters.countriesOfResearcher.name',
  facetQuery: /* GraphQL */ `
    query ResourceResearcherCountryFacet($predicate: Predicate) {
      search: resourceSearch(predicate: $predicate) {
        facet {
          field: countriesOfResearcher {
            name: key
            count
          }
        }
      }
    }
  `,
};

const gbifProgrammeAcronymConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'gbifProgrammeAcronym',
  displayName: IdentityLabel,
  filterTranslation: 'resourceSearch.filters.programme',
  facetQuery: /* GraphQL */ `
    query ResourceGbifProgrammeAcronymFacet($predicate: Predicate) {
      search: resourceSearch(predicate: $predicate) {
        facet {
          field: gbifProgrammeAcronym(size: 20) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const purposesConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'purposes',
  displayName: PurposesLabel,
  filterTranslation: 'resourceSearch.filters.purposes',
  facetQuery: /* GraphQL */ `
    query ResourcePurposesFacet($predicate: Predicate) {
      search: resourceSearch(predicate: $predicate) {
        facet {
          field: purposes(size: 20) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const contractCountryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'contractCountry',
  displayName: CountryLabel,
  filterTranslation: 'resourceSearch.filters.contractCountry',
  facetQuery: /* GraphQL */ `
    query ResourceContractCountryFacet($predicate: Predicate) {
      search: resourceSearch(predicate: $predicate) {
        facet {
          field: contractCountry {
            name: key
            count
          }
        }
      }
    }
  `,
};

const showPastEventsConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: '_showPastEvents',
  displayName: booleanLabel,
  filterTranslation: 'resourceSearch.filters.showPastEvents',
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
      topics: generateFilters({ config: topicsConfig, searchConfig, formatMessage }),
      countriesOfResearcher: generateFilters({
        config: {
          ...countriesOfResearcherConfig,
          suggestConfig: { getSuggestions: countrySuggest },
        },
        searchConfig,
        formatMessage,
      }),
      contractCountry: generateFilters({
        config: { ...contractCountryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      gbifProgrammeAcronym: generateFilters({
        config: gbifProgrammeAcronymConfig,
        searchConfig,
        formatMessage,
      }),
      purposes: generateFilters({ config: purposesConfig, searchConfig, formatMessage }),
      _showPastEvents: generateFilters({
        config: showPastEventsConfig,
        searchConfig,
        formatMessage,
      }),
    };
    setFilters(nextFilters);
  }, [searchConfig, formatMessage, countrySuggest]);

  return { filters };
}
