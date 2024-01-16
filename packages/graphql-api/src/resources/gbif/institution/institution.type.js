import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    institutionSearch(
      limit: Int
      offset: Int
      q: String
      contact: ID
      code: String
      name: String
      fuzzyName: String
      city: String
      country: [Country]
      alternativeCode: String
      active: Boolean
      numberSpecimens: String
      occurrenceCount: String
      identifier: String
      type: String
      institutionKey: [GUID]
      discipline: [String]
      displayOnNHCPortal: Boolean
      sortBy: CollectionsSortField
      sortOrder: SortOrder
      ): InstitutionSearchResults
    institution(key: String!): Institution
  }

  type InstitutionSearchResults {
    results: [Institution]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Institution {
    key: ID!
    code: String
    name: String
    description: String
    type: InstitutionType
    active: Boolean
    email: [String]
    phone: [String]
    homepage: URL
    catalogUrl: URL
    apiUrl: URL
    institutionalGovernance: InstitutionGovernance
    disciplines: [Discipline]
    latitude: Float
    longitude: Float
    mailingAddress: Address
    address: Address
    additionalNames: [String]
    foundingDate: Int
    geographicDescription: String
    taxonomicDescription: String
    numberSpecimens: Int
    indexHerbariorumRecord: Boolean
    logoUrl: URL
    citesPermitNumber: String
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    deleted: DateTime
    replacedBy: ID
    replacedByInstitution: Institution
    tags: [Tag]
    identifiers: [Identifier]
    """
    The contacts type is deprecated and will no longer be updated
    """
    contacts: [StaffMember]
    contactPersons: [ContactPerson]!
    machineTags: [MachineTag]
    alternativeCodes: [AlternativeCode]
    comments: [Comment]
    collections(limit: Int, offset: Int): [Collection]
    """
    collection count will count up to a 1000. After that results will be capped to 1000. This is unlikely to be an issue, but you should worry if you see 1000 results exactly.
    """
    collectionCount: Int

    occurrenceCount: Int
    masterSource: String
    masterSourceMetadata: MasterSourceMetadata
  }

`;

export default typeDef;
