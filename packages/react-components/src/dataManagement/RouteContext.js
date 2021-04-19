import { linkTo } from '@storybook/addon-links'
import React from 'react';
export default React.createContext({
  collectionKey: {
    url: ({key}) => `/collection/${key}`
    // url: ({key}) => {
    //   return `/iframe.html?id=entities-collection-page--example&viewMode=story`;
    // }
  },
  collectionSearch: {
    url: () => `/collection/`
  },
  collectionSpecimens: {
    url: ({key}) => `/collection/${key}/specimens`
  },

  institutionKey: {
    url: ({key}) => `/institution/${key}`
  },
  collectionSearch: {
    url: () => `/institution/`
  },
});