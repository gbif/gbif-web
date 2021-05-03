import React from 'react';
export default React.createContext({
  collectionKey: {
    url: ({key}) => `/collection/${key}`,
    route: '/collection/:key'
  },
  collectionSearch: {
    url: () => `/collection-search/`
  },
  collectionSpecimens: {
    url: ({key}) => `/collection/${key}/specimens`
  },

  institutionKey: {
    url: ({key}) => `/institution/${key}`,
    route: '/institution/:key'
  },
  institutionSearch: {
    url: () => `/institution-search/`
  },

  datasetKey: {
    url: ({key}) => `/dataset/${key}`,
    route: '/dataset/:key'
  },
  datasetSearch: {
    url: () => `/dataset-search/`
  },

  publisherKey: {
    url: ({key}) => `/publisher/${key}`,
    route: '/publisher/:key'
  },
  publisherSearch: {
    url: () => `/publisher-search/`
  },
});