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
});