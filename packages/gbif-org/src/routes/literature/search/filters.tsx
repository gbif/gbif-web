import {
  CountryLabel,
  DatasetLabel,
  IdentityLabel,
  LiteratureTypeLabel,
  PublisherLabel,
  RelevanceLabel,
  TaxonLabel,
  TopicsLabel,
  YearLabel,
} from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterFreeTextConfig,
  filterRangeConfig,
  FilterSetting,
  filterSuggestConfig,
  generateFilters,
} from '@/components/filters/filterTools';
import { useIntl } from 'react-intl';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import country from '@/enums/basic/country.json';
import literatureTypeOptions from '@/enums/cms/literatureType.json';
import relevanceOptions from '@/enums/cms/relevance.json';
import topicsOptions from '@/enums/cms/topics.json';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCallback, useEffect, useState } from 'react';
import { SuggestFnProps } from '@/components/filters/suggest';
import { datasetKeySuggest, publisherKeySuggest, taxonKeySuggest } from '@/utils/suggestEndpoints';

const publisherConfig: filterSuggestConfig = {
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
        config: publisherConfig,
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
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
