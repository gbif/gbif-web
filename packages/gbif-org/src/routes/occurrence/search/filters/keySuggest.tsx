import {
  CollectionLabel,
  DatasetLabel,
  GadmGidLabel,
  InstitutionLabel,
  NetworkLabel,
  PublisherLabel,
  TaxonLabel,
} from '@/components/filters/displayNames';
import { filterConfig, filterConfigTypes } from '@/components/filters/filterTools';
import { SuggestFnProps, SuggestResponseType } from '@/components/filters/suggest';
import { HelpText } from '@/components/helpText';
import { collectionKeySuggest, datasetKeyOccurrenceSuggest, datasetKeySuggest, gadGidSuggest, institutionKeySuggest, networkKeySuggest, publisherKeyOccurrenceSuggest, publisherKeySuggest, taxonKeySuggest } from '@/utils/suggestEndpoints';

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
  suggestConfig: taxonKeySuggest,
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