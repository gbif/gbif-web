import React from 'react';
const gbifOrg = 'https://www.gbif.org';

// no matter if it is a plain a-tag link or a react-router link, we need to know how to contruct the url
// and we need to know how to construct the route
// and finally we need to know if it is a react-router link or not
export const defaultContext = {
  occurrenceSearch: {
    url: ({route, queryString, basename}) => `${basename ? `/${basename}` : ''}${route}${queryString ? `?${queryString}` : ''}`,
    gbifUrl: ({route, queryString}) => `${gbifOrg}/occurrence/search${queryString ? `?${queryString}` : ''}`,
    route: '/occurrence/search',
    isHref: false,
  },
  collectionKey: {
    url: ({key}) => `/collection/${key}`,
    gbifUrl: ({key}) => `${gbifOrg}/grscicoll/collection/${key}`,
    isHref: false,
    route: '/collection/:key'
  },
  collectionSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/collection/search`,
    gbifUrl: ({route, queryString}) => `${gbifOrg}/grscicoll/collection/search${queryString ? `?${queryString}` : ''}`,
    isHref: false,
    route: '/collection/search'
  },
  collectionKeySpecimens: {
    url: ({key}) => `/collection/${key}/specimens`,
    isHref: false,
    route: '/collection/:key/specimens'
  },
  collectionKeyDashboard: {
    url: ({key}) => `/collection/${key}/specimens`,
    gbifUrl: ({key}) => `${gbifOrg}/grscicoll/collection/${key}/metrics`,
    isHref: false,
    route: '/collection/:key/dashboard'
  },

  institutionKey: {
    url: ({key}) => `/institution/${key}`,
    gbifUrl: ({key}) => `${gbifOrg}/grscicoll/institution/${key}`,
    isHref: false,
    route: '/institution/:key'
  },
  institutionKeySpecimens: {
    url: ({key}) => `${gbifOrg}/grscicoll/institution/${key}`,
    isHref: false,
    route: '/institution/:key/specimens'
  },
  institutionKeyCollections: {
    url: ({key}) => `/collections`,
    isHref: false,
    route: '/institution/:key/collections'
  },
  institutionSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/institution/search`,
    gbifUrl: ({route, queryString}) => `${gbifOrg}/grscicoll/institution/search${queryString ? `?${queryString}` : ''}`,
    isHref: false,
    route: '/institution/search'
  },

  datasetKey: {
    url: ({key}) => `/dataset/${key}`,
    gbifUrl: ({key, gbifOrgLocalePrefix}) => `${gbifOrg}${gbifOrgLocalePrefix}/dataset/${key}`,
    isHref: false,
    route: '/dataset/:key'
  },
  // datasetKey: {
  //   isHref: true,
  //   url: ({ key }) => `/dataset/${key}`,
  //   route: '/dataset/:key'
  // },
  // datasetCitations: {
  //   route: '/dataset/:key/citations',
  //   url: ({ key }) => `/dataset/${key}/citations`
  // },
  // datasetDownload: {
  //   route: '/dataset/:key/download',
  //   url: ({ key }) => `/dataset/${key}/download`
  // },
  datasetSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/dataset/search`,
    gbifUrl: ({route, queryString}) => `${gbifOrg}/dataset/search${queryString ? `?${queryString}` : ''}`,
    isHref: false,
    route: '/dataset/search'
  },

  publisherKey: {
    // url: ({key}) => `/publisher/${key}`,
    url: ({key}) => `${gbifOrg}/publisher/${key}`,
    gbifUrl: ({key}) => `${gbifOrg}/publisher/${key}`,
    isHref: true,
    route: '/publisher/:key'
  },
  publisherSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/publisher/search`,
    gbifUrl: ({route, queryString}) => `${gbifOrg}/publisher/search${queryString ? `?${queryString}` : ''}`,
    isHref: false,
    route: '/publisher/search'
  },

  literatureSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/literature/search`,
    gbifUrl: ({route, queryString}) => `${gbifOrg}/resource/search?contentType=literature&${queryString ? `${queryString}` : ''}`,
    isHref: false,
    route: '/literature/search'
  },

  eventKey: {
    // url: ({key}) => `/publisher/${key}`,
    // url: ({key, otherIds}) => `${gbifOrg}/dataset/${otherIds.datasetKey}/event/${key}`,
    url: ({key, otherIds}) => `https://collections.ala.org.au/public/showDataResource/${otherIds.datasetKey}?event=${key}`,
    isHref: true,
    route: '/event/:key'
  },
  eventSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/event/search`,
    isHref: true,
    route: '/publisher/search'
  },
  taxonKey: {
    // url: ({ key }) => `https://gbif.org/species/${key}`,
    url: ({ key }) => `https://bie.ala.org.au/species/${key}`,
    isHref: true,
    route: '/taxon/:key'
  }
};

export default React.createContext(defaultContext);
