const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    datasetSearch(limit: Int, offset: Int, q: String): DatasetSearchResults
    dataset(key: String!): Dataset
  }

  type DatasetSearchResults {
    results: [Dataset]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DatasetListResults {
    results: [Dataset]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Dataset {
    key: ID!
    bibliographicCitations: [BibliographicCitation]
    citation: Citation
    collections: [JSON]
    comments: [JSON]
    contacts: [Contact]
    countryCoverage: [JSON]
    created: DateTime
    createdBy: String
    curatorialUnits: [JSON]
    dataDescriptions: [JSON]
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
    hostingOrganizationKey: ID
    """
    This field is only avaiable in search results, not on individually requested datasets
    """
    hostingOrganizationTitle: String
    identifiers: [Identifier]
    installationKey: String
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
    """
    This field is only avaiable in search results, not on individually requested datasets
    """
    publishingOrganizationTitle: String
    recordCount: Int
    samplingDescription: SamplingDescription
    tags: [Tag]
    taxonomicCoverages: [TaxonomicCoverage]
    temporalCoverages: [JSON]
    title: String
    type: DatasetType
    
    duplicateOfDataset: Dataset
    hostingOrganization: Organization
    installation: Installation
    parentDataset: Dataset
    publishingOrganization: Organization

    constituents(limit: Int, offset: Int): DatasetListResults
    networks: [Network]!
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
  }

  type GeographicCoverage {
    description: String
    boundingBox: BoundingBox
  }

  type BoundingBox {
    minLatitude: Float,
    maxLatitude: Float,
    minLongitude: Float,
    maxLongitude: Float,
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
`;

module.exports = typeDef;