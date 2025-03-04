import {
  booleanLabel,
  CountryLabel,
  IdentityLabel,
  InstitutionDisciplineLabel,
  InstitutionTypeLabel,
  QuantityLabel,
} from '@/components/filters/displayNames';
import {
  filterBoolConfig,
  filterConfigTypes,
  filterFreeTextConfig,
  filterRangeConfig,
  FilterSetting,
  filterSuggestConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCountrySuggest } from '@/hooks/useCountrySuggest';
import { institutionDisciplineSuggest, institutionTypeSuggest } from '@/utils/suggestEndpoints';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export const activeConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'active',
  displayName: booleanLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.activeInstitution.name',
  about: () => <Message id="filters.activeInstitution.description" />,
};

const countryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'country',
  displayName: CountryLabel,
  filterTranslation: 'filters.country.name',
  // suggest will be provided by the useFilters hook
  facetQuery: `
    query InstitutionCountryFacet($query: InstitutionSearchInput, $limit: Int) {
      search: institutionSearch(query: $query) {
        facet {
          field: country(limit: $limit) {
            name
            count
          }
        }
      }
    }
  `,
};

const freeTextConfig: filterFreeTextConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

const nameConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'name',
  displayName: IdentityLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.name.name',
};

export const codeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'code',
  displayName: IdentityLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.code.name',
  about: () => <Message id="filters.code.description" />,
};

export const alternativeCodeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'alternativeCode',
  displayName: IdentityLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.alternativeCode.name',
  about: () => <Message id="filters.alternativeCode.description" />,
};

export const cityConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'city',
  displayName: IdentityLabel,
  filterTranslation: 'filters.city.name',
  facetQuery: /* GraphQL */ `
    query InstitutionCityFacet($query: InstitutionSearchInput, $limit: Int) {
      search: institutionSearch(query: $query) {
        facet {
          field: city(limit: $limit) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.city.description" />,
};

export const occurrenceCountConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'occurrenceCount',
  displayName: QuantityLabel,
  filterTranslation: 'filters.specimensInGbif.name',
  about: () => <Message id="filters.specimensInGbif.description" />,
};

export const numberSpecimensConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'numberSpecimens',
  displayName: QuantityLabel,
  filterTranslation: 'filters.numberSpecimens.name',
  about: () => <Message id="filters.numberSpecimens.description" />,
};

export const disciplineConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'discipline',
  displayName: InstitutionDisciplineLabel,
  filterTranslation: 'filters.discipline.name',
  disableFacetsForSelected: true,
  suggestConfig: institutionDisciplineSuggest,
  facetQuery: /* GraphQL */ `
    query InstitutionDisciplineFacet($query: InstitutionSearchInput, $limit: Int) {
      search: institutionSearch(query: $query) {
        facet {
          field: discipline(limit: $limit) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.discipline.description" />,
};

export const typeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'type',
  displayName: InstitutionTypeLabel,
  filterTranslation: 'filters.institutionType.name',
  suggestConfig: institutionTypeSuggest,
  disableFacetsForSelected: true,
  facetQuery: /* GraphQL */ `
    query InstitutionTypeStatusFacet($query: InstitutionSearchInput, $limit: Int) {
      search: institutionSearch(query: $query) {
        facet {
          field: type(limit: $limit) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.institutionType.description" />,
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
      active: generateFilters({ config: activeConfig, searchConfig, formatMessage }),
      country: generateFilters({
        config: { ...countryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      type: generateFilters({ config: typeConfig, searchConfig, formatMessage }),
      discipline: generateFilters({ config: disciplineConfig, searchConfig, formatMessage }),
      alternativeCode: generateFilters({
        config: alternativeCodeConfig,
        searchConfig,
        formatMessage,
      }),
      city: generateFilters({ config: cityConfig, searchConfig, formatMessage }),
      name: generateFilters({ config: nameConfig, searchConfig, formatMessage }),
      code: generateFilters({ config: codeConfig, searchConfig, formatMessage }),
      numberSpecimens: generateFilters({
        config: numberSpecimensConfig,
        searchConfig,
        formatMessage,
      }),
      occurrenceCount: generateFilters({
        config: occurrenceCountConfig,
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
