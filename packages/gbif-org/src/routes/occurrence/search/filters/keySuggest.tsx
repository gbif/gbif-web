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
  TypeStatusVocabularyLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterSuggestConfig,
  filterTaxonConfig,
} from '@/components/filters/filterTools';
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
  taxonKeyClbSuggest,
  typeStatusSuggest,
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
    query OccurrenceInstitutionFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'record',
};

export const taxonKeyConfig: filterTaxonConfig = {
  filterType: filterConfigTypes.TAXON,
  filterHandle: 'taxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggestConfig: taxonKeyClbSuggest,
  allowExistence: false,
  allowNegations: true,
  suggestionTitlePath: 'item.usage.canonicalName',
  facetQuery: `
    query OccurrenceTaxonFacet($q: String, $predicate: Predicate, $checklistKey: ID) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: taxonKey(checklistKey: $checklistKey) {
            name: key
            count
            item: taxonMatch(checklistKey: $checklistKey) {
              usage {
                canonicalName
              }
            }
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.taxonKey.description" />,
  group: 'identification',
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
    query OccurrenceInstitutionFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'record',
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
    query OccurrenceDatasetFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'provenance',
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
    query OccurrencePublisherFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'provenance',
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
    query OccurrencePublisherFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'provenance',
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
    query OccurrencePublisherFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'provenance',
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
    query OccurrencePublisherFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'location',
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
    query OccurrenceCountryFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'location',
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
    query OccurrencePublishingCountryFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'provenance',
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
    query OccurrenceInstitutionCodeFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'record',
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
    query OccurrenceCollectionCodeFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'record',
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
    query OccurrenceRecordNumberFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
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
  group: 'occurrence', // Best guess based on Darwin Core
};

export const typeStatusSuggestConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'typeStatus',
  displayName: TypeStatusVocabularyLabel,
  filterTranslation: 'filters.typeStatus.name',
  suggestConfig: typeStatusSuggest,
  allowNegations: true,
  allowExistence: true,
  facetQuery: /* GraphQL */ `
    query OccurrenceTypeStatusFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: typeStatus(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.typeStatus.description" />,
  group: 'identification',
};
