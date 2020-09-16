const { gql } = require('apollo-server');

const typeDef = gql`
  type MachineTag {
    key: ID!
    namespace: String!
    name: String!
    value: String!
    createdBy: String!
    created: DateTime!
  }
`;

module.exports = typeDef;