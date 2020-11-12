const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    orcid(key: ID!): OrcID
  }

  type OrcID {
    key: ID!
    name: String
    wikidata: JSON
  }
`;

module.exports = typeDef;