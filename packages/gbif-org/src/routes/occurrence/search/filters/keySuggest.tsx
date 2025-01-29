import {
  CollectionLabel,
  CountryLabel,
  DatasetLabel,
  GadmGidLabel,
  IdentityLabel,
  InstitutionLabel,
  NetworkLabel,
  PublisherLabel,
  TaxonLabel,
} from '@/components/filters/displayNames';
import { filterConfigTypes, filterSuggestConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import {
  collectionCodeSuggest,
  collectionKeySuggest,
  datasetKeyOccurrenceSuggest,
  gadGidSuggest,
  institutionCodeSuggest,
  institutionKeySuggest,
  networkKeySuggest,
  publisherKeyOccurrenceSuggest,
  publisherKeySuggest,
  recordNumberSuggest,
  taxonKeyVernacularSuggest,
} from '@/utils/suggestEndpoints';

export const institutionKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'institutionKey',
  displayName: InstitutionLabel,
  filterTranslation: 'filters.institutionKey.name',
  suggestConfig: institutionKeySuggest,
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
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
  about: () => <Message id="filters.institutionKey.description" />,
};

export const taxonKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'taxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggestConfig: taxonKeyVernacularSuggest, //taxonKeySuggest,
  allowExistence: false,
  allowNegations: true,
  facetQuery: `
    query OccurrenceTaxonFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: taxonKey {
            name: key
            count
            item: taxon {
              formattedName(useFallback: true)
            }
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.taxonKey.description" />,
};

export const collectionKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'collectionKey',
  displayName: CollectionLabel,
  filterTranslation: 'filters.collectionKey.name',
  suggestConfig: collectionKeySuggest,
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query OccurrenceInstitutionFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: collectionKey {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.collectionKey.description" />,
};

export const datasetKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'datasetKey',
  displayName: DatasetLabel,
  filterTranslation: 'filters.datasetKey.name',
  suggestConfig: datasetKeyOccurrenceSuggest, //datasetKeySuggest,
  allowExistence: false,
  allowNegations: true,
  facetQuery: `
    query OccurrenceDatasetFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: datasetKey {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.datasetKey.description" />,
};

// export const datasetKeyScopedConfig: filterConfig = {
//   ...datasetKeyConfig,
//   suggest: ({ q, siteConfig }: SuggestFnProps) => {
//     return fetch(`${siteConfig.v1Endpoint}/dataset/suggest?limit=20&q=${q}`)
//       .then((res) => res.json())
//       .then((data) => {
//         return data.map((item) => ({
//           key: item?.key,
//           title: item?.title,
//         }));
//       });
//   },
// };

export const publishingOrgConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingOrg',
  displayName: PublisherLabel,
  filterTranslation: 'filters.publisherKey.name',
  suggestConfig: publisherKeyOccurrenceSuggest, //publisherKeySuggest,
  allowExistence: false,
  allowNegations: true,
  facetQuery: `
    query OccurrencePublisherFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: publishingOrg {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.publisherKey.description" />,
};

export const hostingOrganizationKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'hostingOrganizationKey',
  displayName: PublisherLabel,
  filterTranslation: 'filters.hostingOrganizationKey.name',
  suggestConfig: publisherKeySuggest,
  allowExistence: false,
  allowNegations: true,
  facetQuery: `
    query OccurrencePublisherFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: hostingOrganizationKey {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.hostingOrganizationKey.description" />,
};

export const networkKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'networkKey',
  displayName: NetworkLabel,
  filterTranslation: 'filters.networkKey.name',
  suggestConfig: networkKeySuggest,
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query OccurrencePublisherFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: networkKey {
            name: key
            count
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.hostingOrganizationKey.description" />
};

export const gadmGidConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gadmGid',
  displayName: GadmGidLabel,
  filterTranslation: 'filters.gadmGid.name',
  suggestConfig: gadGidSuggest,
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query OccurrencePublisherFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: gadmGid {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.gadmGid.description" />,
};

export const countryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'country',
  displayName: CountryLabel,
  filterTranslation: 'filters.country.name',
  // suggest will be provided by the useFilters hook
  allowExistence: true,
  allowNegations: true,
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
  about: () => <Message id="filters.occurrenceCountry.description" />,
};

export const publishingCountryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.publishingCountryCode.name',
  // suggest will be provided by the useFilters hook
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query OccurrencePublishingCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: publishingCountry {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.publishingCountryCode.description" />,
};

export const institutionCodeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'institutionCode',
  displayName: IdentityLabel,
  filterTranslation: 'filters.institutionCode.name',
  suggestConfig: institutionCodeSuggest,
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query OccurrenceInstitutionCodeFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: institutionCode {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.institutionCode.description" />,
};

export const collectionCodeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'collectionCode',
  displayName: IdentityLabel,
  filterTranslation: 'filters.collectionCode.name',
  suggestConfig: collectionCodeSuggest,
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query OccurrenceCollectionCodeFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: collectionCode {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.collectionCode.description" />,
};

export const recordNumberConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'recordNumber',
  displayName: IdentityLabel,
  filterTranslation: 'filters.recordNumber.name',
  suggestConfig: recordNumberSuggest,
  allowExistence: true,
  allowNegations: true,
  facetQuery: `
    query OccurrenceRecordNumberFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: recordNumber {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.recordNumber.description" />,
};
