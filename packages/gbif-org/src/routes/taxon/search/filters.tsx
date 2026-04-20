import {
  IdentityLabel,
  TaxonIssueLabel,
  TaxonRankLabel,
  TaxonStatusLabel,
  TaxonKeyLabel,
  TaxonLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterFreeTextConfig,
  FilterSetting,
  filterSuggestConfig,
  filterTaxonConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import taxonStatusOptions from '@/enums/basic/taxonomicStatus.json';

import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { taxonIdSuggest } from './taxonIdSuggest';
import { taxonKeyClbSuggest } from '@/utils/suggestEndpoints';

const freeTextConfig: filterFreeTextConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

export const taxonRankConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'taxonRank',
  displayName: TaxonRankLabel,
  // options: taxonRankOptions,
  filterTranslation: 'filters.taxonRank.name',
  facetQuery: /* GraphQL */ `
    query TaxonRankFacet($query: TaxonSearchInput) {
      search: taxonSearch(query: $query) {
        facet {
          field: taxonRank(limit: 100) {
            name
            count
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.identifiedBy.description" />,
};

export const taxonomicStatusConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'taxonomicStatus',
  displayName: TaxonStatusLabel,
  options: taxonStatusOptions,
  filterTranslation: 'filters.taxonomicStatus.name',
  facetQuery: /* GraphQL */ `
    query TaxonStatusFacet($query: TaxonSearchInput) {
      search: taxonSearch(query: $query) {
        facet {
          field: taxonomicStatus(limit: 100) {
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

export const taxonIdConfig: filterTaxonConfig = {
  filterType: filterConfigTypes.TAXON,
  filterHandle: 'taxonId',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  // suggestConfig: taxonIdSuggest,
  suggestConfig: taxonKeyClbSuggest,
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
              title: label
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
      taxonRank: generateFilters({ config: taxonRankConfig, searchConfig, formatMessage }),
      taxonomicStatus: generateFilters({
        config: taxonomicStatusConfig,
        searchConfig,
        formatMessage,
      }),
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
