import env from '../.env.json';
const gbifOrg = 'https://www.gbif.org';

const routeConfig = {
  enabledRoutes: ['datasetSearch', 'occurrenceSearch', 'institution', 'institutionSearch', 'publisherSearch', 'collectionKey'],
  occurrenceSearch: {
    url: ({ queryString }) => {
      return `/iframe.html?args=&id=search-occurrencesearch--standalone-example&viewMode=story${queryString}`;
    },
    // url: ({route, queryString, basename}) => `${basename ? `/${basename}` : ''}${route}${queryString ? `?${queryString}` : ''}`,
    isHref: true,
    route: '/occurrence/search',
  },

  speciesSearch: {
    url: ({ queryString }) => `${gbifOrg}/species/search?${queryString}`,
    isHref: true,
    route: '/species/search',
  },

  collectionKey: {
    isHref: true,
    url: ({ key }) => {
      return `/?path=/story/entities-collection-page--example&knob-collectionUUID=${key}`;
    },
    route: '/'
  },
  collectionSearch: {
    // url: () => `/collection/`,
    url: ({ queryString, basename }) => {
      return `/?path=/story/search-collectionsearch--example`;
    },
    isHref: true,
    route: '/collection/search',
  },
  collectionKeySpecimens: {
    parent: 'collectionKey',
    // url: ({ key }) => `/collection/${key}/specimens`
    url: ({ route, queryString, basename, key }) => `${basename ? `/${basename}` : ''}/collection/${key}/specimens${queryString ? `?${queryString}` : ''}`,
    route: '/specimens',
  },
  collectionKeyDashboard: {
    parent: 'collectionKey',
    // url: ({ key }) => `/collection/${key}/specimens`
    url: ({ route, queryString, basename, key }) => `${basename ? `/${basename}` : ''}/collection/${key}/specimens${queryString ? `?${queryString}` : ''}`,
    route: '/dashboard',
  },

  institutionKey: {
    isHref: true,
    url: ({ key }) => {
      return `/?path=/story/entities-institution-page--example&knob-institutionUUID=${key}`;
    },
    route: '/institution/:key',
  },
  institutionKeySpecimens: {
    url: ({ key }) => `/specimens`,
    isHref: false,
  },
  institutionKeyCollections: {
    url: ({ key }) => `/collections`,
    isHref: false,
  },
  institutionSearch: {
    // url: () => `/institution/`,
    url: ({ queryString }) => {
      return `/?path=/story/search-institutionsearch--example&viewMode=story`;
    },
    isHref: true,
    route: '/institution/search',
  },

  datasetKey: {
    isHref: true,
    // url: ({key}) => `https://collections.ala.org.au/public/showDataResource/${key}`,
    url: ({ key }) => {
      // return `/iframe.html?id=entities-dataset-page--example&viewMode=story&knob-datasetUUID=${key}`;
      return `/?path=/story/entities-dataset-page--example&knob-Choose%20Direction=ltr&knob-Choose%20locale=en-DK&knob-datasetUUID=${key}`;
    },
    route: '/'
  },
  datasetCitations: {
    route: '/dataset/:key/citations',
    url: ({ key }) => `/dataset/${key}/citations`
  },
  datasetDownload: {
    route: '/dataset/:key/download',
    url: ({ key }) => `/dataset/${key}/download`
  },
  datasetSearch: {
    // url: () => `/dataset-search/`,
    url: ({ queryString }) => {
      return `/iframe.html?id=search-datasetsearch--example&viewMode=story`;
      // return `/?path=/story/search-datasetsearch--example`;
    },
    isHref: true,
    route: '/dataset/search',
  },

  publisherKey: {
    isHref: true,
    url: ({ key }) => {
      // return `/iframe.html?id=entities-publisher-page--example&viewMode=story&knob-publisherUUID=${key}`;
      return `https://www.gbif.org/publisher/${key}`;
    },
    route: '/publisher/:key'
  },
  publisherSearch: {
    // url: () => `/publisher-search/`,
    url: ({ queryString }) => {
      return `/iframe.html?id=search-publishersearch--example&viewMode=story`;
    },
    isHref: true,
    route: '/publisher/search',
  },

  literatureSearch: {
    url: ({ queryString }) => {
      return `iframe.html?id=search-literaturesearch--example&viewMode=story`;
    },
    isHref: true,
    route: '/literature/search',
  },

  eventKey: {
    // url: ({key}) => `/publisher/${key}`,
    // url: ({key, otherIds}) => `${gbifOrg}/dataset/${otherIds.datasetKey}/event/${key}`,
    url: ({ key, otherIds }) => `https://collections.ala.org.au/public/showDataResource/${otherIds.datasetKey}?event=${key}`,
    isHref: true,
    route: '/event/:key'
  },
  eventSearch: {
    url: ({ queryString, basename }) => `${basename ? `/${basename}` : ''}/event/search`,
    isHref: true,
    route: '/publisher/search'
  },
  taxonKey: {
    url: ({ key }) => `https://gbif.org/species/${key}`,
    isHref: true,
    route: '/taxon/:key'
  },
  networkKey: {
    isHref: true,
    url: ({ key }) => `${env.GBIF_ORG}/network/${key}`,
    route: '/'
  },
};

export const siteConfig = {
  routeConfig,
  occurrence: {
    mapSettings: {
      userLocationEnabled: true,
    }
  },
  dataset: {},
  event: {
    enableGraphQLAPI: true,
    enableResetFilter: true
  },
  literature: {},
  institution: {
    mapSettings: {
      enabled: true,
      lat: 54.89,
      lng: -3.86,
      zoom: 5.4
    },
  },
  collection: {},
  publisher: {},
  apiKeys: {
    mapbox: env._FOR_STORYBOOK_BUT_PUBLIC?.apiKeys?.mapbox,
    bing: 'need to make a call to register',
    maptiler: env._FOR_STORYBOOK_BUT_PUBLIC?.apiKeys?.maptiler
  },
  availableCatalogues: ['OCCURRENCE', 'DATASET', 'PUBLISHER', 'LITERATURE', 'COLLECTION', 'INSTITUTION'],
  maps: {
    // locale: 'ja',
    defaultProjection: 'MERCATOR',
    defaultMapStyle: 'NATURAL',
    mapStyles: {
      ARCTIC: ['NATURAL', 'BRIGHT'],
      PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
      MERCATOR: ['NATURAL', 'BRIGHT', 'SATELLITE', 'DARK'],
      ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK']
    },
    // addMapStyles: function ({ mapStyleServer, language, pixelRatio, apiKeys, mapComponents }) {
    //   return {
    //     MERCATOR_TOWNS: {
    //       component: mapComponents.OpenlayersMap,
    //       labelKey: 'Towns',
    //       mapConfig: {
    //         basemapStyle: `http://localhost:3001/assets/map-styles/cities.json`,
    //         projection: 'EPSG_3857'
    //       }
    //     }
    //   }
    // },
    // styleLookup: {
    //   MERCATOR: {
    //     BRIGHT: 'MERCATOR_TOWNS',
    //     NATURAL: 'NATURAL_HILLSHADE_MERCATOR'
    //   }
    // }
  }
};