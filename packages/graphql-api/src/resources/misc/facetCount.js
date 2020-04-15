const { gql } = require('apollo-server');

const typeDef = gql`
  type FacetCount {
    name: String!
    count: Int!
  }
`;

module.exports = typeDef;