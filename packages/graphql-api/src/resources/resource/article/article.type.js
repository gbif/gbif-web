import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    article(id: String!): Article
  }

  type Article {
    id: ID!
    gbifHref: String!
    title: String!
    summary: String
    body: String
    excerpt: String
    primaryImage: AssetImage
    secondaryLinks: [Link]
    urlAlias: String
    documents: [DocumentAsset]
    createdAt: DateTime!
    updatedAt: DateTime
    displayDate: Boolean
    articleType: String
    citation: String
    audiences: [String]
    keywords: [String]
    purposes: [String]
    topics: [String]
    meta: JSON
  }
`;

export default typeDef;
