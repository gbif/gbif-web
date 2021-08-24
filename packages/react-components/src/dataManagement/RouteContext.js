import React from 'react';
const gbifOrg = 'https://www.gbif.org';

export default React.createContext({
  occurrenceSearch: {
    url: ({queryString}) => `/occurrence/search${queryString ? `?${queryString}` : ''}`,
    route: '/occurrence/search'
  },
  collectionKey: {
    // url: ({key}) => `/collection/${key}`,
    url: ({key}) => `${gbifOrg}/grscicoll/collection/${key}`,
    isHref: true,
    route: '/collection/:key'
  },
  collectionSearch: {
    url: () => `/collection-search/`
  },
  collectionSpecimens: {
    url: ({key}) => `/collection/${key}/specimens`
  },

  institutionKey: {
    // url: ({key}) => `/institution/${key}`,
    url: ({key}) => `${gbifOrg}/grscicoll/institution/${key}`,
    isHref: true,
    route: '/institution/:key'
  },
  institutionSearch: {
    url: () => `/institution-search/`
  },

  datasetKey: {
    // url: ({key}) => `/dataset/${key}`,
    url: ({key}) => `${gbifOrg}/dataset/${key}`,
    isHref: true,
    route: '/dataset/:key'
  },
  datasetSearch: {
    url: () => `/dataset-search/`
  },

  publisherKey: {
    // url: ({key}) => `/publisher/${key}`,
    url: ({key}) => `${gbifOrg}/publisher/${key}`,
    isHref: true,
    route: '/publisher/:key'
  },
  publisherSearch: {
    url: () => `/publisher-search/`
  },
});
