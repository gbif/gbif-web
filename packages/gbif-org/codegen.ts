import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnv } from 'vite';
import { getEndpointsBasedOnGbifEnv, GbifEnv } from './src/contexts/config/endpoints';

const env = loadEnv('', process.cwd(), ['PUBLIC_']);
const endpoints = getEndpointsBasedOnGbifEnv(env.PUBLIC_GBIF_ENV as GbifEnv, env);

const config: CodegenConfig = {
  overwrite: true,
  schema: endpoints.graphqlEndpoint,
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
