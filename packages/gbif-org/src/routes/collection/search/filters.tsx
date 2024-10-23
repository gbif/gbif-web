import {
  CountryLabel,
  DatasetTypeLabel,
  IdentityLabel,
  InstitutionLabel,
  LicenceLabel,
  PublisherLabel,
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
import licenseOptions from '@/enums/basic/license.json';
import datasetTypeOptions from '@/enums/basic/datasetType.json';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCallback, useEffect, useState } from 'react';

// shared vairables for the various components
const publisherConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingOrg',
  displayName: PublisherLabel,
  filterTranslation: 'filters.publisherKey.name',
  suggest: ({ q }: { q: string }) => {
    return fetch(`https://api.gbif.org/v1/organization/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
  },
  facetQuery: /* GraphQL */ `
    query DatasetPublisherFacet($query: DatasetSearchInput) {
      search: datasetSearch(query: $query) {
        facet {
          field: publishingOrg {
            name
            count
            item: organization {
              title
            }
          }
        }
      }
    }
  `,
};

const institutionKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'institutionKey',
  displayName: InstitutionLabel,
  filterTranslation: 'filters.institutionKey.name',
  suggest: ({ q }: { q: string }) => {
    return fetch(`https://api.gbif.org/v1/grscicoll/institution/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data.map((item) => ({
          key: item.key,
          title: item.name,
        }));
      });
  },
};

const taxonKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'taxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggest: ({ q }: { q: string }) => {
    return fetch(`https://api.gbif.org/v1/species/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data.map((item) => ({
          key: item.key,
          title: item.scientificName,
        }));
      });
  },
};

const descriptorCountryConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'descriptorCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.collectionDescriptorCountry.name',
};

const countryConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'country',
  displayName: CountryLabel,
  filterTranslation: 'filters.country.name',
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
    ({ q }: { q: string }) => {
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
      descriptorCountry: generateFilters({
        config: { ...descriptorCountryConfig, suggest: countrySuggest },
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

      // publishingOrg: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      // hostingOrg: generateFilters({ config: hostingOrgConfig, searchConfig, formatMessage }),
      // projectId: generateFilters({ config: projectIdConfig, searchConfig, formatMessage }),

      // license: generateFilters({ config: licenceConfig, searchConfig, formatMessage }),
      // type: generateFilters({ config: datasetTypeConfig, searchConfig, formatMessage }),
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
