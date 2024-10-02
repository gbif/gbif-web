import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    gadm(id: ID!): Gadm
  }

  type Gadm {
    id: ID!
    name: String
    gadmLevel: Int
    higherRegions: [GadmHigherRegions]
    englishType: [String]
    type: [String]
    variantName: [String]
  }
  type GadmHigherRegions {
    id: String 
    name: String
  }
`;

export default typeDef;
