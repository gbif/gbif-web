import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    occurrenceClusterSearch(
      apiKey: String,
      predicate: Predicate
      size: Int
      from: Int
      ): OccurrenceClusterSearchResult
  }

  type OccurrenceClusterSearchResult {
    nodes: [OccurrenceClusterNode]
    links: [OccurrenceClusterLink]
  }

  type OccurrenceClusterNode {
    key: ID!
    datasetTitle: String!
    datasetKey: ID!
    publisherTitle: String!
    publisherKey: ID!
    catalogueNumber: String
    basisOfRecord: BasisOfRecord
    isEntryNode: Boolean
  }

  type OccurrenceClusterLink {
    source: ID!
    target: ID!
  }
`;

module.exports = typeDef;
