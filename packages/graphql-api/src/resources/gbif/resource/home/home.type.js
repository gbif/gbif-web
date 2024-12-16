const { gql } = require('apollo-server-core');

const typeDef = gql`
  extend type Query {
    gbifHome: Home
  }

  type Home {
    title: String!
    id: ID!
    children: [MenuItem!]
    aboutBody: String
    blocks: [BlockItem!]
    primaryImage: [AssetImage!]
    occurrenceIcon: AssetImage
    literatureIcon: AssetImage
    datasetIcon: AssetImage
    publisherIcon: AssetImage
    summary: String
  }
`;

export default typeDef;
