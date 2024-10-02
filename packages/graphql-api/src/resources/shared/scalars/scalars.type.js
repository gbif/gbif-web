import gql from 'graphql-tag';

const typeDef = gql`
  scalar URL
  scalar DateTime
  scalar EmailAddress
  scalar JSON
  scalar GUID
  scalar Long
`;

export default typeDef;
