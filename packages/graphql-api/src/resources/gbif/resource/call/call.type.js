import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    call(id: String!, preview: Boolean): Call
  }

  type Call {
    id: ID
    createdAt: DateTime
    updatedAt: DateTime
    acronym: String
    title: String
    body: String
    excerpt: String
    meta: JSON
  }
`;

export default typeDef;