const { gql } = require("apollo-server-core");

const typeDef = gql`
  extend type Query {
    gbifHome: Home
  }

  type Home {
    title: String!
    id: ID!
    children: [MenuItem]
    aboutBody: String
    # blocks: Blocks
    primaryImage: [AssetImage]
    summary: String
  }
`;

export default typeDef;