import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    tool(id: String!): Tool
  }

  type Tool {
    id: ID!
    gbifHref: String!
    title: String!
    summary: String
    body: String
    excerpt: String
    primaryImage: AssetImage
    primaryLink: Link
    createdAt: DateTime
    updatedAt: DateTime
    keywords: [String]
    author: String
    rights: String
    publicationDate: DateTime
    rightsHolder: String
    citation: String
    machineIdentifier: String
    secondaryLinks: [Link]
  }
`;

export default typeDef;