import type { CodegenConfig } from '@graphql-codegen/cli';
import { graphqlEndpoint } from './env';

const config: CodegenConfig = {
  overwrite: true,
  schema: graphqlEndpoint,
  documents: ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.mjs'],
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
