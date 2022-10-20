import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    imagesSearch(
      search: String
      filters: [String]
      size: Int
      from: Int
    ): ImagesSearchResult!

    imageMeta(identifier: String): ImageMeta
  }

  type ImagesSearchResult {
    _endpoint: String
    q: String
    fq: [String]
    totalImageCount: Int!
    images: [Image]
    facet: ImagesFacet
  }

  type Image {
    rightsHolder: String
    thumbHeight: Int
    extension: String
    imageIdentifier: String
    dateUploaded: String
    description: String
    title: String
    contentSHA1Hash: String
    rights: String
    contentMD5Hash: String
    imageSize: String
    height: Int
    harvestable: Boolean
    creator: String
    dateUploadedYearMonth: String
    format: String
    thumbWidth: Int
    occurrenceID: String
    zoomLevels: Int
    recognisedLicence: String
    license: String
    dataResourceUid: String
    fileSize: Int
    width: Int
    originalFilename: String
    dateTaken: String
    fileType: String
  }

  type ImageMeta {
    success: Boolean
    imageIdentifier: String
    mimeType: String
    originalFileName: String
    sizeInBytes: Int
    rights: String
    rightsHolder: String
    dateUploaded: String
    dateTaken: String
    imageUrl: String
    tileUrlPattern: String
    mmPerPixel: String
    height: Int
    width: Int
    tileZoomLevels: Int
    description: String
    title: String
    type: String
    audience: String
    references: String
    publisher: String
    contributor: String
    created: String
    source: String
    creator: String
    license: String
    dataResourceUid: String
    occurrenceID: String
    recognisedLicence: RecognisedLicence
  }

  type RecognisedLicence {
    acronym: String
    name: String
    url: String
    imageUrl: String
  }

  type ImagesFacet {
    _q: String
    _fq: [String]
    dataResourceUid(full: Boolean): [ImagesFacetResult_string]
    dateUploadedYearMonth(full: Boolean): [ImagesFacetResult_string]
    format(full: Boolean): [ImagesFacetResult_string]
    imageSize(full: Boolean): [ImagesFacetResult_string]
    fileType(full: Boolean): [ImagesFacetResult_string]
    recognisedLicence(full: Boolean): [ImagesFacetResult_string]
  }

  type ImagesFacetResult_string {
    key: String!
    count: Int!
  }
`;
