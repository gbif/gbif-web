import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    datasetDownloads(
      datasetKey: ID!
      limit: Int
      offset: Int
    ): DatasetDownloadListResults
    download(key: String!): Download
  }

  type DatasetDownloadListResults {
    results: [DatasetDownload]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DatasetDownload {
    downloadKey: ID!
    datasetCitation: String
    datasetDOI: String
    datasetKey: ID
    datasetTitle: String
    download: Download
    numberRecords: Int
  }

  type Download {
    created: DateTime
    doi: String
    downloadLink: String
    eraseAfter: String
    key: ID!
    license: String
    modified: DateTime
    numberDatasets: Int
    request: DownloadRequest
    size: Int
    status: String
    totalRecords: Int
  }

  type DownloadRequest {
    predicate: JSON
    sendNotification: Boolean
    format: String
  }
`;

export default typeDef;
