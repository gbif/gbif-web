const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    viaf(key: ID!): Viaf
  }

  type Viaf {
    key: ID!
    name: String
  }
`;

module.exports = typeDef;