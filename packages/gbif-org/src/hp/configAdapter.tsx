/* there are various versions of the config in circulation. 
They should be changed at source, but to ease deployment, we will attempt to remap them here.
And to make it even easier we will log the corrected version to the console. 
That should make it easy to copy it to the source file for the user.
*/

import { Config } from '@/config/config';

export function configAdapter(config: object): Partial<Config> {
  if (config?.version === 3) {
    return config as Partial<Config>;
  } else {
    return convertedConfig(config);
  }
}

function convertedConfig(config: object): Partial<Config> {
  let pages;
  if (config?.routes?.enabledRoutes) {
    pages = config?.routes?.enabledRoutes.map((route: string) => {
      return { id: route };
    });
  }
  const newConfig: Partial<Config> = {
    version: 3,
    pages: pages,
    disableInlineTableFilterButtons: config?.disableInlineTableFilterButtons ?? false,
    theme: config?.theme,
    maps: {
      locale: config?.maps?.locale,
      mapStyles: {
        defaultProjection: config?.maps?.defaultProjection,
        defaultMapStyle: config?.maps?.defaultMapStyle,
        options: config?.maps?.mapStyles,
      },
      addMapStyles: config?.maps?.addMapStyles,
      styleLookup: config?.maps?.styleLookup,
    },
    languages: config.languages,
    occurrenceSearch: {
      scope: config?.occurrence?.rootPredicate,
      highlightedFilters: config?.occurrence?.highlightedFilters,
      excludedFilters: config?.occurrence?.excludedFilters,
      defaultEnabledTableColumns: config?.occurrence?.defaultTableColumns,
      // lowercase tab names
      tabs: config?.occurrence?.occurrenceSearchTabs?.map((tab: string) => tab.toLowerCase()),
    },
    collectionSearch: {
      scope: config?.collection?.rootFilter,
      highlightedFilters: config?.collection?.highlightedFilters,
      excludedFilters: config?.collection?.excludedFilters,
      defaultEnabledTableColumns: config?.collection?.defaultTableColumns,
    },
    institutionSearch: {
      scope: config?.institution?.rootFilter,
      highlightedFilters: config?.institution?.highlightedFilters,
      excludedFilters: config?.institution?.excludedFilters,
      defaultEnabledTableColumns: config?.institution?.defaultTableColumns,
    },
    datasetSearch: {
      scope: config?.dataset?.rootFilter,
      highlightedFilters: config?.dataset?.highlightedFilters,
      excludedFilters: config?.dataset?.excludedFilters,
      defaultEnabledTableColumns: config?.dataset?.defaultTableColumns,
    },
    publisherSearch: {
      scope: config?.publisher?.rootFilter,
      highlightedFilters: config?.publisher?.highlightedFilters,
      excludedFilters: config?.publisher?.excludedFilters,
      defaultEnabledTableColumns: config?.publisher?.defaultTableColumns,
    },
  };
  console.log('Converted config to version 3:');
  console.log(newConfig);
  return newConfig as Config;
}

/*
example config of version 2

var siteConfig = {
  version: 2,
  disableInlineTableFilterButtons: false, // disable option for adding filters by clicking table cells. See https://github.com/gbif/hosted-portals/issues/274
  routes: {
    enabledRoutes: ['occurrenceSearch', 'collectionSearch', 'collectionKey', 'institutionSearch', 'institutionKey'], // what widgets do you include on your site. If not included we will link to gbif.org (for showing individual datasets for example)
    occurrenceSearch: { // you can overwrite individual routes. 
      route: '/specimen/search' // in this case we want the occurrence search to be available on a url that says specimens instead
    }
  },
  availableCatalogues: ['INSTITUTION', 'COLLECTION', 'OCCURRENCE'],
  occurrence: {
    excludedFilters: ['occurrenceStatus', 'networkKey', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode', 'institutionCode', 'collectionCode'],
    highlightedFilters: ['taxonKey', 'verbatimScientificName', 'institutionKey', 'collectionKey', 'catalogNumber', 'recordedBy', 'identifiedBy'],
    defaultTableColumns: ['features', 'institutionKey', 'collectionKey', 'catalogNumber', 'country', 'year', 'recordedBy', 'identifiedBy'],
    mapSettings: {
      lat: 0,
      lng: 0,
      zoom: 0
    },
    rootPredicate: {
      "type": "and",
      "predicates": [
        {
          "type": "or",
          "predicates": [
            {
              "type": "isNotNull",
              "key": "institutionKey"
            },
            {
              "type": "isNotNull",
              "key": "collectionKey"
            }
          ]
        },
        {
          "type": "in",
          "key": "basisOfRecord",
          "values": [
            "PRESERVED_SPECIMEN",
            "FOSSIL_SPECIMEN",
            "MATERIAL_SAMPLE",
            "LIVING_SPECIMEN"
          ]
        }
      ]
    },
    occurrenceSearchTabs: ['MAP', 'TABLE', 'GALLERY', 'DATASETS'] // what tabs should be shown
  },
  collection: {
    rootFilter: { // filters on the grscicoll collection v1 API https://www.gbif.org/developer/summary
      displayOnNHCPortal: true 
    }
  },
  institution: {
    rootFilter: { // filters on the grscicoll institution v1 API https://www.gbif.org/developer/summary
      displayOnNHCPortal: true,
      active: true
    },
    mapSettings: {
      enabled: true, // show a map on institution search?
      lat: 0, // what is the default position of the map
      lng: 0,
      zoom: 1
    },
  },
  literature: {
    rootFilter: {
      predicate: {
        type: 'or', predicates: [
          {
            type: 'in',
            key: 'countriesOfResearcher',
            values: ['US', 'UM', 'AS', 'FM', 'GU', 'MH', 'MP', 'PR', 'PW', 'VI']
          },
          {
            type: 'in',
            key: 'countriesOfCoverage',
            values: ['US', 'UM', 'AS', 'FM', 'GU', 'MH', 'MP', 'PR', 'PW', 'VI']
          }
        ]
      }
    },
    highlightedFilters: ['q', 'countriesOfResearcher', 'countriesOfCoverage', 'year']
  },
  dataset: {
    rootFilter: {type: ['CHECKLIST']}
  },
  apiKeys: {
    maptiler: "GET_YOUR_OWN_TOKEN", // https://github.com/gbif/hosted-portals/issues/229
    mapbox: "GET_YOUR_OWN__TOKEN"
  },
  maps: {
    locale: 'ja', // we want to show the maps in japanese
    defaultProjection: 'MERCATOR',
    defaultMapStyle: 'BRIGHT',
    mapStyles: {
      ARCTIC: ['NATURAL', 'BRIGHT'],
      PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
      MERCATOR: ['NATURAL', 'BRIGHT', 'SATELLITE', 'DARK'],
      ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK']
    }
  },
  messages: { // custom overwrites for the translations, e.g. label the occurrence catalog as a specimen catalog to match our data scope of specimens.
    "catalogues.occurrences": "Specimens"
  }
};
*/
