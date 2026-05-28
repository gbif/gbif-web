import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    organizationSearch(
      limit: Int
      offset: Int
      q: String
      country: Country
      networkKey: ID
      identifier: String
      identifierType: IdentifierType
      isEndorsed: Boolean
      machineTagNamespace: String
      machineTagName: String
      machineTagValue: String
      numPublishedDatasets: String
    ): OrganizationSearchResult
    organization(key: ID!): Organization
  }

  type Organization {
    key: ID!
    abbreviation: String
    address: [String]
    city: String
    comments: [Comment]
    contacts: [Contact!]
    country: Country
    created: DateTime
    createdBy: String
    deleted: DateTime
    description: String
    email: [String]
    endorsementApproved: Boolean
    endorsingNodeKey: ID
    endpoints: [Endpoint]
    homepage: [String]
    identifiers: [Identifier]
    language: Language
    latitude: Float
    logoUrl: String
    thumborLogoUrl(width: Int, height: Int, fitIn: Boolean): String
    longitude: Float
    machineTags(namespace: String, name: String, value: String): [MachineTag!]
    modified: DateTime
    modifiedBy: String
    numPublishedDatasets: Int
    phone: [String]
    postalCode: String
    province: String
    tags: [Tag]
    title: String
    excerpt: String

    endorsingNode: Node

    hostedDataset(limit: Int, offset: Int): DatasetListResults
    publishedDataset(limit: Int, offset: Int): DatasetListResults
    installation(limit: Int, offset: Int): InstallationSearchResults
    occurrenceCount: Int
    literatureCount: Int
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

export default typeDef;
