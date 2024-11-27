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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SuggestFnProps, SuggestResponseType } from '@/components/filters/suggest';
import { HelpText } from '@/components/helpText';
import { collectionKeyConfig, datasetKeyConfig, gadmGidConfig, hostingOrganizationKeyConfig, institutionKeyConfig, networkKeyConfig, publisherKeyConfig, taxonKeyConfig } from './filters/keySuggest';

const countryConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'country',
  displayName: CountryLabel,
  filterTranslation: 'filters.country.name',
  // suggest will be provided by the useFilters hook
  facetQuery: `
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

const freeTextConfig: filterConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

type Filters = Record<string, FilterSetting>;

export function useFilters({ searchConfig }: { searchConfig: FilterConfigType }): {
  filters: Filters;
} {
  const { formatMessage } = useIntl();
  const [countries, setCountries] = useState<{ key: string; title: string }[]>([]);

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
      return {promise: Promise.resolve(filtered), cancel: () => {}};
    },
    [countries]
  );

  const filters: Filters = useMemo(
    () => ({
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      // code: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      country: generateFilters({
        config: { ...countryConfig, suggestConfig: {getSuggestions: countrySuggest }},
        searchConfig,
        formatMessage,
      }),
      institutionKey: generateFilters({config: institutionKeyConfig, searchConfig, formatMessage}),
      collectionKey: generateFilters({config: collectionKeyConfig, searchConfig, formatMessage}),
      datasetKey: generateFilters({config: datasetKeyConfig, searchConfig, formatMessage}),
      taxonKey: generateFilters({config: taxonKeyConfig, searchConfig, formatMessage}),
      publisherKey: generateFilters({config: publisherKeyConfig, searchConfig, formatMessage}),
      hostingOrganizationKey: generateFilters({config: hostingOrganizationKeyConfig, searchConfig, formatMessage}),
      networkKey: generateFilters({config: networkKeyConfig, searchConfig, formatMessage}),
      gadmGid: generateFilters({config: gadmGidConfig, searchConfig, formatMessage}),
    }),
    [searchConfig, countrySuggest, formatMessage]
  );

  return {
    filters,
  };
}