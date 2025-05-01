import {
  CountryLabel,
  IdentityLabel,
  PurposesLabel,
  TopicsLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterFreeTextConfig,
  FilterSetting,
  filterSuggestConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import topicsOptions from '@/enums/cms/topics.json';
import { useCountrySuggest } from '@/hooks/useCountrySuggest';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

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

// const showPastEventsConfig: filterBoolConfig = {
//   filterType: filterConfigTypes.OPTIONAL_BOOL,
//   filterHandle: '_showPastEvents',
//   displayName: booleanLabel,
//   filterTranslation: 'resourceSearch.filters.showPastEvents',
// };

export function useFilters({ searchConfig }: { searchConfig: FilterConfigType }): {
  filters: Record<string, FilterSetting>;
} {
  const { formatMessage } = useIntl();
  const [filters, setFilters] = useState<Record<string, FilterSetting>>({});
  const countrySuggest = useCountrySuggest();

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
      // _showPastEvents: generateFilters({
      //   config: showPastEventsConfig,
      //   searchConfig,
      //   formatMessage,
      // }),
    };
    setFilters(nextFilters);
  }, [searchConfig, formatMessage, countrySuggest]);

  return { filters };
}
