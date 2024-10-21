import { merge } from 'ts-deepmerge';
import { loadEnv } from 'vite';
import { getDefaultEndpointsBasedOnGbifEnv, GbifEnv } from './src/config/endpoints';

const envFile = loadEnv('', process.cwd(), ['PUBLIC_']);
export const graphqlEndpoint =
  envFile.PUBLIC_GRAPHQL_ENDPOINT ??
  getDefaultEndpointsBasedOnGbifEnv((envFile.PUBLIC_GBIF_ENV ?? 'prod') as GbifEnv).graphqlEndpoint;

export function getEnv() {
  if (typeof window === 'undefined') {
    return merge(envFile, process.env);
  }

  return envFile;
}
