import { gql } from 'apollo-server';

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

export default typeDef;
