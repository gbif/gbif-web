const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    organizationSearch(
      limit: Int,
      offset: Int,  
      q: String,
      country: Country,
      identifier: String,
      identifierType: IdentifierType,
      isEndorsed: Boolean,
      machineTagNamespace: String,
      machineTagName: String,
      machineTagValue: String,
      ): OrganizationSearchResult
    organization(key: String!): Organization
  }

  type Organization {
    key: ID!
    abbreviation: String
    address: [String]
    city: String
    comments: [Comment]
    contacts: [Contact]
    country: Country
    created: DateTime
    createdBy: String
    deleted: DateTime
    description: String
    email: [String]
    endorsementApproved: Boolean
    endorsingNodeKey: ID
    endpoints: [Endpoint]
    homepage: [URL]
    identifiers: [Identifier]
    language: Language
    latitude: Float
    logoUrl: URL
    longitude: Float
    machineTags: [MachineTag]
    modified: DateTime
    modifiedBy: String
    numPublishedDatasets: Int
    phone: [String]
    postalCode: String
    province: String
    tags: [Tag]
    title: String

    endorsingNode: Node

    hostedDataset(limit: Int, offset: Int): DatasetListResults!
    publishedDataset(limit: Int, offset: Int): DatasetListResults!
    installation(limit: Int, offset: Int): InstallationSearchResults!
  }

  type OrganizationSearchResult {
    results: [Organization]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type OrganizationBreakdown {
    count: Int!
    name: String!
    organization: Organization!
  }
`;

module.exports = typeDef;