const { gql } = require('apollo-server');

const typeDef = gql`
  scalar URL
  scalar DateTime
  scalar EmailAddress
  scalar JSON
`;

module.exports = typeDef;