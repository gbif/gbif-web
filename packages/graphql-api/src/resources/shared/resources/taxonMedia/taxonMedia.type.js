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
    metadataDate: String
    metadataLanguage: String
    metadataLanguageLiteral: String
    providerManagedID: String
    rights: String
    owner: String
    webStatement: String
    credit: String
    creator: String
    providerLiteral: String
    description: String
    tag: String
    createDate: String
    IDofContainingCollection: String
    accessURI: String
    accessOriginalURI: String
    format: String
    hashFunction: String
    hashValue: String
    pixelXDimension: Int
    pixelYDimension: Int
  }
`;

export default typeDef;
