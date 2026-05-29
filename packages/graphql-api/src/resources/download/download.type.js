import { gql } from 'graphql-tag';

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
    datasetsByEventDownload(
      key: ID!
      limit: Int
      offset: Int
    ): DatasetDownloadListResults
    download(key: ID!): Download
    eventDownload(key: ID!): Download
    userDownloads(
      limit: Int
      offset: Int
      username: String!
    ): DownloadListResults! @cacheControl(maxAge: 0, scope: PRIVATE)
    userEventDownloads(
      limit: Int
      offset: Int
      username: String!
    ): DownloadListResults! @cacheControl(maxAge: 0, scope: PRIVATE)
    occurrenceSnapshots(limit: Int, offset: Int): DownloadListResults!
      @cacheControl(maxAge: 3600, scope: PUBLIC)
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
    willBeDeletedSoon: Boolean
    readyForDeletion: Boolean
  }

  type DownloadRequest {
    predicate: JSON
    sendNotification: Boolean
    format: String
    type: String
    sql: String
    sqlFormatted: String
    description: String
    machineDescription: JSON
    gbifMachineDescription: JSON
    checklistKey: ID
    """
    Distinct list of checklistKeys referenced anywhere in the download
    predicate. Both explicit (a checklistKey set on a predicate node) and
    implicit (a taxon-supporting field used without an explicit
    checklistKey, in which case the GBIF backbone is implied) are returned.
    Returns null when the request has no predicate (e.g. SQL downloads).
    """
    predicateChecklists: [String!]
    verbatimExtensions: [String!]
    notificationAddresses: [String!]
    creator: String
  }
`;

export default typeDef;
