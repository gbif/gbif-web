const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    literatureSearch(
      limit: Int, 
      offset: Int, 
      q: String,
      countriesOfResearcher: [Country],
      countriesOfCoverage: [Country],
      literatureType: [String],
      relevance: [String],
      year: [String],
      topics: [String],
      gbifDatasetKey: [ID],
      publishingOrganizationKey: [ID],
      peerReview: Boolean,
      openAccess: Boolean,
      gbifDownloadKey: [String],
      doi: [String],
      source: [String],
      publisher: [String]
      ): LiteratureSearchResults
    literature(key: String!): Literature
  }

  type LiteratureSearchResults {
    results: [Literature]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Literature {
    id: ID
    abstract: String
    added: String
    authors: [Author]
    countriesOfCoverage: [String]
    countriesOfResearcher: [String]
    day: Int
    discovered: String
    gbifDownloadKey: [ID]
    gbifRegion: [GbifRegion]
    identifiers: Identifier
    keywords: [String]
    language: Language
    literatureType: String
    modified: DateTime
    month: Int
    notes: String
    openAccess: Boolean
    peerReview: Boolean
    published: String
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
`;

module.exports = typeDef;