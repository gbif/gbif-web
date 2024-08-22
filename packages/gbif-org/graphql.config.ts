// This is a graphql-config file for the graphql plugins for VSCode
// I use "GraphQL: Syntax Highlighting" and "GraphQL: Language Feature Support"

import { graphqlEndpoint } from './env';

export default {
  schema: graphqlEndpoint,
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
};
