const { gql } = require("apollo-server-core");

const typeDef = gql`
  # extend type Query {
  #   menuItem(id: String!, preview: Boolean): MenuItem
  # }

  type MenuItem {
    externalLink: Boolean
    link: String
    id: String
    title: String
    children: [MenuItem]
  }
`;

export default typeDef;