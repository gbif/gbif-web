import {
  CountryLabel,
  DatasetTypeLabel,
  IdentityLabel,
  LicenceLabel,
  PublisherLabel,
} from '@/components/filters/displayNames';
import {
  filterConfig,
  filterConfigTypes,
  FilterSetting,
  generateFilters,
} from '@/components/filters/filterTools';
import { FormattedMessage, useIntl } from 'react-intl';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import country from '@/enums/basic/country.json';
import licenseOptions from '@/enums/basic/license.json';
import datasetTypeOptions from '@/enums/basic/datasetType.json';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCallback, useEffect, useState } from 'react';
import { SuggestFnProps } from '@/components/filters/suggest';
import { HelpText } from '@/components/helpText';

// shared vairables for the various components
const publisherConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingOrg',
  displayName: PublisherLabel,
  filterTranslation: 'filters.publisherKey.name',
  suggest: ({ q, siteConfig }: SuggestFnProps) => {
    return fetch(`${siteConfig.v1Endpoint}/organization/suggest?limit=20&q=${q}`)
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
  about: () => (
    <div>
      {/* TODO */}
      The publisher of the data
      {/* <FormattedMessage id="filters.publisherKey.description" />
    <HelpText identifier="how-to-link-datasets-to-my-project-page" /> */}
    </div>
  ),
};

const hostingOrgConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'hostingOrg',
  displayName: PublisherLabel,
  filterTranslation: 'filters.hostingOrganizationKey.name',
  suggest: ({ q, siteConfig }: SuggestFnProps) => {
    return fetch(`${siteConfig.v1Endpoint}/organization/suggest?limit=20&q=${q}`)
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />
};

const publishingCountryConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.publishingCountryCode.name',
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />
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
      publishingOrg: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      hostingOrg: generateFilters({ config: hostingOrgConfig, searchConfig, formatMessage }),
      projectId: generateFilters({ config: projectIdConfig, searchConfig, formatMessage }),
      publishingCountry: generateFilters({
        config: { ...publishingCountryConfig, suggest: countrySuggest },
        searchConfig,
        formatMessage,
      }),
      license: generateFilters({ config: licenceConfig, searchConfig, formatMessage }),
      type: generateFilters({ config: datasetTypeConfig, searchConfig, formatMessage }),
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}