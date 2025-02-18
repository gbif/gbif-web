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
    size: Int
    status: Download_Status
    totalRecords: Int
  }

  type DownloadRequest {
    predicate: JSON
    sendNotification: Boolean
    format: String
    sql: String
    description: String
    machineDescription: JSON
    gbifMachineDescription: JSON
  }
`;

export default typeDef;
