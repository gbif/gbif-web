import { gql } from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    userDerivedDatasets(
      limit: Int
      offset: Int
      username: String!
    ): DerivedDatasetListResults! @cacheControl(maxAge: 0, scope: PRIVATE)
    derivedDataset(key: ID!): DerivedDataset
  }

  type DerivedDatasetListResults {
    results: [DerivedDataset!]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DerivedDataset {
    doi: String!
    originalDownloadDOI: String
    description: String
    """
    The description rendered from markdown and sanitized. Only a small set of tags is allowed, headings are demoted and links open in a new tab
    """
    descriptionHtml: String
    excerpt: String
    citation: String
    title: String
    sourceUrl: String
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    contributingDatasets(
      limit: Int
      offset: Int
    ): ContributingDatasetsListResult!
  }

  type ContributingDatasetsListResult {
    results: [ContributingDataset!]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type ContributingDataset {
    datasetKey: String!
    datasetTitle: String
    datasetDOI: String
    derivedDatasetDOI: String
    numberRecords: Int!
    citation: String
  }
`;

export default typeDef;
