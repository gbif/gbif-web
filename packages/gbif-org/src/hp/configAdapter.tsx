/* there are various versions of the config in circulation. 
They should be changed at source, but to ease deployment, we will attempt to remap them here.
And to make it even easier we will log the corrected version to the console. 
That should make it easy to copy it to the source file for the user.
*/

import { Config, LanguageOption, PageConfig } from '@/config/config';
import { languagesOptions } from '@/config/languagesOptions';

export function configAdapter(config: object): Partial<Config> {
  if (config?.version === 3) {
    return config as Partial<Config>;
  } else {
    return convertedConfig(config);
  }
}

function convertedConfig(config: object): Partial<Config> {
  let pages = config?.pages;
  const routeNames = config?.routes?.enabledRoutes ?? Object.keys(config?.routes ?? {});
  if (!pages && routeNames) {
    pages = routeNames.map((route: string) => {
      const page: PageConfig = { id: route };
      const path = config?.routes?.[route]?.route;
      // remove trailing slash and ending slash from path
      const cleanedPath = path?.replace(/^\/|\/$/g, '');
      if (path) {
        page.path = cleanedPath;
      }
      return page;
    });
  }

  // assume that if there is config for a type, then the page should be enabled
  if (config?.occurrence) {
    // if not already in pages, then add it
    if (!pages.find((page: PageConfig) => page.id === 'occurrenceSearch')) {
      pages.push({ id: 'occurrenceSearch' });
    }
  }
  if (config?.dataset) {
    // if not already in pages, then add it
    if (!pages.find((page: PageConfig) => page.id === 'datasetSearch')) {
      pages.push({ id: 'datasetSearch' });
    }
  }
  if (config?.publisher) {
    // if not already in pages, then add it
    if (!pages.find((page: PageConfig) => page.id === 'publisherSearch')) {
      pages.push({ id: 'publisherSearch' });
    }
  }
  if (config?.institution) {
    // if not already in pages, then add it
    if (!pages.find((page: PageConfig) => page.id === 'institutionSearch')) {
      pages.push({ id: 'institutionSearch' });
    }
  }
  if (config?.collection) {
    // if not already in pages, then add it
    if (!pages.find((page: PageConfig) => page.id === 'collectionSearch')) {
      pages.push({ id: 'collectionSearch' });
    }
  }
  if (config?.literature) {
    // if not already in pages, then add it
    if (!pages.find((page: PageConfig) => page.id === 'literatureSearch')) {
      pages.push({ id: 'literatureSearch' });
    }
  }

  let occTabs = config?.occurrence?.occurrenceSearchTabs?.map((tab: string) => tab.toLowerCase());
  if (occTabs && !occTabs.includes('download')) {
    occTabs.push('download');
  }
  const supportedLanguages = languagesOptions;
  // map provided languages to supported languages
  const mappedLanguages = config?.languages.map((lang: LanguageOption) => {
    const matchedLanguage = supportedLanguages.find(
      (targetLang: LanguageOption) => (lang.localeCode ?? lang.code) === targetLang.localeCode
    );
    if (matchedLanguage) {
      return { ...matchedLanguage, ...lang, default: lang.default ?? false };
    } else {
      // get english as default
      const english = supportedLanguages.find((lang: LanguageOption) => lang.code === 'en');
      return {
        ...english,
        code: lang.code,
        default: lang.default ?? false,
      };
    }
  });

  const newConfig: Partial<Config> = {
    version: 3,
    pages: pages,
    disableInlineTableFilterButtons: config?.disableInlineTableFilterButtons ?? false,
    availableCatalogues: config?.availableCatalogues ?? getFromConfiguration(config),
    defaultChecklistKey: config?.defaultChecklistKey,
    dataHeader: {
      enableApiPopup: false,
      enableInfoPopup: false,
    },
    theme: config?.theme,
    apiKeys: config?.apiKeys,
    maps: {
      locale: config?.maps?.locale,
      mapStyles: {
        defaultProjection: config?.maps?.defaultProjection ?? 'MERCATOR',
        defaultMapStyle: config?.maps?.defaultMapStyle ?? 'BRIGHT',
        options: config?.maps?.mapStyles ?? { MERCATOR: ['BRIGHT', 'NATURAL'] },
      },
      addMapStyles: config?.maps?.addMapStyles,
      styleLookup: config?.maps?.styleLookup,
    },
    languages: mappedLanguages,
    suggest: config.suggest,
    messages: config.languages.reduce((acc: any, curr: string) => {
      acc[curr.code] = config?.messages?.[curr.code] ?? config.messages;
      return acc;
    }, {}),
    occurrenceSearch: {
      scope: config?.occurrence?.rootPredicate,
      highlightedFilters: mapOccurrenceFilterNames(config?.occurrence?.highlightedFilters),
      excludedFilters: mapOccurrenceFilterNames(config?.occurrence?.excludedFilters),
      defaultEnabledTableColumns: config?.occurrence?.defaultTableColumns,
      availableTableColumns: config?.occurrence?.availableTableColumns,
      // lowercase tab names
      tabs: occTabs,
      mapSettings: config?.occurrence?.mapSettings,
    },
    collectionSearch: {
      scope: config?.collection?.rootFilter,
      highlightedFilters: mapCollectionFilterNames(config?.collection?.highlightedFilters),
      excludedFilters: mapCollectionFilterNames(config?.collection?.excludedFilters),
      defaultEnabledTableColumns: config?.collection?.defaultTableColumns,
    },
    institutionSearch: {
      scope: config?.institution?.rootFilter,
      highlightedFilters: mapInstitutionFilterNames(config?.institution?.highlightedFilters),
      excludedFilters: mapInstitutionFilterNames(config?.institution?.excludedFilters),
      defaultEnabledTableColumns: config?.institution?.defaultTableColumns,
    },
    datasetSearch: {
      scope: config?.dataset?.rootFilter,
      highlightedFilters: mapDatasetFilterNames(config?.dataset?.highlightedFilters),
      excludedFilters: mapDatasetFilterNames(config?.dataset?.excludedFilters),
      defaultEnabledTableColumns: config?.dataset?.defaultTableColumns,
    },
    publisherSearch: {
      scope: config?.publisher?.rootFilter,
      highlightedFilters: mapPublisherFilterNames(config?.publisher?.highlightedFilters),
      excludedFilters: mapPublisherFilterNames(config?.publisher?.excludedFilters),
      defaultEnabledTableColumns: config?.publisher?.defaultTableColumns,
    },
    literatureSearch: {
      scope: config?.literature?.rootPredicate ?? config?.literature?.rootFilter?.predicate,
      highlightedFilters: config?.literature?.highlightedFilters,
      excludedFilters: config?.literature?.excludedFilters,
      defaultEnabledTableColumns: config?.literature?.defaultTableColumns,
      availableTableColumns: config?.literature?.availableTableColumns,
    },
  };
  console.log('Converted config to version 3:');
  console.log(newConfig);
  return newConfig as Config;
}

