import {
  IdentityLabel,
  TaxonLabel,
  TaxonRankLabel,
  TaxonStatusLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterFreeTextConfig,
  FilterSetting,
  filterSuggestConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { useIntl } from 'react-intl';
import taxonRankOptions from '@/enums/basic/rank.json';
import taxonStatusOptions from '@/enums/basic/taxonomicStatus.json';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import country from '@/enums/basic/country.json';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCallback, useEffect, useState } from 'react';
import { SuggestFnProps } from '@/components/filters/suggest';
import { HelpText } from '@/components/helpText';
import { taxonKeySuggest } from '@/utils/suggestEndpoints';

const freeTextConfig: filterFreeTextConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

export const rankConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'rank',
  displayName: TaxonRankLabel,
  // options: taxonRankOptions,
  filterTranslation: 'filters.taxonRank.name',
  facetQuery: /* GraphQL */ `
    query TaxonRankFacet($query: TaxonSearchInput) {
      search: taxonSearch(query: $query) {
        facet {
          field: rank(limit: 100) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const statusConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'status',
  displayName: TaxonStatusLabel,
  options: taxonStatusOptions,
  filterTranslation: 'filters.taxonomicStatus.name',
  facetQuery: /* GraphQL */ `
    query TaxonStatusFacet($query: TaxonSearchInput) {
      search: taxonSearch(query: $query) {
        facet {
          field: status(limit: 100) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const highertaxonKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'highertaxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.highertaxonKey.name',
  suggestConfig: taxonKeySuggest,
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query TaxonStatusFacet($query: TaxonSearchInput) {
      search: taxonSearch(query: $query) {
        facet {
          field: highertaxonKey {
            name
            count
            item: taxon {
              formattedName
            }
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
      rank: generateFilters({ config: rankConfig, searchConfig, formatMessage }),
      status: generateFilters({ config: statusConfig, searchConfig, formatMessage }),
      highertaxonKey: generateFilters({ config: highertaxonKeyConfig, searchConfig, formatMessage }),
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}