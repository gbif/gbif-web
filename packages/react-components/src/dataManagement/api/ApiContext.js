import React from 'react';
import ApiClient from './ApiClient';
import env from './.env.json';

const client = new ApiClient({
  gql: {
    endpoint: env.GRAPH_API,
    // headers: {
    //   authorization: `ApiKey-v1 ${env.GRAPHQL_APIKEY}`
    // }
  },
  v1: {
    endpoint: env.API_V1
  }
});

// A context to share state for the full app/component
export default React.createContext(client);
