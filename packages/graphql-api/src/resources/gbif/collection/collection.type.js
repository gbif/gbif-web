import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    collectionSearch(
      limit: Int
      offset: Int
      q: String
      institutionKey: [GUID]
      """
      deprecated field, use institutionKey instead
      """
      institution: [GUID]
      contact: ID
      code: String
      name: String
      fuzzyName: String
      city: String
      country: [Country]
      alternativeCode: String
      identifier: String
      active: Boolean
      personalCollection: Boolean
      numberSpecimens: String
      occurrenceCount: String
      contentType: [String!]
      preservationType: [String!]
      displayOnNHCPortal: Boolean
      sortBy: CollectionsSortField
      sortOrder: SortOrder

      recordedBy: [String!]
      descriptorCountry: [Country!]
      typeStatus: [TypeStatus!]
      taxonKey: [ID!]
      ): CollectionSearchResults
    collection(key: ID!): Collection
    collectionDescriptorGroup(key: ID!, collectionKey: ID!): CollectionDescriptorGroup
  }

  type CollectionSearchResults {
    results: [CollectionSearchEntity]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type CollectionSearchEntity {
    key: ID!
    code: String
    name: String
    description: String
    country: Country
    city: String
    contentTypes: [String!]
    active: Boolean
    personalCollection: Boolean
    preservationTypes: [String!]
    accessionStatus: String
    institutionKey: ID
    institutionName: String
    institutionCode: String
    numberSpecimens: Long
    taxonomicCoverage: String
    geographicCoverage: String
    temporalCoverage: String
    alternativeCodes: [AlternativeCode]
    occurrenceCount: Long
    typeSpecimenCount: Long
    featuredImageUrl: String
    featuredImageLicense: License
    thumbor(width: Int, height: Int, fitIn: Boolean): String
    descriptorMatches: [DescriptorMatches!]
  }

  type DescriptorMatches {
    key: ID
    descriptorSetKey: ID
    usageName: String
    usageKey: Long
    usageRank: Rank
    country: Country
    individualCount: Long
    issues: [OccurrenceIssue!]
    recordedBy: [String!]
    typeStatus: [TypeStatus!]
    identifiedBy: [String!]
  }

  type CollectionDescriptorGroupResults {
    offset: Int
    limit: Int
    endOfRecords: Boolean
    count: Int
    results: [CollectionDescriptorGroup]
  }

  type CollectionDescriptorGroup {
    key: ID!
    title: String
    description: String
    collectionKey: ID!
    created: String!
    createdBy: String!
    modified: String
    modifiedBy: String
    descriptors(limit: Int, offset: Int): CollectionDescriptorResults
  }

  type CollectionDescriptorResults {
    limit: Int
    offset: Int
    count: Int
    endOfRecords: Boolean
    results: [CollectionDescriptor!]
  }

  type CollectionDescriptor {
    key: ID!
    usageKey: Long
    usageName: String
    usageRank: Rank
    individualCount: Int
    verbatim: JSON
    issues: [OccurrenceIssue!]
    taxonClassification: [Classification!]
    recordedBy: [String!]
    typeStatus: [TypeStatus!]
    identifiedBy: [String!]
  }

  type Collection {
    key: ID!
    code: String
    name: String
    description: String
    contentTypes: [String!]
    active: Boolean
    personalCollection: Boolean
    doi: String
    email: [String!]
    phone: [String!]
    homepage: URL
    catalogUrls: [String!]
    apiUrls: [String!]
    preservationTypes: [String!]
    accessionStatus: String
    institutionKey: ID
    institution: Institution
    mailingAddress: Address
    address: Address
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    deleted: DateTime
    replacedBy: ID
    replacedByCollection: Collection
    tags:[Tag]
    identifiers: [Identifier!]
    """
    The contacts type is deprecated and will no longer be updated
    """
    contacts: [StaffMember]
    contactPersons: [ContactPerson!]!
    numberSpecimens: Int
    machineTags: [MachineTag]
    taxonomicCoverage: String
    geographicCoverage: String
    temporalCoverage: String
    notes: String
    incorporatedCollections: [String]
    """
    Deprecated
    """
    importantCollectors: [String]
    """
    Deprecated
    """
    collectionSummary: JSON
    alternativeCodes: [AlternativeCode]
    comments: Comment

    featuredImageUrl: String
    featuredImageLicense: License
    thumbor(width: Int, height: Int, fitIn: Boolean): String
    """
    This can be used as a backup, but since it works by fetching the homepage url and extracting the open graph tags it can be slow. Use with caution.
    """
    homepageOGImageUrl_volatile: String

    occurrenceCount: Int
    excerpt: String
    richness: Float

    descriptorGroups(limit: Int, offset: Int): CollectionDescriptorGroupResults
  }

  type AlternativeCode {
    code: String!
    description: String
  }
`;

export default typeDef;
