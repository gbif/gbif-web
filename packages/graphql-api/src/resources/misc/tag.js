const { gql } = require('apollo-server');

const typeDef = gql`
  type Tag {
    key: ID!
    value: String!
    createdBy: String!
    created: DateTime!
  }
`;

module.exports = typeDef;