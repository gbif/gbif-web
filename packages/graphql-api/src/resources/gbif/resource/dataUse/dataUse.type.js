import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    dataUse(id: String!): DataUse
  }

  type DataUse {
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
    resourceUsed: String
    countriesOfResearcher: [String]
    countriesOfCoverage: [String]
    topics: [String]
    purposes: [String]
    audiences: [String]
    keywords: [String]
    gbifRegion: [GbifRegion]
    searchable: Boolean
    homepage: Boolean
    createdAt: DateTime
    updatedAt: DateTime
    meta: JSON
  }
`;

export default typeDef;