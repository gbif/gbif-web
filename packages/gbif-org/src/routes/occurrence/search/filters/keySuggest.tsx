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
import { filterConfig, filterConfigTypes } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';
import { collectionCodeSuggest, collectionKeySuggest, datasetKeyOccurrenceSuggest, gadGidSuggest, institutionCodeSuggest, institutionKeySuggest, networkKeySuggest, publisherKeyOccurrenceSuggest, publisherKeySuggest, recordNumberSuggest, taxonKeySuggest, taxonKeyVernacularSuggest } from '@/utils/suggestEndpoints';

export const institutionKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'institutionKey',
  displayName: InstitutionLabel,
  filterTranslation: 'filters.institutionKey.name',
  suggestConfig: institutionKeySuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const taxonKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'taxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggestConfig: taxonKeyVernacularSuggest,//taxonKeySuggest,
  facetQuery: `
    query OccurrenceTaxonFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: taxonKey {
            name: key
            count
            item: taxon {
              formattedName
            }
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const collectionKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'collectionKey',
  displayName: CollectionLabel,
  filterTranslation: 'filters.collectionKey.name',
  suggestConfig: collectionKeySuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const datasetKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'datasetKey',
  displayName: DatasetLabel,
  filterTranslation: 'filters.datasetKey.name',
  suggestConfig: datasetKeyOccurrenceSuggest,//datasetKeySuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
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

export const publisherKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publisherKey',
  displayName: PublisherLabel,
  filterTranslation: 'filters.publisherKey.name',
  suggestConfig: publisherKeyOccurrenceSuggest,//publisherKeySuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const hostingOrganizationKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'hostingOrganizationKey',
  displayName: PublisherLabel,
  filterTranslation: 'filters.hostingOrganizationKey.name',
  suggestConfig: publisherKeySuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const networkKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'networkKey',
  displayName: NetworkLabel,
  filterTranslation: 'filters.networkKey.name',
  suggestConfig: networkKeySuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const gadmGidConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gadmGid',
  displayName: GadmGidLabel,
  filterTranslation: 'filters.gadmGid.name',
  suggestConfig: gadGidSuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const countryConfig: filterConfig = {
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

export const publishingCountryConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.publishingCountryCode.name',
  // suggest will be provided by the useFilters hook
  facetQuery: `
    query OccurrenceCountryFacet($predicate: Predicate) {
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const institutionCodeConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'institutionCode',
  displayName: IdentityLabel,
  filterTranslation: 'filters.institutionCode.name',
  suggestConfig: institutionCodeSuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const collectionCodeConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'collectionCode',
  displayName: IdentityLabel,
  filterTranslation: 'filters.collectionCode.name',
  suggestConfig: collectionCodeSuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const recordNumberConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'recordNumber',
  displayName: IdentityLabel,
  filterTranslation: 'filters.recordNumber.name',
  suggestConfig: recordNumberSuggest,
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
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};
