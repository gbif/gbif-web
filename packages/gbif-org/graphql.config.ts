// This is a graphql-config file for the graphql plugins for VSCode
// I use "GraphQL: Syntax Highlighting" and "GraphQL: Language Feature Support"

import { graphqlEndpoint } from './getGraphQLEndpoint';

export default {
  schema: graphqlEndpoint,
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
};
