import { loadEnv } from 'vite';
import { getDefaultEndpointsBasedOnGbifEnv, GbifEnv } from './src/contexts/config/endpoints';

const env = loadEnv('', process.cwd(), ['PUBLIC_']);
export const graphqlEndpoint =
  env.PUBLIC_GRAPHQL_ENDPOINT ??
  getDefaultEndpointsBasedOnGbifEnv(env.PUBLIC_GBIF_ENV as GbifEnv).graphqlEndpoint;
