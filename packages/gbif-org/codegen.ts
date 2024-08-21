import type { CodegenConfig } from '@graphql-codegen/cli';
import { graphqlEndpoint } from './getGraphQLEndpoint';

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
