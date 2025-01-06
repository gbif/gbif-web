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
import { SuggestFnProps } from '@/components/filters/suggest';
import { HelpText } from '@/components/helpText';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import country from '@/enums/basic/country.json';
import { institutionDisciplineSuggest, institutionTypeSuggest } from '@/utils/suggestEndpoints';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export const activeConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'active',
  displayName: booleanLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.activeInstitution.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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

const nameConfig: filterFreeTextConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'name',
  displayName: IdentityLabel,
  filterTranslation: 'filters.name.name',
};

export const codeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'code',
  displayName: IdentityLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.code.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const alternativeCodeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'alternativeCode',
  displayName: IdentityLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.alternativeCode.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const occurrenceCountConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'occurrenceCount',
  displayName: QuantityLabel,
  filterTranslation: 'filters.specimensInGbif.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const numberSpecimensConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'numberSpecimens',
  displayName: QuantityLabel,
  filterTranslation: 'filters.numberSpecimens.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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
