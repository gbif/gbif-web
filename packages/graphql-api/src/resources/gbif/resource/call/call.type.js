import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    call(id: String!): Call
  }

  type Call {
    id: ID!
    title: String!
    createdAt: DateTime!
    updatedAt: DateTime
    acronym: String
    body: String
    excerpt: String
    meta: JSON
  }
`;

export default typeDef;