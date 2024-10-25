import {
  CountryLabel,
  IdentityLabel,
  InstitutionLabel,
  TaxonLabel,
} from '@/components/filters/displayNames';
import {
  filterConfig,
  filterConfigTypes,
  FilterSetting,
  generateFilters,
} from '@/components/filters/filterTools';
import { useIntl } from 'react-intl';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import country from '@/enums/basic/country.json';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCallback, useEffect, useState } from 'react';
import { SuggestFnProps, SuggestResponseType } from '@/components/filters/suggest';
import { HelpText } from '@/components/helpText';

const institutionKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'institutionKey',
  displayName: InstitutionLabel,
  filterTranslation: 'filters.institutionKey.name',
  suggest: ({ q, siteConfig }: SuggestFnProps) => {
    return fetch(`${siteConfig.v1Endpoint}/grscicoll/institution/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data.map((item) => ({
          key: item?.key,
          title: item?.name,
        }));
      });
  },
  facetQuery: /* GraphQL */ `
    query OccurrenceInstitutionFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: institutionKey {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />
};

const countryConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'country',
  displayName: CountryLabel,
  filterTranslation: 'filters.country.name',
  // suggest will be provided by the useFilters hook
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: countryCode {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />
};

const taxonKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'taxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggest: ({ q, siteConfig }: SuggestFnProps):SuggestResponseType => {
    return fetch(`${siteConfig.v1Endpoint}/species/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data.map((item) => ({
          key: item?.key,
          title: item?.scientificName,
        }));
      });
  },
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />
};

const freeTextConfig: filterConfig = {
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
      const filtered = matchSorter(countries, q, { keys: ['title', 'key'] });
      return Promise.resolve(filtered);
    },
    [countries]
  );

  useEffect(() => {
    const nextFilters = {
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      // code: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      country: generateFilters({
        config: { ...countryConfig, suggest: countrySuggest },
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
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
