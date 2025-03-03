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
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import taxonStatusOptions from '@/enums/basic/taxonomicStatus.json';
import { useCountrySuggest } from '@/hooks/useCountrySuggest';
import { taxonKeySuggest } from '@/utils/suggestEndpoints';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

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
  // about: () => <Message id="filters.identifiedBy.description" />,
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
  // about: () => <Message id="filters.identifiedBy.description" />,
};

export const highertaxonKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'higherTaxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.higherTaxonKey.name',
  suggestConfig: taxonKeySuggest,
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query TaxonStatusFacet($query: TaxonSearchInput) {
      search: taxonSearch(query: $query) {
        facet {
          field: higherTaxonKey {
            name
            count
            item: taxon {
              formattedName(useFallback: true)
            }
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.identifiedBy.description" />,
};

export function useFilters({ searchConfig }: { searchConfig: FilterConfigType }): {
  filters: Record<string, FilterSetting>;
} {
  const { formatMessage } = useIntl();
  const [filters, setFilters] = useState<Record<string, FilterSetting>>({});
  const countrySuggest = useCountrySuggest();

  useEffect(() => {
    const nextFilters = {
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      rank: generateFilters({ config: rankConfig, searchConfig, formatMessage }),
      status: generateFilters({ config: statusConfig, searchConfig, formatMessage }),
      higherTaxonKey: generateFilters({
        config: highertaxonKeyConfig,
        searchConfig,
        formatMessage,
      }),
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
