import {
  IdentityLabel,
  TaxonIssueLabel,
  TaxonRankLabel,
  TaxonStatusLabel,
  TaxonKeyLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterFreeTextConfig,
  FilterSetting,
  generateFilters,
} from '@/components/filters/filterTools';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import taxonStatusOptions from '@/enums/basic/taxonomicStatus.json';

import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { taxonIdSuggest } from './taxonIdSuggest';

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

export const issuesConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'issue',
  displayName: TaxonIssueLabel,
  /*   options: taxonIssueOptions,
   */ filterTranslation: 'filters.issueEnum.name',
  facetQuery: /* GraphQL */ `
    query TaxonIssueFacet($query: TaxonSearchInput) {
      search: taxonSearch(query: $query) {
        facet {
          field: issue(limit: 100) {
            name
            count
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.identifiedBy.description" />,
};

export const taxonIdConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'taxonId',
  displayName: TaxonKeyLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggestConfig: taxonIdSuggest,
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query TaxonIdFacet($query: TaxonSearchInput) {
      search: taxonSearch(query: $query) {
        facet {
          field: taxonId {
            name
            count
            item: taxon {
              formattedName: label
            }
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.identifiedBy.description" />,
};

export function useFilters({
  searchConfig,
}: {
  searchConfig: FilterConfigType;
  datasetKey?: string;
}): {
  filters: Record<string, FilterSetting>;
} {
  const { formatMessage } = useIntl();
  const [filters, setFilters] = useState<Record<string, FilterSetting>>({});

  useEffect(() => {
    const nextFilters = {
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      rank: generateFilters({ config: rankConfig, searchConfig, formatMessage }),
      status: generateFilters({ config: statusConfig, searchConfig, formatMessage }),
      issue: generateFilters({ config: issuesConfig, searchConfig, formatMessage }),
      taxonId: generateFilters({
        config: taxonIdConfig,
        searchConfig,
        formatMessage,
      }),
    };
    setFilters(nextFilters);
  }, [searchConfig, formatMessage]);

  return {
    filters,
  };
}
