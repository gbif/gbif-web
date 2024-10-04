import {
  CountryLabel,
  DatasetTypeLabel,
  IdentityLabel,
  LicenceLabel,
  PublisherLabel,
} from './shared/DisplayName';
import { filterConfig, filterConfigTypes, generateFilters } from './shared/filterTools';
import { IntlShape, useIntl } from 'react-intl';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import country from '@/enums/basic/country.json';
import licenseOptions from '@/enums/basic/license.json';
import datasetTypeOptions from '@/enums/basic/datasetType.json';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCallback, useEffect, useState } from 'react';
import { useSearchContext } from '@/contexts/search';

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

const hostingOrgConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'hostingOrg',
  displayName: PublisherLabel,
  filterTranslation: 'filters.hostingOrganizationKey.name',
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
          field: hostingOrg {
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

const projectIdConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'projectId',
  displayName: IdentityLabel,
  // filterButtonProps: {
  //   hideSingleValues: true,
  // },
  filterTranslation: 'filters.projectId.name',
  facetQuery: /* GraphQL */ `
    query DatasetPublisherFacet($query: DatasetSearchInput) {
      search: datasetSearch(query: $query) {
        facet {
          field: projectId {
            name
            count
          }
        }
      }
    }
  `,
};

const publishingCountryConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.publishingCountryCode.name',
  // suggest: ({ q, intl }: { q: string, intl: IntlShape }) => {
  //   // this is an ineffecient way to do it as it translates all the values on every keystroke
  //   // unless performance becomes an issue, I would not worry about it
  //   const countryValues = country.map((code) => ({
  //     key: code,
  //     title: intl.formatMessage({ id: `enums.countryCode.${code}` }),
  //   }));
  //   const filtered = countryValues.filter((x) => x?.title?.toLowerCase().includes(q.toLowerCase()));
  //   return Promise.resolve(filtered);
  // },
  facetQuery: /* GraphQL */ `
    query DatasetPublisherFacet($query: DatasetSearchInput) {
      search: datasetSearch(query: $query) {
        facet {
          field: publishingCountry {
            name
            count
          }
        }
      }
    }
  `,
};

const licenceConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'license',
  displayName: LicenceLabel,
  options: licenseOptions,
  filterTranslation: 'filters.license.name',
  facetQuery: /* GraphQL */ `
    query DatasetPublisherFacet($query: DatasetSearchInput) {
      search: datasetSearch(query: $query) {
        facet {
          field: license {
            name
            count
          }
        }
      }
    }
  `,
};

const datasetTypeConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'type',
  displayName: DatasetTypeLabel,
  options: datasetTypeOptions,
  filterTranslation: 'filters.datasetType.name',
  facetQuery: /* GraphQL */ `
    query DatasetPublisherFacet($query: DatasetSearchInput) {
      search: datasetSearch(query: $query) {
        facet {
          field: type {
            name
            count
          }
        }
      }
    }
  `,
};

export function useFilters({ searchConfig }: { searchConfig: FilterConfigType }) {
  const { formatMessage } = useIntl();
  const [countries, setCountries] = useState<{ key: string; title: string }[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  
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
      publishingOrg: generateFilters({ config: publisherConfig, searchConfig }),
      hostingOrg: generateFilters({ config: hostingOrgConfig, searchConfig }),
      projectId: generateFilters({ config: projectIdConfig, searchConfig }),
      publishingCountry: generateFilters({
        config: { ...publishingCountryConfig, suggest: countrySuggest },
        searchConfig,
      }),
      license: generateFilters({ config: licenceConfig, searchConfig }),
      type: generateFilters({ config: datasetTypeConfig, searchConfig }),
    }
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest]);

  return {
    filters
  };
}