function mapDatasetFilterNames(list) {
  if (!list) return undefined;
  return list.map((name: string) => {
    const mappedName = {
      anyPublisherKey: 'publishingOrg',
      datasetType: 'type',
      publishingCountryCode: 'publishingCountry',
      hostingOrganizationKey: 'hostingOrg',
    };
    return mappedName[name] || name;
  });
}

function mapPublisherFilterNames(list) {
  if (!list) return undefined;
  return list.map((name: string) => {
    const mappedName = {
      countrySingle: 'country',
    };
    return mappedName[name] || name;
  });
}

function mapCollectionFilterNames(list) {
  if (!list) return undefined;
  return list.map((name: string) => {
    const mappedName = {
      institutionKeySingle: 'institutionKey',
      countryGrSciColl: 'country',
      city: 'city',
      personalCollection: 'personalCollection',
      active: 'active',
      numberSpecimens: 'numberSpecimens',
      specimensInGbif: 'occurrenceCount',
      name: 'name',
      alternativeCode: 'alternativeCode',
      collectionContentType: 'contentType',
      preservationType: 'preservationType',
      taxonKeyGrSciColl: 'taxonKey',
      typeStatus: 'typeStatus',
      collectionDescriptorCountry: 'descriptorCountry',
      recordedByFreeText: 'recordedBy',
    };
    return mappedName[name] || name;
  });
}

function mapInstitutionFilterNames(list) {
  if (!list) return undefined;
  return list.map((name: string) => {
    const mappedName = {
      q: 'q',
      active: 'active',
      countryGrSciColl: 'country',
      countrySingleGrSciColl: 'country',
      institutionType: 'type',
      discipline: 'discipline',
      alternativeCode: 'alternativeCode',
      city: 'city',
      name: 'name',
      code: 'code',
      numberSpecimens: 'numberSpecimens',
      specimensInGbif: 'occurrenceCount',
    };
    return mappedName[name] || name;
  });
}

function mapOccurrenceFilterNames(list) {
  if (!list) return undefined;
  return list.map((name: string) => {
    const mappedName = {
      occurrenceIssue: 'issue',
      publishingCountryCode: 'publishingCountry',
      publisherKey: 'publishingOrg',
    };
    return mappedName[name] || name;
  });
}

function getFromConfiguration(config: any) {
  const catalogues = [];
  if (config?.occurrence) catalogues.push('OCCURRENCE');
  if (config?.dataset) catalogues.push('DATASET');
  if (config?.institution) catalogues.push('INSTITUTION');
  if (config?.collection) catalogues.push('COLLECTION');
  if (config?.publisher) catalogues.push('PUBLISHER');
  if (config?.literature) catalogues.push('LITERATURE');
  return catalogues;
}

/*
occurrence search filter names on the old site
[
  'taxonKey',
  'country',
  'publishingCountryCode',
  'datasetKey',
  'publisherKey',
  'institutionCode',
  'catalogNumber',
  'hostingOrganizationKey',
  'networkKey',
  'year',
  'basisOfRecord',
  'typeStatus',
  'occurrenceIssue',
  'mediaType',
  'sampleSizeUnit',
  'license',
  'projectId',
  'coordinateUncertainty',
  'depth',
  'organismQuantity',
  'sampleSizeValue',
  'relativeOrganismQuantity',
  'month',
  'continent',
  'protocol',
  'establishmentMeans',
  'recordedBy',
  'recordNumber',
  'collectionCode',
  'recordedById',
  'identifiedById',
  'occurrenceId',
  'organismId',
  'locality',
  'waterBody',
  'higherGeography',
  'stateProvince',
  'eventId',
  'samplingProtocol',
  'elevation',
  'occurrenceStatus',
  'gadmGid',
  'identifiedBy',
  'isInCluster',
  'hasCoordinate',
  'hasGeospatialIssue',
  'institutionKey',
  'collectionKey',
  'q',
  'iucnRedListCategory',
  'verbatimScientificName',
  'dwcaExtension',
  'geometry'
]
*/
