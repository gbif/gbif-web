import React from 'react';
const gbifOrg = 'https://www.gbif.org';

// no matter if it is a plain a-tag link or a react-router link, we need to know how to contruct the url
// and we need to know how to construct the route
// and finally we need to know if it is a react-router link or not
export const defaultContext = {
  alwaysUseHrefs: false,
  // enabledRoutes: ['datasetSearch', 'occurrenceSearch', 'institutionKey', 'institutionSearch', 'publisherSearch', 'collectionSearch', 'collectionKey', 'datasetKey'],
  occurrenceSearch: {
    url: ({ route, queryString, basename }) =>
      `${basename ? `/${basename}` : ''}${route}${queryString ? `?${queryString}` : ''}`,
    gbifUrl: ({ route, queryString, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/occurrence/search${queryString ? `?${queryString}` : ''}`,
    route: '/occurrence/search',
    isHref: false,
  },
  collectionKey: {
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/collection/${key}`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/grscicoll/collection/${key}`,
    isHref: false,
    route: '/collection/:key',
  },
  collectionSearch: {
    url: ({ queryString, basename }) => `${basename ? `/${basename}` : ''}/collection/search`,
    gbifUrl: ({ route, queryString, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/grscicoll/collection/search${
        queryString ? `?${queryString}` : ''
      }`,
    isHref: false,
    route: '/collection/search',
  },
  collectionKeySpecimens: {
    parent: 'collectionKey',
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/collection/${key}/specimens`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/grscicoll/collection/${key}`,
    isHref: false,
    route: '/collection/:key/specimens',
  },
  collectionKeyDashboard: {
    parent: 'collectionKey',
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/collection/${key}/dashboard`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/grscicoll/collection/${key}/metrics`,
    isHref: false,
    route: '/collection/:key/dashboard',
  },

  institutionKey: {
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/institution/${key}`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/grscicoll/institution/${key}`,
    isHref: false,
    route: '/institution/:key',
  },
  institutionKeySpecimens: {
    parent: 'institutionKey',
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/institution/${key}/specimens`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/grscicoll/institution/${key}`,
    isHref: false,
    route: '/institution/:key/specimens',
  },
  institutionKeyCollections: {
    parent: 'institutionKey',
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/collections`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/grscicoll/institution/${key}`,
    isHref: false,
    route: '/institution/:key/collections',
  },
  institutionSearch: {
    url: ({ queryString, basename }) => `${basename ? `/${basename}` : ''}/institution/search`,
    gbifUrl: ({ route, queryString, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/grscicoll/institution/search${
        queryString ? `?${queryString}` : ''
      }`,
    isHref: false,
    route: '/institution/search',
  },

  datasetKey: {
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/dataset/${key}`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) => `${gbifOrg}${gbifOrgLocalePrefix}/dataset/${key}`,
    isHref: false,
    route: '/dataset/:key',
  },
  datasetKeyCitations: {
    parent: 'datasetKey',
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/dataset/${key}/citations`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) => `${gbifOrg}${gbifOrgLocalePrefix}/dataset/${key}`,
    isHref: false,
    route: '/dataset/:key/citations',
  },
  datasetKeyDownload: {
    parent: 'datasetKey',
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/dataset/${key}/download`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) => `${gbifOrg}${gbifOrgLocalePrefix}/dataset/${key}`,
    isHref: false,
    route: '/dataset/:key/download',
  },
  datasetKeyProject: {
    parent: 'datasetKey',
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/dataset/${key}/project`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) => `${gbifOrg}${gbifOrgLocalePrefix}/dataset/${key}`,
    isHref: false,
    route: '/dataset/:key/project',
  },
  datasetSearch: {
    url: ({ queryString, basename }) =>
      `${basename ? `/${basename}` : ''}/dataset/search?${queryString}`,
    gbifUrl: ({ route, queryString, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/dataset/search${queryString ? `?${queryString}` : ''}`,
    isHref: false,
    route: '/dataset/search',
  },

  publisherKey: {
    url: ({ key, basename }) => `${basename ? `/${basename}` : ''}/publisher/${key}`,
    gbifUrl: ({ key, gbifOrgLocalePrefix }) => `${gbifOrg}${gbifOrgLocalePrefix}/publisher/${key}`,
    isHref: false,
    route: '/publisher/:key',
  },
  publisherSearch: {
    url: ({ queryString, basename }) => `${basename ? `/${basename}` : ''}/publisher/search`,
    gbifUrl: ({ route, queryString, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/publisher/search${queryString ? `?${queryString}` : ''}`,
    isHref: false,
    route: '/publisher/search',
  },

  literatureSearch: {
    url: ({ queryString, basename }) => `${basename ? `/${basename}` : ''}/literature/search`,
    gbifUrl: ({ route, queryString, gbifOrgLocalePrefix }) =>
      `${gbifOrg}${gbifOrgLocalePrefix}/resource/search?contentType=literature&${
        queryString ? `${queryString}` : ''
      }`,
    isHref: false,
    route: '/literature/search',
  },

  eventKey: {
    // url: ({key}) => `/publisher/${key}`,
    // url: ({key, otherIds}) => `${gbifOrg}/dataset/${otherIds.datasetKey}/event/${key}`,
    url: ({ key, otherIds }) =>
      `https://collections.ala.org.au/public/showDataResource/${otherIds.datasetKey}?event=${key}`,
    isHref: true,
    route: '/event/:key',
  },
  eventSearch: {
    url: ({ queryString, basename }) => `${basename ? `/${basename}` : ''}/event/search`,
    isHref: true,
    route: '/publisher/search',
  },
  taxonKey: {
    url: ({ key }) => `${gbifOrg}/species/${key}`,
    isHref: true,
    route: '/taxon/:key',
  },
};

export default React.createContext(defaultContext);
