// This is a graphql-config file for the graphql plugins for VSCode
// I use "GraphQL: Syntax Highlighting" and "GraphQL: Language Feature Support"

import { loadEnv } from 'vite';
import { getEndpointsBasedOnGbifEnv, GbifEnv } from './src/contexts/config/endpoints';

const env = loadEnv('', process.cwd(), ['PUBLIC_']);
const gbifEnv = (env.PUBLIC_GBIF_ENV ?? GbifEnv.Dev) as GbifEnv;
const endpoints = getEndpointsBasedOnGbifEnv(gbifEnv, env);

export default {
  schema: endpoints.graphqlEndpoint,
  documents: ['src/**/*.tsx'],
};
