import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    taxonMedia(key: String, size: Int, from: Int): [Image!]!
  }

  type Image {
    identifier: String!
    type: String!
    subtypeLiteral: String
    title: String
    MetadataDate: String
    metadataLanguage: String
    metadataLanguageLiteral: String
    providerManagedID: String
    rights: String
    Owner: String
    WebStatement: String
    Credit: String
    creator: String
    providerLiteral: String
    description: String
    tag: String
    CreateDate: String
    IDofContainingCollection: String
    accessURI: String
    accessOriginalURI: String
    format: String
    hashFunction: String
    hashValue: String
    PixelXDimension: Int
    PixelYDimension: Int
  }
`;

export default typeDef;
