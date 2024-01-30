// This is a graphql-config file for the graphql plugins for VSCode
// I use "GraphQL: Syntax Highlighting" and "GraphQL: Language Feature Support"

import { loadEnv } from 'vite';
import { getEndpointsBasedOnGbifEnv, GbifEnv } from './src/contexts/config/endpoints';

// eslint-disable-next-line no-undef
const env = loadEnv('', process.cwd(), ['PUBLIC_']);
const endpoints = getEndpointsBasedOnGbifEnv(env.PUBLIC_GBIF_ENV as GbifEnv, env);

export default {
  schema: endpoints.graphqlEndpoint,
  documents: ['src/**/*.tsx'],
};
