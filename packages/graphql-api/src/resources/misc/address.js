

const { gql } = require('apollo-server');

const typeDef = gql`
type Address {
    key: ID!
    address: String
    city: String
    province: String
    postalCode: String
    country: Country
  }
`;

module.exports = typeDef;
