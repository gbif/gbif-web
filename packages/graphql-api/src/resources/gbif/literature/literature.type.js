import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    literatureSearch(
      size: Int
      from: Int
      predicate: Predicate
      q: String
      countriesOfResearcher: [Country]
      countriesOfCoverage: [Country]
      literatureType: [String]
      relevance: [String]
      year: [String]
      topics: [String]
      gbifDatasetKey: [ID]
      gbifTaxonKey: [ID]
      publishingOrganizationKey: [ID]
      gbifNetworkKey: [ID]
      gbifOccurrenceKey: [ID]
      peerReview: Boolean
      openAccess: Boolean
      gbifDownloadKey: [ID]
      doi: [String]
      source: [String]
      publisher: [String]
    ): LiteratureSearchResult
    literature(key: ID!): Literature
  }

  type LiteratureSearchResult {
    """
    The literature that match the filter
    """
    documents(size: Int, from: Int): LiteratureDocuments!
    """
    Get number of literature items per distinct values in a field. E.g. how many citations per year.
    """
    facet: LiteratureFacet
    """
    Get statistics for a numeric field. Minimimum value, maximum etc.
    """
    stats: LiteratureStats
    """
    Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set
    """
    cardinality: LiteratureCardinality
    """
    Get histogram for a numeric field with the option to specify an interval size
    """
    histogram: LiteratureHistogram
    autoDateHistogram: LiteratureAutoDateHistogram
    _predicate: JSON
    _meta: JSON
  }

  type LiteratureDocuments {
    results: [Literature]!
    size: Int!
    from: Int!
    total: Long!
  }

  type LiteratureFacet {
    gbifProgrammeAcronym(size: Int, from: Int): [GenericFacetResult_string]
    publisher(size: Int, from: Int): [GenericFacetResult_string]
    year(size: Int, from: Int): [GenericFacetResult_float]
    topics(size: Int, from: Int): [GenericFacetResult_string]
    peerReview(size: Int, from: Int): [GenericFacetResult_boolean]
    openAccess(size: Int, from: Int): [GenericFacetResult_boolean]
    source(size: Int, from: Int): [GenericFacetResult_string]
    literatureType(size: Int, from: Int): [GenericFacetResult_string]
    relevance(size: Int, from: Int): [GenericFacetResult_string]
    countriesOfCoverage(size: Int, from: Int): [GenericFacetResult_string]
    countriesOfResearcher(size: Int, from: Int): [GenericFacetResult_string]
    publishingOrganizationKey(size: Int, from: Int): [OrganizationFacet]
    gbifDatasetKey(size: Int, from: Int): [DatasetFacet]
    gbifNetworkKey(size: Int, from: Int): [NetworkFacet]
  }

  type LiteratureStats {
    year: Stats!
  }

  type LiteratureHistogram {
    year(interval: Float): JSON
  }

  type LiteratureAutoDateHistogram {
    createdAt(
      buckets: Float
      minimum_interval: String
    ): AutoDateHistogramResult!
  }

  type LiteratureCardinality {
    publisher: Int!
    year: Int!
    topics: Int!
    peerReview: Int!
    openAccess: Int!
    source: Int!
    literatureType: Int!
    relevance: Int!
    countriesOfCoverage: Int!
    countriesOfResearcher: Int!
  }

  type GenericFacetResult_string {
    key: String!
    count: Int!
    _predicate: JSON
  }

  type GenericFacetResult_boolean {
    key: Boolean!
    count: Int!
    _predicate: JSON
  }

  type OrganizationFacet {
    key: String!
    count: Int!
    _predicate: JSON
    organization: Organization
  }

  type DatasetFacet {
    key: String!
    count: Int!
    _predicate: JSON
    dataset: Dataset
  }

  type NetworkFacet {
    key: String!
    count: Int!
    _predicate: JSON
    network: Network
  }

  type GenericFacetResult_float {
    key: Float!
    count: Int!
    _predicate: JSON
  }

  type Literature {
    id: ID!
    abstract: String
    excerpt: String
    authors: [Author]
    countriesOfCoverage: [String]
    countriesOfResearcher: [String]
    day: Int
    gbifDownloadKey: [ID]
    gbifRegion: [GbifRegion]
    identifiers: LiteratureIdentifiers
    keywords: [String]
    language: Language
    literatureType: String
    month: Int
    notes: String
    openAccess: Boolean
    peerReview: Boolean
    publisher: String
    relevance: [String]
    source: String
    tags: [String]
    title: String!
    topics: [String]
    websites: [String]
    year: Int
  }

  type Author {
    firstName: String
    lastName: String
  }

  type LiteratureIdentifiers {
    doi: String
    arxiv: String
    isbn: String
    issn: String
    pmid: String
  }
`;

export default typeDef;
