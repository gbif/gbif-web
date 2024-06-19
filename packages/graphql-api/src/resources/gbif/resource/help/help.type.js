import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    help(identifier: String!, locale: String): Help
  }

  type Help {
    id: ID!
    identifier: String
    title: String!
    body: String
    excerpt: String
    createdAt: DateTime!
    updatedAt: DateTime
  }
`;

export default typeDef;