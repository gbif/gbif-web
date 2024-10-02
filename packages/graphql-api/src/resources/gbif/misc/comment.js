import gql from 'graphql-tag';

const typeDef = gql`
  type Comment {
    key: ID!
    content: String
    createdBy: String!
    created: DateTime!
    modified: DateTime
    modifiedBy: String
  }
`;

export default typeDef;
