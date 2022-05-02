import React from 'react';
const gbifOrg = 'https://www.gbif.org';

export const defaultContext = {
  occurrenceSearch: {
    url: ({route, queryString, basename}) => `${basename ? `/${basename}` : ''}${route}${queryString ? `?${queryString}` : ''}`,
    route: '/occurrence/search',
    isHref: true,
  },
  collectionKey: {
    // url: ({key}) => `/collection/${key}`,
    url: ({key}) => `${gbifOrg}/grscicoll/collection/${key}`,
    isHref: true,
    route: '/collection/:key'
  },
  collectionSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/collection/search`,
    isHref: true,
    route: '/collection/search'
  },
  collectionSpecimens: {
    url: ({key}) => `/collection/${key}/specimens`,
    isHref: true,
  },

  institutionKey: {
    // url: ({key}) => `/institution/${key}`,
    url: ({key}) => `${gbifOrg}/grscicoll/institution/${key}`,
    isHref: true,
    route: '/institution/:key'
  },
  institutionSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/institution/search`,
    isHref: true,
    route: '/institution/search'
  },

  datasetKey: {
    // url: ({key}) => `/dataset/${key}`,
    url: ({key, gbifOrgLocalePrefix}) => `${gbifOrg}${gbifOrgLocalePrefix}/dataset/${key}`,
    isHref: true,
    route: '/dataset/:key'
  },
  datasetSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/dataset/search`,
    isHref: true,
    route: '/dataset/search'
  },

  publisherKey: {
    // url: ({key}) => `/publisher/${key}`,
    url: ({key}) => `${gbifOrg}/publisher/${key}`,
    isHref: true,
    route: '/publisher/:key'
  },
  publisherSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/publisher/search`,
    isHref: true,
    route: '/publisher/search'
  },

  literatureSearch: {
    url: ({queryString, basename}) => `${basename ? `/${basename}` : ''}/literature/search`,
    isHref: true,
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
  }
};

export default React.createContext(defaultContext);
