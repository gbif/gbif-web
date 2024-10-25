import {
  CountryLabel,
  DatasetLabel,
  DatasetTypeLabel,
  IdentityLabel,
  LicenceLabel,
  LiteratureTypeLabel,
  PublisherLabel,
  RelevanceLabel,
  TaxonLabel,
  TopicsLabel,
  YearLabel,
} from '@/components/filters/displayNames';
import {
  filterConfig,
  filterConfigTypes,
  FilterSetting,
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


const publisherConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'publishingOrganizationKey',
  displayName: PublisherLabel,
  filterTranslation: 'filters.publisherKey.name',
  disableFacetsForSelected: true,
  suggest: ({ q, siteConfig }: SuggestFnProps) => {
    return fetch(`${siteConfig.v1Endpoint}/organization/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
  },
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

const datasetConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifDatasetKey',
  displayName: DatasetLabel,
  filterTranslation: 'filters.datasetKey.name',
  disableFacetsForSelected: true,
  suggest: ({ q, siteConfig }: SuggestFnProps) => {
    return fetch(`${siteConfig.v1Endpoint}/dataset/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data.map((item) => ({title: item.title, key: item.key}));
      });
  },
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

const literatureTypeConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'literatureType',
  displayName: LiteratureTypeLabel,
  options: literatureTypeOptions,
  filterTranslation: 'filters.literatureType.name',
  facetQuery: /* GraphQL */ `
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

const literatureRelevanceConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'relevance',
  displayName: RelevanceLabel,
  options: relevanceOptions,
  filterTranslation: 'filters.relevance.name',
  facetQuery: /* GraphQL */ `
    query LiteratureTypeFacet($predicate: Predicate) {
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

const topicsConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'topics',
  displayName: TopicsLabel,
  options: topicsOptions,
  filterTranslation: 'filters.topics.name',
  facetQuery: /* GraphQL */ `
    query LiteratureTypeFacet($predicate: Predicate) {
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

const countriesOfCoverageConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'countriesOfCoverage',
  displayName: CountryLabel,
  filterTranslation: 'filters.countriesOfCoverage.name',
  facetQuery: /* GraphQL */ `
    query LiteratureResearcherCountryFacet($predicate: Predicate) {
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

const countriesOfResearcherConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'countriesOfResearcher',
  displayName: CountryLabel,
  filterTranslation: 'filters.countriesOfResearcher.name',
  facetQuery: /* GraphQL */ `
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

const freeTextConfig: filterConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
};

const yearConfig: filterConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'year',
  regex: /^((-)?[0-9]{0,4})(,)?((-)?[0-9]{0,4})$/,
  displayName: YearLabel,
  filterTranslation: 'filters.year.name',
};

const taxonKeyConfig: filterConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'gbifTaxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggest: ({ q, siteConfig }: SuggestFnProps) => {
    return fetch(`${siteConfig.v1Endpoint}/species/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        return data.map((item) => ({
          key: item.key,
          title: item.scientificName,
        }));
      });
  },
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
      year: generateFilters({ config: yearConfig, searchConfig, formatMessage }),
      literatureType: generateFilters({ config: literatureTypeConfig, searchConfig, formatMessage }),
      relevance: generateFilters({ config: literatureRelevanceConfig, searchConfig, formatMessage }),
      topics: generateFilters({ config: topicsConfig, searchConfig, formatMessage }),
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      publishingOrganizationKey: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      gbifDatasetKey: generateFilters({ config: datasetConfig, searchConfig, formatMessage }),
      countriesOfResearcher: generateFilters({
        config: { ...countriesOfResearcherConfig, suggest: countrySuggest },
        searchConfig,
        formatMessage,
      }),
      countriesOfCoverage: generateFilters({
        config: { ...countriesOfCoverageConfig, suggest: countrySuggest },
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
