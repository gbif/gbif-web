import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    fundingOrganisation(id: String!): FundingOrganisation
  }

  type FundingOrganisation {
    id: ID!
    title: String
    url: String
    updatedAt: DateTime
    logo: AssetImage
    meta: JSON
  }
`;

export default typeDef;