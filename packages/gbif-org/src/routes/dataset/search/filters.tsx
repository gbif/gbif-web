import { CountryLabel, DatasetTypeLabel, IdentityLabel, LicenceLabel, PublisherLabel } from './shared/DisplayName';
import { searchConfig } from './searchConfig';
import { filterConfig, filterConfigTypes, generateFilters } from './shared/filterTools';
import { IntlShape } from 'react-intl';

import country from '@/enums/basic/country.json';
import licenseOptions from '@/enums/basic/license.json';
import datasetTypeOptions from '@/enums/basic/datasetType.json';

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
export const publishingOrg = generateFilters({ config: publisherConfig, searchConfig });

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
export const hostingOrg = generateFilters({ config: hostingOrgConfig, searchConfig });

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
export const projectId = generateFilters({ config: projectIdConfig, searchConfig });

const publishingCountryConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.publishingCountryCode.name',
  suggest: ({ q, intl }: { q: string, intl: IntlShape }) => {
    // this is an ineffecient way to do it as it translates all the values on every keystroke
    // unless performance becomes an issue, I would not worry about it
    const countryValues = country.map((code) => ({
      key: code,
      title: intl.formatMessage({ id: `enums.countryCode.${code}` }),
    }));
    const filtered = countryValues.filter((x) => x?.title?.toLowerCase().includes(q.toLowerCase()));
    return Promise.resolve(filtered);
  },
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
export const publishingCountry = generateFilters({ config: publishingCountryConfig, searchConfig });

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
export const license = generateFilters({ config: licenceConfig, searchConfig });

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
export const type = generateFilters({ config: datasetTypeConfig, searchConfig });


export const filters = {
  publishingOrg,
  hostingOrg,
  projectId,
  publishingCountry,
  license,
  type,
};