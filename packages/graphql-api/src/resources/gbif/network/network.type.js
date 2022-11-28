import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    networkSearch(
      limit: Int
      offset: Int
      q: String
      identifier: String
      identifierType: IdentifierType
      machineTagNamespace: String
      machineTagName: String
      machineTagValue: String
    ): NetworkSearchResults
    network(key: String!): Network
  }

  type NetworkSearchResults {
    results: [Network]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Network {
    key: ID!
    address: [String]
    comments: [Comment]
    contacts: [Contact]
    created: DateTime
    createdBy: String
    deleted: DateTime
    description: String
    email: [String]
    endpoints: [Endpoint]
    homepage: [URL]
    identifiers: [Identifier]
    language: Language
    logoUrl: URL
    machineTags: [MachineTag]
    modified: DateTime
    modifiedBy: String
    numConstituents: Int
    phone: [String]
    tags: [Tag]
    title: String

    constituents(limit: Int, offset: Int): DatasetListResults
  }
`;

export default typeDef;
