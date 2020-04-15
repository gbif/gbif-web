const { gql } = require('apollo-server');

const typeDef = gql`
  type Comment {
    key: ID!
    content: String
    createdBy: String!
    created: DateTime!
    modified: DateTime
    modifiedBy: String
  }
`;

module.exports = typeDef;