import { Config } from '@/config/config';
import { getEndpoints } from '@/config/endpoints';
import { languagesOptions } from '@/config/languagesOptions';

// The env options
type Options = {
  baseUrl: string;
  translationsEntryEndpoint: string;
  v1Endpoint: string;
  contentSearchEndpoint: string;
  // When running e2e tests, we need a separate endpoint for the server and client as the server needs the endpoint in on the
  // internal docker network and the client needs the endpoint on the host machine
  graphqlEndpoint: string;
  graphqlEndpointServer: string;
  graphqlEndpointClient: string;
  formsEndpoint: string;
  formsEndpointServer: string;
  formsEndpointClient: string;
};

// Extract config options from the environment variables
const options = {
  baseUrl: import.meta.env.PUBLIC_BASE_URL,
  ...getEndpoints(),
  graphqlEndpointServer: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT_SERVER,
  graphqlEndpointClient: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT_CLIENT,
  formsEndpointServer: import.meta.env.PUBLIC_FORMS_ENDPOINT_SERVER,
  formsEndpointClient: import.meta.env.PUBLIC_FORMS_ENDPOINT_CLIENT,
} as Options;

if (!options.baseUrl) throw new Error('Missing PUBLIC_BASE_URL env variable');

const isServer = () => typeof window === 'undefined';

