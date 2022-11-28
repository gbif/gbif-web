import { gql } from 'apollo-server';

const typeDef = gql`
  type Identifier {
    key: ID!
    type: IdentifierType!
    identifier: String!
    createdBy: String!
    created: DateTime!
  }
`;

export default typeDef;
