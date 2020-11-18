const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    collectionSearch(
      limit: Int, 
      offset: Int, 
      q: String,
      institution: [GUID],
      contact: ID,
      code: String,
      name: String,
      alternativeCode: String
      
      ): CollectionSearchResults
    collection(key: String!): Collection
  }

  type CollectionSearchResults {
    results: [Collection]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Collection {
    key: ID!
    code: String
    name: String
    description: String
    contentTypes: [CollectionContentType]
    active: Boolean
    personalCollection: Boolean
    doi: String
    email: [EmailAddress]
    phone: [String]
    homepage: URL
    catalogUrl: URL
    apiUrl: URL
    preservationTypes: [PreservationType]
    accessionStatus: AccessionStatus
    institutionKey: String
    institution: Institution
    mailingAddress: Address
    address: Address
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    deleted: DateTime
    tags:[Tag]
    identifiers: [Identifier]
    contacts: [StaffMember]
    indexHerbariorumRecord: Boolean
    numberSpecimens: Int
    machineTags: [MachineTag]
    taxonomicCoverage: String
    geography: String
    notes: String
    incorporatedCollections: [String]
    importantCollectors: [String]
    collectionSummary: JSON
    alternativeCodes: [AlternativeCode]
    comments: Comment
  }

  type AlternativeCode {
    code: String!
    description: String
  }
`;

module.exports = typeDef;