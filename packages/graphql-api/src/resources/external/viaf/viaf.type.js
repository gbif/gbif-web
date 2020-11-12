const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    viaf(key: ID!): Viaf
  }

  type Viaf {
    key: ID!
    name: String
    birthDate: String
    deathDate: String
    wikidata: JSON
  }
`;

module.exports = typeDef;