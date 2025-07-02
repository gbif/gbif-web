import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    datasetDownloads(
      datasetKey: ID!
      limit: Int
      offset: Int
    ): DatasetDownloadListResults
    datasetsByDownload(
      key: ID!
      limit: Int
      offset: Int
    ): DatasetDownloadListResults
    download(key: ID!): Download
    userDownloads(
      limit: Int
      offset: Int
      username: String!
    ): DownloadListResults! @cacheControl(maxAge: 0, scope: PRIVATE)
  }

  type DatasetDownloadListResults {
    results: [DatasetDownload]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DownloadListResults {
    results: [Download!]!
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
    numberRecords: Long
  }

  type Download {
    created: DateTime!
    doi: String
    downloadLink: String
    eraseAfter: String
    key: ID!
    license: String
    modified: DateTime
    numberDatasets: Int
    numberOrganizations: Int
    numberPublishingCountries: Int
    request: DownloadRequest
    size: Long
    status: Download_Status
    totalRecords: Long
  }

  type DownloadRequest {
    predicate: JSON
    sendNotification: Boolean
    format: String
    sql: String
    sqlFormatted: String
    description: String
    machineDescription: JSON
    gbifMachineDescription: JSON
  }
`;

export default typeDef;
