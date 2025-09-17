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
      typeStatus: [String!]
      taxonKey: [ID!]
      query: CollectionSearchInput
    ): CollectionSearchResults
    collection(key: ID!): Collection
    collectionDescriptorGroup(
      key: ID!
      collectionKey: ID!
    ): CollectionDescriptorGroup
  }

  input CollectionSearchInput {
    limit: Int
    offset: Int
    q: String
    institutionKey: [GUID!]
    contact: [ID!]
    code: [String!]
    name: [String!]
    fuzzyName: String
    city: [String!]
    country: [Country!]
    alternativeCode: [String!]
    identifier: [String!]
    active: [Boolean!]
    personalCollection: [Boolean!]
    numberSpecimens: [String!]
    occurrenceCount: [String!]
    contentType: [String!]
    preservationType: [String!]
    displayOnNHCPortal: [Boolean!]
    recordedBy: [String!]
    descriptorCountry: [Country!]
    typeStatus: [String!]
    taxonKey: [ID!]
    sortBy: CollectionsSortField
    sortOrder: SortOrder
  }

  type CollectionSearchResults {
    results: [CollectionSearchEntity]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
    facet: CollectionFacet
    cardinality: CollectionCardinality
    _query: JSON
  }

  type CollectionFacet {
    institutionKey(limit: Int, offset: Int): [CollectionFacetResult]
    country(limit: Int, offset: Int): [CollectionFacetResult]
    city(limit: Int, offset: Int): [CollectionFacetResult]
    kingdomKey(limit: Int, offset: Int): [CollectionFacetResult]
    phylumKey(limit: Int, offset: Int): [CollectionFacetResult]
    classKey(limit: Int, offset: Int): [CollectionFacetResult]
    orderKey(limit: Int, offset: Int): [CollectionFacetResult]
    familyKey(limit: Int, offset: Int): [CollectionFacetResult]
    genusKey(limit: Int, offset: Int): [CollectionFacetResult]
    speciesKey(limit: Int, offset: Int): [CollectionFacetResult]
    recordedBy(limit: Int, offset: Int): [CollectionFacetResult]
    descriptorCountry(limit: Int, offset: Int): [CollectionFacetResult]
    contentType(limit: Int, offset: Int): [CollectionFacetResult]
    preservationType(limit: Int, offset: Int): [CollectionFacetResult]
    accessionStatus(limit: Int, offset: Int): [CollectionFacetResult]
    typeStatus(limit: Int, offset: Int): [CollectionFacetResult]
    biomeType(limit: Int, offset: Int): [CollectionFacetResult]
    objectClassification(limit: Int, offset: Int): [CollectionFacetResult]
  }

  type CollectionCardinality {
    institutionKey(limit: Int, offset: Int): Int!
    country(limit: Int, offset: Int): Int!
    city(limit: Int, offset: Int): Int!
    kingdomKey(limit: Int, offset: Int): Int!
    phylumKey(limit: Int, offset: Int): Int!
    classKey(limit: Int, offset: Int): Int!
    orderKey(limit: Int, offset: Int): Int!
    familyKey(limit: Int, offset: Int): Int!
    genusKey(limit: Int, offset: Int): Int!
    speciesKey(limit: Int, offset: Int): Int!
    recordedBy(limit: Int, offset: Int): Int!
    descriptorCountry(limit: Int, offset: Int): Int!
    contentType(limit: Int, offset: Int): Int!
    preservationType(limit: Int, offset: Int): Int!
    accessionStatus(limit: Int, offset: Int): Int!
    typeStatus(limit: Int, offset: Int): Int!
    biomeType(limit: Int, offset: Int): Int!
    objectClassification(limit: Int, offset: Int): Int!
  }

  type CollectionInstitutionFacet {
    name: String!
    count: Int!
    _query: JSON
    institution: Institution
  }

  type CollectionFacetResult {
    name: String!
    count: Int!
    _query: JSON
  }

  type CollectionSearchEntity {
    key: ID!
    code: String
    name: String
    description: String
    country: Country
    city: String
    contentTypes: [String!]!
    active: Boolean
    personalCollection: Boolean
    preservationTypes: [String!]!
    accessionStatus: String
    institutionKey: ID
    institutionName: String
    institutionCode: String
    numberSpecimens: Long
    taxonomicCoverage: String
    geographicCoverage: String
    temporalCoverage: String
    alternativeCodes: [AlternativeCode!]!
    occurrenceCount: Long
    typeSpecimenCount: Long
    featuredImageUrl: String
    featuredImageLicense: License
    thumbor(width: Int, height: Int, fitIn: Boolean): String
    descriptorMatches: [DescriptorMatches!]!
    excerpt: String
  }

  type DescriptorMatches {
    key: ID
    descriptorSetKey: ID
    usageName: String
    usageKey: Long
    usageRank: Rank
    country: Country
    individualCount: Long
    issues: [OccurrenceIssue!]!
    recordedBy: [String!]!
    typeStatus: [String!]!
    identifiedBy: [String!]!
    taxon: Taxon
    biomeType: String
    objectClassification: String
  }

  type CollectionDescriptorGroupResults {
    offset: Int
    limit: Int
    endOfRecords: Boolean
    count: Int
    results: [CollectionDescriptorGroup]!
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
    typeStatus: [String!]
    identifiedBy: [String!]
  }

  type Collection {
    key: ID!
    code: String
    name: String
    description: String
    contentTypes: [String!]!
    active: Boolean
    personalCollection: Boolean
    doi: String
    email: [String!]!
    phone: [String!]!
    homepage: URL
    catalogUrls: [String!]!
    apiUrls: [String!]!
    preservationTypes: [String!]!
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
    tags: [Tag]!
    identifiers: [Identifier!]!
    """
    The contacts type is deprecated and will no longer be updated
    """
    contacts: [StaffMember]!
    contactPersons: [ContactPerson!]!
    numberSpecimens: Int
    machineTags: [MachineTag]!
    taxonomicCoverage: String
    geographicCoverage: String
    temporalCoverage: String
    notes: String
    incorporatedCollections: [String]!
    """
    Deprecated
    """
    importantCollectors: [String]
    """
    Deprecated
    """
    collectionSummary: JSON
    alternativeCodes: [AlternativeCode!]!
    comments: Comment

    featuredImageUrl: String
    featuredImageLicense: License
    thumbor(width: Int, height: Int, fitIn: Boolean): String
    """
    This can be used as a backup, but since it works by fetching the homepage url and extracting the open graph tags it can be slow. Use with caution.
    """
    homepageOGImageUrl_volatile(
      onlyIfNoImageUrl: Boolean
      timeoutMs: Int
    ): String

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
