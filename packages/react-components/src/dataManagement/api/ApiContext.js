import React from 'react';
import ApiClient from './ApiClient';
import env from '../../../.env.json';

const client = new ApiClient({
  gql: {
    endpoint: env.GRAPH_API,
  },
  v1: {
    endpoint: env.API_V1
  },
  esApi: {
    endpoint: env.ES_WEB_API
  },
  translations: {
    endpoint: env.TRANSLATIONS
  },
  utils: {
    endpoint: env.UTILS_API
  }
});

// A context to share state for the full app/component
export default React.createContext(client);