export const gbifConfig: Config = {
  version: 3,
  ...options,
  get graphqlEndpoint() {
    if (isServer()) {
      return options.graphqlEndpointServer ?? options.graphqlEndpoint;
    }
    return options.graphqlEndpointClient ?? options.graphqlEndpoint;
  },
  get formsEndpoint() {
    if (isServer()) {
      return options.formsEndpointServer ?? options.formsEndpoint;
    }
    return options.formsEndpointClient ?? options.formsEndpoint;
  },
  // suggest: {
  //   gadm: {
  //     type: 'PARAMS',
  //     value: { gadmGid: 'DEU' },
  //   },
  // },
  // pages: [
  //   {
  //     id: 'home',
  //   },
  //   {
  //     id: 'occurrenceSearch',
  //     path: 'specimen/search',
  //   },
  //   {
  //     id: 'occurrenceKey',
  //     path: 'specimen/:key',
  //   },
  //   {
  //     id: 'datasetSearch',
  //     path: 'test/dataset',
  //   },
  //   // {
  //   //   id: 'datasetKey',
  //   //   path: 'test/dataset/:key',
  //   //   // isCustom: true,
  //   // },
  //   {
  //     id: 'publisherKey',
  //   },
  //   {
  //     id: 'collectionKey',
  //   },
  //   {
  //     id: 'institutionKey',
  //   },
  //   {
  //     id: 'speciesSearch',
  //   },
  //   {
  //     id: 'speciesKey',
  //   },
  // ],
  defaultTitle: 'GBIF',
  // The languages should be synced with supportedLocales in graphql-api/src/helpers/sanitize-html.ts
  languages: languagesOptions,
  theme: {
    primary: '#4787fb', //'#69AA69',
    // primary: '#69AA69',
    stickyOffset: '0px',
    borderRadius: 3,
    // mapDensityColors: ['#ffd300', '#f4b456', '#e9928a', '#d96cc1', '#b93bff'],
  },
  dataHeader: {
    enableApiPopup: true,
    enableInfoPopup: true,
  },
  openGraph: {
    site_name: 'GBIF',
  },
  apiKeys: {
    maptiler: import.meta.env.PUBLIC_API_KEY_MAPTILER,
  },
  // vernacularNames: {
  //   sourceTitle: 'The IUCN Red List of Threatened Species',
  //   datasetKey: '66dd0960-2d7d-46ee-a491-87b9adcfe7b1',
  // },
  hardcodedKeys: {
    OBISKey: 'ba0670b9-4186-41e6-8e70-f9cb3065551a',
    taiwanNodeidentifier: '239',
  },
  linkToGbifOrg: true,
  publisherSearch: {
    enableUserCountryInfo: true,
    queryType: 'V1',
    // scope: {
    //   country: 'DK',
    // },
    // excludedFilters: ['country'],
  },
  datasetSearch: {
    excludedFilters: [],
    highlightedFilters: ['q', 'type', 'publishingOrg', 'license'],
    // defaultTableColumns: ['title', 'description', 'publisher', 'type', 'occurrenceCount', 'literatureCount'],
    // scope: {
    //   publishingCountry: ['DK'],
    // },
  },
  datasetKey: {
    occurrenceSearch: {
      // availableTableColumns: ['country', 'coordinates', 'year', 'basisOfRecord', 'dataset'],
      // defaultEnabledTableColumns: ['country', 'year', 'basisOfRecord', 'dataset'],
      // tabs: ['table', 'map', 'gallery', 'download'],
      // defaultTab: 'table',
    },
    disableInPageOccurrenceSearch: false,
    literatureSearch: {
      excludedFilters: ['gbifDatasetKey'],
    },
  },
  collectionSearch: {
    highlightedFilters: [
      'q',
      'code',
      'country',
      'numberSpecimens',
      'occurrenceCount',
      'taxonKey',
      'descriptorCountry',
    ],
    // excludedFilters: ['institutionKey', 'active'],
  },
  collectionKey: {
    occurrenceSearch: {
      // availableTableColumns: ['country', 'coordinates', 'year', 'basisOfRecord', 'dataset'],
      // defaultEnabledTableColumns: ['country', 'year', 'basisOfRecord', 'dataset'],
      tabs: ['table', 'map', 'gallery', 'clusters', 'download'],
      defaultTab: 'table',
    },
  },
  institutionSearch: {
    highlightedFilters: ['q', 'code', 'country', 'numberSpecimens', 'occurrenceCount'],
    // excludedFilters: ['code', 'country'],
  },
  institutionKey: {
    occurrenceSearch: {
      excludedFilters: ['institutionKey'],
      // availableTableColumns: ['country', 'coordinates', 'year', 'basisOfRecord', 'dataset'],
      // defaultEnabledTableColumns: ['country', 'year', 'basisOfRecord', 'dataset'],
      // tabs: ['table', 'map', 'gallery', 'clusters', 'download'],
      defaultTab: 'table',
    },
  },
  taxonSearch: {
    scope: {
      datasetKey: ['d7dddbf4-2cf0-4f39-9b2a-bb099caae36c'],
    },
    highlightedFilters: ['q', 'status', 'rank', 'higherTaxonKey'],
  },
  literatureSearch: {
    queryType: 'PREDICATE',
    highlightedFilters: ['q', 'year'],
  },
  occurrenceSearch: {
    highlightedFilters: [
      // 'occurrenceStatus',
      'taxonKey',
      'year',
      'country',
      'issue',
      'geometry',
      'recordedBy',
    ],
    tabs: ['table', 'gallery', 'map', 'clusters', 'datasets', 'dashboard', 'download'],
    defaultTab: 'table',
    defaultEnabledTableColumns: ['scientificName', 'features', 'catalogNumber'],
    // availableTableColumns: ['country', 'coordinates', 'year', 'basisOfRecord', 'dataset'],
    // defaultEnabledTableColumns: ['country', 'year', 'basisOfRecord', 'dataset'],
    // scope: {
    //   type: 'equals',
    //   key: 'country',
    //   value: 'DK',
    // },
  },
  disableInlineTableFilterButtons: false,
  // messages: {
  //   en: { 'filters.taxonKey.name': 'hallo' },
  // }, // no messages to overwrite for gbif.org
  maps: {
    locale: 'en',
    mapStyles: {
      defaultProjection: 'MERCATOR',
      defaultMapStyle: 'NATURAL',
      options: {
        ARCTIC: ['NATURAL', 'BRIGHT'],
        PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
        MERCATOR: ['NATURAL', 'BRIGHT', 'SATELLITE', 'DARK', 'GEOLOGY'],
        ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK'],
      },
    },
    addMapStyles: function ({ mapStyleServer, language, pixelRatio, apiKeys, mapComponents }) {
      return {
        GEOLOGY: {
          // the name of your style
          component: mapComponents.OpenlayersMap, // what map component to use OpenlayersMap | MapLibreMap
          labelKey: 'Custom map from tilejson', // the label in the select. Use a translation key
          mapConfig: {
            basemapStyle: `${import.meta.env.PUBLIC_WEB_UTILS}/map-styles/3857/geology`,
            projection: 'EPSG_3857', // one of 4326 | 3031 | 3857 | 3575
          },
        },
      };
    },
    // rewire style names to show a different style
    styleLookup: {
      MERCATOR: {
        GEOLOGY: 'GEOLOGY',
      },
    },
  },
};
