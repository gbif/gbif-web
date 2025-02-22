import {
  booleanLabel,
  CountryLabel,
  DatasetLabel,
  IdentityLabel,
  LiteratureTypeLabel,
  NetworkLabel,
  PublisherLabel,
  RelevanceLabel,
  TaxonLabel,
  TopicsLabel,
  YearLabel,
} from '@/components/filters/displayNames';
import {
  filterBoolConfig,
  filterConfigTypes,
  filterEnumConfig,
  filterFreeTextConfig,
  filterRangeConfig,
  FilterSetting,
  filterSuggestConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { SuggestFnProps } from '@/components/filters/suggest';
import { Message } from '@/components/message';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import country from '@/enums/basic/country.json';
import literatureTypeOptions from '@/enums/cms/literatureType.json';
import relevanceOptions from '@/enums/cms/relevance.json';
import topicsOptions from '@/enums/cms/topics.json';
import {
  datasetKeySuggest,
  networkKeySuggest,
  publisherKeySuggest,
  taxonKeySuggest,
} from '@/utils/suggestEndpoints';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

const publishingOrganizationKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingOrganizationKey',
  displayName: PublisherLabel,
  filterTranslation: 'filters.publisherKey.name',
  disableFacetsForSelected: true,
  suggestConfig: publisherKeySuggest,
  facetQuery: `
    query LiteraturePublisherFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: publishingOrganizationKey {
            name: key
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

const datasetConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifDatasetKey',
  displayName: DatasetLabel,
  filterTranslation: 'filters.datasetKey.name',
  disableFacetsForSelected: true,
  suggestConfig: datasetKeySuggest,
  facetQuery: `
    query LiteratureDatasetFacet($predicate: Predicate, $size: Int = 10) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: gbifDatasetKey(size: $size) {
            name: key
            count
            item: dataset {
              title
            }
          }
        }
      }
    }
  `,
};

const gbifNetworkKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifNetworkKey',
  displayName: NetworkLabel,
  filterTranslation: 'filters.networkKey.name',
  disableFacetsForSelected: true,
  suggestConfig: networkKeySuggest,
  facetQuery: `
    query LiteratureNetworkFacet($predicate: Predicate, $size: Int = 10) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: gbifNetworkKey(size: $size) {
            name: key
            count
            item: network {
              title
            }
          }
        }
      }
    }
  `,
};

const countriesOfCoverageConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'countriesOfCoverage',
  displayName: CountryLabel,
  filterTranslation: 'filters.countriesOfCoverage.name',
  facetQuery: /* GraphQL */ `
    query LiteratureCoverageCountryFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: countriesOfCoverage {
            name: key
            count
          }
        }
      }
    }
  `,
};

const countriesOfResearcherConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'countriesOfResearcher',
  displayName: CountryLabel,
  filterTranslation: 'filters.countriesOfResearcher.name',
  facetQuery: `
    query LiteratureResearcherCountryFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: countriesOfResearcher {
            name: key
            count
          }
        }
      }
    }
  `,
};

const taxonKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifTaxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggestConfig: taxonKeySuggest,
  about: () => <Message id="resourceSearch.helpText.gbifTaxonKey" />,
};

const literatureTypeConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'literatureType',
  displayName: LiteratureTypeLabel,
  options: literatureTypeOptions,
  filterTranslation: 'filters.literatureType.name',
  facetQuery: `
    query LiteratureTypeFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: literatureType(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const literatureRelevanceConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'relevance',
  displayName: RelevanceLabel,
  options: relevanceOptions,
  filterTranslation: 'filters.relevance.name',
  facetQuery: /* GraphQL */ `
    query LiteratureRelevanceFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: relevance(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const topicsConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'topics',
  displayName: TopicsLabel,
  options: topicsOptions,
  filterTranslation: 'filters.topics.name',
  facetQuery: /* GraphQL */ `
    query LiteratureTopicsFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: topics(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const freeTextConfig: filterFreeTextConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

const yearConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'year',
  regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/,
  displayName: YearLabel,
  filterTranslation: 'filters.year.name',
};

const openAccessConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'openAccess',
  displayName: booleanLabel,
  filterTranslation: 'resourceSearch.filters.openAccess',
  facetQuery: /* GraphQL */ `
    query LiteratureOpenAccessFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: openAccess {
            name: key
            count
          }
        }
      }
    }
  `,
};

const peerReviewConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'peerReview',
  displayName: booleanLabel,
  filterTranslation: 'resourceSearch.filters.peerReview',
  facetQuery: /* GraphQL */ `
    query LiteraturePeerReviewFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: peerReview {
            name: key
            count
          }
        }
      }
    }
  `,
};

const publisherConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publisher',
  displayName: IdentityLabel,
  filterTranslation: 'resourceSearch.filters.litPublisher',
  facetQuery: /* GraphQL */ `
    query LiteraturePublisherFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: publisher(size: 20) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const sourceConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'source',
  displayName: IdentityLabel,
  filterTranslation: 'resourceSearch.filters.litSource',
  facetQuery: /* GraphQL */ `
    query LiteratureSourceFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: source(size: 20) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const gbifProgrammeAcronymConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'gbifProgrammeAcronym',
  displayName: IdentityLabel,
  filterTranslation: 'resourceSearch.filters.programme',
  facetQuery: /* GraphQL */ `
    query LiteratureGbifProgrammeAcronymFacet($predicate: Predicate) {
      search: literatureSearch(predicate: $predicate) {
        facet {
          field: gbifProgrammeAcronym(size: 20) {
            name: key
            count
          }
        }
      }
    }
  `,
};

const gbifProjectIdentifierConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifProjectIdentifier',
  displayName: IdentityLabel,
  filterTranslation: 'resourceSearch.filters.projectId',
  disableFacetsForSelected: true,
};

const gbifDownloadKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifDownloadKey',
  displayName: IdentityLabel,
  filterTranslation: 'resourceSearch.filters.gbifDownloadKey',
  disableFacetsForSelected: true,
};

const gbifDerivedDatasetDoiConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifDerivedDatasetDoi',
  displayName: IdentityLabel,
  filterTranslation: 'resourceSearch.filters.gbifDerivedDatasetDoi',
  disableFacetsForSelected: true,
};

const doiConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'doi',
  displayName: IdentityLabel,
  filterTranslation: 'resourceSearch.filters.paperDoi',
  disableFacetsForSelected: true,
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
      const filtered = matchSorter(countries, q ?? '', { keys: ['title', 'key'] });
      return { promise: Promise.resolve(filtered), cancel: () => {} };
    },
    [countries]
  );

  useEffect(() => {
    const nextFilters = {
      doi: generateFilters({ config: doiConfig, searchConfig, formatMessage }),
      gbifDerivedDatasetDoi: generateFilters({
        config: gbifDerivedDatasetDoiConfig,
        searchConfig,
        formatMessage,
      }),
      gbifDownloadKey: generateFilters({
        config: gbifDownloadKeyConfig,
        searchConfig,
        formatMessage,
      }),
      gbifProjectIdentifier: generateFilters({
        config: gbifProjectIdentifierConfig,
        searchConfig,
        formatMessage,
      }),
      gbifProgrammeAcronym: generateFilters({
        config: gbifProgrammeAcronymConfig,
        searchConfig,
        formatMessage,
      }),
      source: generateFilters({ config: sourceConfig, searchConfig, formatMessage }),
      publisher: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      peerReview: generateFilters({ config: peerReviewConfig, searchConfig, formatMessage }),
      openAccess: generateFilters({ config: openAccessConfig, searchConfig, formatMessage }),
      year: generateFilters({ config: yearConfig, searchConfig, formatMessage }),
      literatureType: generateFilters({
        config: literatureTypeConfig,
        searchConfig,
        formatMessage,
      }),
      relevance: generateFilters({
        config: literatureRelevanceConfig,
        searchConfig,
        formatMessage,
      }),
      topics: generateFilters({ config: topicsConfig, searchConfig, formatMessage }),
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      publishingOrganizationKey: generateFilters({
        config: publishingOrganizationKeyConfig,
        searchConfig,
        formatMessage,
      }),
      gbifDatasetKey: generateFilters({ config: datasetConfig, searchConfig, formatMessage }),
      countriesOfResearcher: generateFilters({
        config: {
          ...countriesOfResearcherConfig,
          suggestConfig: { getSuggestions: countrySuggest },
        },
        searchConfig,
        formatMessage,
      }),
      countriesOfCoverage: generateFilters({
        config: { ...countriesOfCoverageConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      gbifTaxonKey: generateFilters({
        config: { ...taxonKeyConfig },
        searchConfig,
        formatMessage,
      }),
      gbifNetworkKey: generateFilters({
        config: { ...gbifNetworkKeyConfig },
        searchConfig,
        formatMessage,
      }),
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
