import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    representativeImage(taxon: String): RepresentativeImage
  }

  type RepresentativeImage {
    square_url: String
    attribution: String
    medium_url: String
    id: Int
    license_code: String
    original_dimensions: RepresentativeImageDimensions
  }

  type RepresentativeImageDimensions {
    width: Int
    height: Int
  }
`;

export default typeDef;
