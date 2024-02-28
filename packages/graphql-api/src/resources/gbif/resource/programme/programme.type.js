import { gql } from "apollo-server";

const typeDef = gql`
  extend type Query {
    programme(id: String!, preview: Boolean): Programme
  }

  type Programme {
    id: ID!
    title: String!
    summary: String
    body: String
    excerpt: String
    primaryImage: AssetImage
    primaryLink: Link
    secondaryLinks: [Link!]
    acronym: String!
    documents: [DocumentAsset!]
    fundingOrganisations: [FundingOrganisation!]
    news: [News!]
    events: [Event!]
    keywords: [String!]
    searchable: Boolean!
    homepage: Boolean!
    meta: JSON
    blocks: [BlockItem!]
  }
`

export default typeDef;