import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    gbifDocument(id: String!, preview: Boolean): Document
  }

  type Document {
    id: ID!
    title: String!
    gbifHref: String
    createdAt: DateTime
    document: DocumentAsset
    updatedAt: DateTime
    summary: String
    primaryLink: Link
    body: String
    excerpt: String
    citation: String
    keywords: [String]
    meta: JSON
  }
`;

export default typeDef;