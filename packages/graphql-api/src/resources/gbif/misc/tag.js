import gql from 'graphql-tag';

const typeDef = gql`
  type Tag {
    key: ID!
    value: String!
    createdBy: String!
    created: DateTime!
  }
`;

export default typeDef;
