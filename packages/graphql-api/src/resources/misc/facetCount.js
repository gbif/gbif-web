import { gql } from 'apollo-server';

const typeDef = gql`
  type FacetCount {
    name: String!
    count: Int!
  }
`;

export default typeDef;
