import {
  booleanLabel,
  collectionContentTypeLabel,
  CountryLabel,
  IdentityLabel,
  InstitutionLabel,
  preservationTypeLabel,
  QuantityLabel,
  TaxonLabel,
  TypeStatusLabel,
} from '@/components/filters/displayNames';
import {
  filterBoolConfig,
  filterConfigTypes,
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
import {
  collectionContentTypeSuggest,
  institutionKeySuggest,
  preservationTypeSuggest,
  taxonKeySuggest,
  typeStatusSuggest,
} from '@/utils/suggestEndpoints';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export const activeConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'active',
  displayName: booleanLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.activeCollection.name',
  about: () => <Message id="filters.activeCollection.description" />,
};

export const personalCollectionConfig: filterBoolConfig = {
  filterType: filterConfigTypes.OPTIONAL_BOOL,
  filterHandle: 'personalCollection',
  displayName: booleanLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.personalCollection.name',
  about: () => <Message id="filters.personalCollection.description" />,
};

const institutionKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'institutionKey',
  displayName: InstitutionLabel,
  filterTranslation: 'filters.institutionKey.name',
  suggestConfig: institutionKeySuggest,
  facetQuery: `
    query CollectionInstitutionFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: institutionKey {
            name
            count
          }
        }
      }
    }
  `,
};

const countryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'country',
  displayName: CountryLabel,
  filterTranslation: 'filters.country.name',
  // suggest will be provided by the useFilters hook
  facetQuery: `
    query CollectionCountryFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: country {
            name
            count
          }
        }
      }
    }
  `,
};

const taxonKeyConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'taxonKey',
  displayName: TaxonLabel,
  filterTranslation: 'filters.taxonKey.name',
  suggestConfig: taxonKeySuggest,
  disableFacetsForSelected: true,
};

const descriptorCountryConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'descriptorCountry',
  displayName: CountryLabel,
  filterTranslation: 'filters.collectionDescriptorCountry.name',
  facetQuery: `
    query CollectionDescriptorCountryFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: descriptorCountry {
            name
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

const nameConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'name',
  displayName: IdentityLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.name.name',
};

export const codeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'code',
  displayName: IdentityLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.code.name',
  about: () => <Message id="filters.code.description" />,
};

export const alternativeCodeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'alternativeCode',
  displayName: IdentityLabel,
  disableFacetsForSelected: true,
  filterTranslation: 'filters.alternativeCode.name',
  about: () => <Message id="filters.alternativeCode.description" />,
};

export const occurrenceCountConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'occurrenceCount',
  displayName: QuantityLabel,
  filterTranslation: 'filters.specimensInGbif.name',
  about: () => <Message id="filters.specimensInGbif.description" />,
};

export const numberSpecimensConfig: filterRangeConfig = {
  filterType: filterConfigTypes.RANGE,
  filterHandle: 'numberSpecimens',
  displayName: QuantityLabel,
  filterTranslation: 'filters.numberSpecimens.name',
  about: () => <Message id="filters.numberSpecimens.description" />,
};

export const recordedByConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'recordedBy',
  displayName: IdentityLabel,
  filterTranslation: 'filters.recordedBy.name',
  facetQuery: /* GraphQL */ `
    query CollectionRecordedByFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: recordedBy(limit: 10) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.recordedBy.description" />,
};

export const cityConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'city',
  displayName: IdentityLabel,
  filterTranslation: 'filters.city.name',
  facetQuery: /* GraphQL */ `
    query CollectionCityFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: city(limit: 10) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.city.description" />,
};

export const contentTypeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'contentType',
  displayName: collectionContentTypeLabel,
  filterTranslation: 'filters.collectionContentType.name',
  suggestConfig: collectionContentTypeSuggest,
  facetQuery: /* GraphQL */ `
    query CollectionContentTypeFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: contentType(limit: 10) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.collectionContentType.description" />,
};

export const preservationTypeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'preservationType',
  displayName: preservationTypeLabel,
  filterTranslation: 'filters.preservationType.name',
  suggestConfig: preservationTypeSuggest,
  facetQuery: /* GraphQL */ `
    query CollectionPreservationTypeFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: preservationType(limit: 10) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.preservationType.description" />,
};

export const typeStatusConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'typeStatus',
  displayName: TypeStatusLabel,
  filterTranslation: 'filters.typeStatus.name',
  suggestConfig: typeStatusSuggest,
  facetQuery: /* GraphQL */ `
    query CollectionTypeStatusFacet($query: CollectionSearchInput) {
      search: collectionSearch(query: $query) {
        facet {
          field: typeStatus(limit: 10) {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.typeStatus.description" />,
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
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      name: generateFilters({ config: nameConfig, searchConfig, formatMessage }),
      active: generateFilters({ config: activeConfig, searchConfig, formatMessage }),
      personalCollection: generateFilters({
        config: personalCollectionConfig,
        searchConfig,
        formatMessage,
      }),
      code: generateFilters({ config: codeConfig, searchConfig, formatMessage }),
      city: generateFilters({ config: cityConfig, searchConfig, formatMessage }),
      recordedBy: generateFilters({ config: recordedByConfig, searchConfig, formatMessage }),
      contentType: generateFilters({ config: contentTypeConfig, searchConfig, formatMessage }),
      preservationType: generateFilters({
        config: preservationTypeConfig,
        searchConfig,
        formatMessage,
      }),
      typeStatus: generateFilters({ config: typeStatusConfig, searchConfig, formatMessage }),
      alternativeCode: generateFilters({
        config: alternativeCodeConfig,
        searchConfig,
        formatMessage,
      }),
      numberSpecimens: generateFilters({
        config: numberSpecimensConfig,
        searchConfig,
        formatMessage,
      }),
      occurrenceCount: generateFilters({
        config: occurrenceCountConfig,
        searchConfig,
        formatMessage,
      }),
      country: generateFilters({
        config: { ...countryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      descriptorCountry: generateFilters({
        config: { ...descriptorCountryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      institutionKey: generateFilters({
        config: { ...institutionKeyConfig },
        searchConfig,
        formatMessage,
      }),
      taxonKey: generateFilters({
        config: { ...taxonKeyConfig },
        searchConfig,
        formatMessage,
      }),

      // publishingOrg: generateFilters({ config: publisherConfig, searchConfig, formatMessage }),
      // hostingOrg: generateFilters({ config: hostingOrgConfig, searchConfig, formatMessage }),
      // projectId: generateFilters({ config: projectIdConfig, searchConfig, formatMessage }),

      // license: generateFilters({ config: licenceConfig, searchConfig, formatMessage }),
      // type: generateFilters({ config: datasetTypeConfig, searchConfig, formatMessage }),
    };
    setFilters(nextFilters);
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
