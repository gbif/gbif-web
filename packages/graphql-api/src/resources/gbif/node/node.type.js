import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    nodeSearch(
      limit: Int
      offset: Int
      q: String
      identifier: String
      identifierType: IdentifierType
      machineTagNamespace: String
      machineTagName: String
      machineTagValue: String
    ): NodeSearchResults
    node(key: String!): Node
  }

  type NodeSearchResults {
    results: [Node]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Node {
    key: ID!
    abbreviation: String
    address: [JSON]
    comments: [Comment]
    contacts: [Contact]
    continent: Continent
    country: Country
    created: DateTime
    createdBy: String
    deleted: DateTime
    description: String
    email: [String]
    endpoints: [Endpoint]
    gbifRegion: GbifRegion
    homepage: [URL]
    identifiers: [Identifier]
    machineTags: [MachineTag]
    modified: DateTime
    modifiedBy: String
    participantTitle: String
    participationStatus: String
    phone: [String]
    tags: [Tag]
    title: String
    type: NodeType

    organization: OrganizationSearchResult!
    pendingEndorsement: OrganizationSearchResult!
    dataset: DatasetListResults!
    installation: InstallationSearchResults!

    participant: Participant
  }
`;

export default typeDef;
