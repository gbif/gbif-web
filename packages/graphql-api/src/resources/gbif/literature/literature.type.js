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
      publishingOrganizationKey: [ID]
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
    _predicate: JSON
    _meta: JSON
  }

  type LiteratureDocuments {
    results: [Literature]!
    size: Int!
    from: Int!
    total: Long!
  }

  type Literature {
    id: ID
    abstract: String
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
    title: String
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
