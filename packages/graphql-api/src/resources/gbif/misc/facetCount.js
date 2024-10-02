import gql from 'graphql-tag';

const typeDef = gql`
  type FacetCount {
    name: String!
    count: Int!
  }
`;

export default typeDef;
