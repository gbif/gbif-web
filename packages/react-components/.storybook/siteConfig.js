import env from '../.env.json';

const routeConfig = {
  occurrenceSearch: {
    url: ({ queryString }) => {
      return `iframe.html?id=search-occurrencesearch--example&viewMode=story`;
    },
    isHref: true,
    route: '/',
  },

  collectionKey: {
    route: '/',
    isHref: true,
    url: ({ key }) => {
      return `/iframe.html?id=entities-collection-page--example&viewMode=story&knob-collectionUUID=${key}`;
    }
  },
  collectionSearch: {
    // url: () => `/collection/`,
    url: ({ queryString, basename }) => {
      return `/iframe.html?id=search-collectionsearch--example&viewMode=story`;
    },
    isHref: true,
    route: '/collection/search',
  },
  collectionSpecimens: {
    url: ({ key }) => `/collection/${key}/specimens`
  },

  institutionKey: {
    isHref: true,
    url: ({ key }) => {
      return `/iframe.html?id=entities-institution-page--example&viewMode=story&knob-institutionUUID=${key}`;
    }
  },
  institutionSearch: {
    // url: () => `/institution/`,
    url: ({ queryString }) => {
      return `/iframe.html?id=search-institutionsearch--example&viewMode=story`;
    },
    isHref: true,
    route: '/institution/search',
  },

  datasetKey: {
    isHref: true,
    url: ({ key }) => {
      // return `/iframe.html?id=entities-dataset-page--example&viewMode=story&knob-datasetUUID=${key}`;
      return `/?path=/story/entities-dataset-page--example&knob-Choose%20Direction=ltr&knob-Choose%20Theme=gbif&knob-Choose%20locale=en-DK&knob-datasetUUID=${key}`;
    },
    route: '/'
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
};

export const siteConfig = {
  routeConfig,
  occurrence: {},
  dataset: {},
  literature: {},
  institution: {},
  collection: {},
  publisher: {},
  apiKeys: {
    mapbox: env._FOR_STORYBOOK_BUT_PUBLIC.apiKeys.mapbox,
    bing: 'need to make a call to register',
    maptiler: env._FOR_STORYBOOK_BUT_PUBLIC.apiKeys.maptiler
  },
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
    //     BRIGHT_MERCATOR_TEST: {
    //       component: mapComponents.OpenlayersMap,
    //       labelKey: 'My custom map',
    //       mapConfig: {
    //         basemapStyle: `klokantech`,
    //         projection: 'EPSG_3857'
    //       }
    //     }
    //   }
    // },
    styleLookup: {
      MERCATOR: {
        // BRIGHT: 'BRIGHT_MERCATOR_TEST',
        NATURAL: 'NATURAL_HILLSHADE_MERCATOR'
      }
    }
  }
};