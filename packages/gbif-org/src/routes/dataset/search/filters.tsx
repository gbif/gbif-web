import {
  CountryLabel,
  DatasetTypeLabel,
  DwcaExtensionLabel,
  IdentityLabel,
  LicenceLabel,
  NetworkLabel,
  PublisherLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterFreeTextConfig,
  FilterSetting,
  filterSuggestConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { SuggestFnProps, SuggestResponseType } from '@/components/filters/suggest';
import { Message } from '@/components/message';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import datasetTypeOptions from '@/enums/basic/datasetType.json';
import licenseOptions from '@/enums/basic/license.json';
import { useCountrySuggest } from '@/hooks/useCountrySuggest';
import { fetchWithCancel } from '@/utils/fetchWithCancel';
import { networkKeySuggest } from '@/utils/suggestEndpoints';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// shared vairables for the various components
const publisherConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingOrg',
  displayName: PublisherLabel,
  filterTranslation: 'filters.publisherKey.name',
  suggestConfig: {
    getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
      const { cancel, promise } = fetchWithCancel(
        `${siteConfig.v1Endpoint}/organization/suggest?limit=20&q=${q}`
      );
      const result = promise.then((res) => res.json());
      return { cancel, promise: result };
    },
  },
  facetQuery: `
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
  // about: () => <Message id="filters.publisherKey.description" />,
};

const hostingOrgConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'hostingOrg',
  displayName: PublisherLabel,
  filterTranslation: 'filters.hostingOrganizationKey.name',
  suggestConfig: {
    getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
      const { cancel, promise } = fetchWithCancel(
        `${siteConfig.v1Endpoint}/organization/suggest?limit=20&q=${q}`
      );
      const result = promise.then((res) => res.json());
      return { cancel, promise: result };
    },
  },
  facetQuery: /* GraphQL */ `
    query DatasetHostingFacet($query: DatasetSearchInput) {
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
  // about: () => <Message id="filters.hostingOrganizationKey.description" />,
};

const projectIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'projectId',
  displayName: IdentityLabel,
  // filterButtonProps: {
  //   hideSingleValues: true,
  // },
  filterTranslation: 'filters.projectId.name',
  facetQuery: /* GraphQL */ `
    query DatasetProjectFacet($query: DatasetSearchInput) {
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
  about: () => <Message id="filters.projectId.description" />,
};

const publishingCountryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.publishingCountryCode.name',
  facetQuery: /* GraphQL */ `
    query DatasetPublishingCountryFacet($query: DatasetSearchInput) {
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
  about: () => <Message id="filters.publishingCountryCode.description" />,
};

const licenceConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'license',
  displayName: LicenceLabel,
  options: licenseOptions,
  filterTranslation: 'filters.license.name',
  facetQuery: /* GraphQL */ `
    query DatasetLicenceFacet($query: DatasetSearchInput) {
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
  about: () => <Message id="filters.license.description" />,
};

const datasetTypeConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'type',
  displayName: DatasetTypeLabel,
  options: datasetTypeOptions,
  filterTranslation: 'filters.datasetType.name',
  facetQuery: /* GraphQL */ `
    query DatasetTypeFacet($query: DatasetSearchInput) {
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
  about: () => <Message id="filters.datasetType.description" />,
};

export const networkKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'networkKey',
  displayName: NetworkLabel,
  filterTranslation: 'filters.networkKey.name',
  suggestConfig: networkKeySuggest,
  allowExistence: false,
  allowNegations: false,
  facetQuery: /* GraphQL */ `
    query DataseNetworkFacet($query: DatasetSearchInput) {
      search: datasetSearch(query: $query) {
        facet {
          field: networkKey {
            name
            count
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.identifiedBy.description" />,
};

const freeTextConfig: filterFreeTextConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

export const dwcaExtensionConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'dwcaExtension',
  displayName: DwcaExtensionLabel,
  // options: dwcaExtensionOptions,
  allowNegations: false,
  allowExistence: false,
  filterTranslation: 'filters.dwcaExtension.name',
  facetQuery: /* GraphQL */ `
    query DatasetDwcaExtensionFacet($query: DatasetSearchInput) {
      search: datasetSearch(query: $query) {
        facet {
          field: dwcaExtension(limit: 100) {
            name
            count
          }
        }
      }
    }
  `,
};

export function useFilters({ searchConfig }: { searchConfig: FilterConfigType }): {
  filters: Record<string, FilterSetting>;
} {
  const { formatMessage } = useIntl();
  const [filters, setFilters] = useState<Record<string, FilterSetting>>({});
  const countrySuggest = useCountrySuggest();

  useEffect(() => {
    const nextFilters = {
      publishingOrg: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      hostingOrg: generateFilters({ config: hostingOrgConfig, searchConfig, formatMessage }),
      projectId: generateFilters({ config: projectIdConfig, searchConfig, formatMessage }),
      networkKey: generateFilters({ config: networkKeyConfig, searchConfig, formatMessage }),
      publishingCountry: generateFilters({
        config: { ...publishingCountryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      license: generateFilters({ config: licenceConfig, searchConfig, formatMessage }),
      type: generateFilters({ config: datasetTypeConfig, searchConfig, formatMessage }),
      dwcaExtension: generateFilters({ config: dwcaExtensionConfig, searchConfig, formatMessage }),
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
