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
    institution(key: ID!): Institution
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
    types: [String!]
    active: Boolean
    email: [String]
    phone: [String]
    homepage: URL
    catalogUrls: [String!]
    apiUrls: [String!]
    institutionalGovernances: [String!]
    disciplines: [String!]
    latitude: Float
    longitude: Float
    mailingAddress: Address
    address: Address
    additionalNames: [String]
    foundingDate: Int
    numberSpecimens: Int
    logoUrl: URL
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    deleted: DateTime
    replacedBy: ID
    replacedByInstitution: Institution
    convertedToCollection: ID
    replacedByCollection: Collection
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

    featuredImageUrl: String
    featuredImageLicense: License
    thumbor(width: Int, height: Int, fitIn: Boolean): String
    """
    This can be used as a backup, but since it works by fetching the homepage url and extracting the open graph tags it can be slow. Use with caution.
    """
    homepageOGImageUrl_volatile(onlyIfNoImageUrl: Boolean): String

    occurrenceCount: Int
    masterSource: String
    masterSourceMetadata: MasterSourceMetadata
  }

`;

export default typeDef;
