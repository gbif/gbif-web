import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnv } from 'vite';
import { getDefaultEndpointsBasedOnGbifEnv, GbifEnv } from './src/contexts/config/endpoints';

const env = loadEnv('', process.cwd(), ['PUBLIC_']);
const graphqlEndpoint =
  env.PUBLIC_GRAPHQL_ENDPOINT ??
  getDefaultEndpointsBasedOnGbifEnv(env.PUBLIC_GBIF_ENV as GbifEnv).graphqlEndpoint;

const config: CodegenConfig = {
  overwrite: true,
  schema: graphqlEndpoint,
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    'src/gql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        scalars: {
          DateTime: {
            input: 'string',
            output: 'string',
          },
        },
      },
    },
  },
};

export default config;
