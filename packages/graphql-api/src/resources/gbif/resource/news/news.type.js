import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    news(id: String!): News
  }

  type News {
    id: ID!
    gbifHref: String!
    title: String!
    summary: String
    body: String
    excerpt: String
    primaryImage: AssetImage
    primaryLink: Link
    secondaryLinks: [Link]
    citation: String
    countriesOfCoverage: [String]
    topics: [String]
    purposes: [String]
    audiences: [String]
    keywords: [String]
    searchable: Boolean!
    homepage: Boolean!
    gbifRegion: [GbifRegion]
    createdAt: DateTime!
    updatedAt: DateTime!
    programmeTag: [String]
    projectTag: [String]
    meta: JSON
  }
`;

export default typeDef;