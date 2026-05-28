import { gql } from 'apollo-server';

const typeDef = gql`
  scalar URL
  scalar DateTime
  scalar EmailAddress
  scalar JSON
  scalar GUID
  scalar Long
`;

export default typeDef;
