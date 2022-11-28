import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    datasetSearch(
      limit: Int
      offset: Int
      q: String
      """
      Not implemented yet
      """
      country: [Country]
      type: [DatasetType]
      """
      Not implemented yet
      """
      subtype: [DatasetSubtype]
      license: [License]
      keyword: [String]
      publishingOrg: [ID]
      endorsingNodeKey: [ID]
      hostingOrg: [ID]
      networkKey: [ID]
      decade: [Int]
      publishingCountry: [Country]
      """
      Not implemented yet
      """
      continent: [Continent]
      hl: Boolean
    ): DatasetSearchResults
    dataset(key: ID!): Dataset
  }

  type DatasetSearchResults {
    results: [DatasetSearchStub]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
    facet: DatasetFacet
    _query: JSON
  }

  type DatasetListResults {
    results: [Dataset]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DatasetSearchStub {
    key: ID!
    decades: [Int]
    description: String
    doi: String
    hostingOrganizationKey: ID
    hostingOrganizationTitle: String
    keywords: [String!]
    license: String
    logoUrl: URL
    publishingCountry: Country
    publishingOrganizationKey: ID!
    publishingOrganizationTitle: String
    recordCount: Int
    title: String
    type: DatasetType
    subtype: DatasetSubtype

    dataset: Dataset
    publishingOrganization: Organization
    hostingOrganization: Organization
    occurrenceCount: Int
    literatureCount: Int
  }

  type Dataset {
    key: ID!
    additionalInfo: String
    bibliographicCitations: [BibliographicCitation]
    citation: Citation
    contactsCitation: [ContactsCitation]
    collections: [JSON]
    comments: [JSON]
    contacts: [Contact]
    volatileContributors: [Contact]
    countryCoverage: [JSON]
    created: DateTime
    createdBy: String
    curatorialUnits: [JSON]
    dataDescriptions: [DataDescription]
    dataLanguage: String
    decades: [Int]
    deleted: DateTime
    description: String
    doi: String
    duplicateOfDatasetKey: ID
    endpoints: [Endpoint]
    external: Boolean
    geographicCoverages: [GeographicCoverage]
    homepage: URL
    identifiers: [Identifier]
    installationKey: ID
    keywordCollections: [KeywordCollection]
    keywords: [String!]
    language: Language
    license: String
    lockedForAutoUpdate: Boolean
    logoUrl: URL
    machineTags: [MachineTag]
    maintenanceDescription: String
    maintenanceUpdateFrequency: MaintenanceUpdateFrequency
    modified: DateTime
    modifiedBy: String
    numConstituents: Int
    parentDatasetKey: ID
    project: Project
    projectIdentifier: ID
    pubDate: DateTime
    publishingCountry: Country
    publishingOrganizationKey: ID!
    publishingOrganizationTitle: String
    purpose: String
    samplingDescription: SamplingDescription
    tags: [Tag]
    taxonomicCoverages: [TaxonomicCoverage]
    temporalCoverages: [JSON]
    title: String
    type: DatasetType
    subtype: DatasetSubtype

    duplicateOfDataset: Dataset
    installation: Installation
    parentDataset: Dataset
    publishingOrganization: Organization

    constituents(limit: Int, offset: Int): DatasetListResults
    networks: [Network]!
    metrics: DatasetChecklistMetrics
    gridded: [GridMetric]

    """
    Link to homepage with crawling logs.
    """
    logInterfaceUrl: String
  }

  type DatasetChecklistMetrics {
    key: ID!
    colCoveragePct: Int
    colMatchingCount: Int
    countByConstituent: JSON
    countByIssue: JSON
    countByKingdom: JSON
    countByOrigin: JSON
    countByRank: JSON
    countExtRecordsByExtension: JSON
    countNamesByLanguage: JSON
    created: DateTime
    datasetKey: ID
    distinctNamesCount: Int
    downloaded: String
    nubCoveragePct: Int
    nubMatchingCount: Int
    otherCount: JSON
    synonymsCount: Int
    usagesCount: Int
  }

  type GridMetric {
    key: ID
    totalCount: Float
    minDist: Float
    minDistCount: Float
    percent: Float
    maxPercent: Float
  }

  type DatasetBreakdown {
    count: Int
    name: String
    dataset: Dataset
  }

  type TaxonomicCoverage {
    description: String
    coverages: [TaxonCoverage]
  }

  type TaxonCoverage {
    scientificName: String
    commonName: String
    rank: TaxonCoverageRank
  }

  type TaxonCoverageRank {
    verbatim: String
    interpreted: String
  }

  type BibliographicCitation {
    identifier: String
    text: String
  }

  type Citation {
    text: String!
    citationProvidedBySource: Boolean
  }

  type ContactsCitation {
    key: Int
    abbreviatedName: String
    firstName: String
    lastName: String
    roles: [String]
    userId: [URL]
  }

  type GeographicCoverage {
    description: String
    boundingBox: BoundingBox
  }

  type BoundingBox {
    minLatitude: Float
    maxLatitude: Float
    minLongitude: Float
    maxLongitude: Float
    globalCoverage: Boolean
  }

  type KeywordCollection {
    thesaurus: String
    keywords: [String]
  }

  type SamplingDescription {
    studyExtent: String
    sampling: String
    qualityControl: String
    methodSteps: [String]
  }

  type Project {
    title: String
    identifier: ID
    contacts: [Contact]
    abstract: String
    funding: String
    studyAreaDescription: String
    designDescription: String
  }

  type DataDescription {
    charset: String
    name: String
    format: String
    formatVersion: String
    url: String
  }

  type DatasetFacet {
    type(limit: Int, offset: Int): [DatasetFacetResult]
    keyword(limit: Int, offset: Int): [DatasetFacetResult]
    publishingOrg(limit: Int, offset: Int): [DatasetOrganizationFacet]
    hostingOrg(limit: Int, offset: Int): [DatasetOrganizationFacet]
    decade(limit: Int, offset: Int): [DatasetFacetResult]
    publishingCountry(limit: Int, offset: Int): [DatasetFacetResult]
    projectId(limit: Int, offset: Int): [DatasetFacetResult]
    license(limit: Int, offset: Int): [DatasetFacetResult]
  }

  type DatasetOrganizationFacet {
    name: String!
    count: Int!
    _query: JSON
    organization: Organization
  }

  type DatasetFacetResult {
    name: String!
    count: Int!
    _query: JSON
  }
`;

export default typeDef;
