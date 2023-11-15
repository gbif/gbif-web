import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), ['PUBLIC_']);

const config: CodegenConfig = {
  overwrite: true,
  schema: env.PUBLIC_GRAPHQL_ENDPOINT,
  documents: 'src/**/*.tsx',
  generates: {
    'src/gql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
