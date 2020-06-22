const { gql } = require('apollo-server');

const typeDef = gql`
  type Occurrence {
    gbifId: ID!
    
    basisOfRecord: String
    catalogNumber: String
    collectionCode: String
    collectionKey: ID
    continent: String
    coordinatePrecision: Float
    coordinateUncertaintyInMeters: Float
    country: String
    countryCode: String
    crawlId: Int
    created: DateTime
    datasetKey: ID
    datasetPublishingCountry: String
    datasetTitle: String
    dateIdentified: DateTime
    day: Int
    decimalLatitude: Float
    decimalLongitude: Float
    depth: Float
    depthAccuracy: Float
    elevation: Float
    elevationAccuracy: Float
    endDayOfYear: Float
    endorsingNodeKey: ID
    establishmentMeans: String
    eventDateSingle: DateTime
    eventId: String
    gbifClassification: GbifClassification
    hasCoordinate: Boolean
    hasGeospatialIssue: Boolean
    identifiedByIds: IdentifiedByIds
    id: String
    individualCount: Int
    installationKey: ID
    institutionCode: String
    institutionKey: ID
    issues: [OccurrenceIssue]
    lastCrawled: DateTime
    license: String
    lifeStage: String
    locality: String
    maximumDepthInMeters: Float
    maximumDistanceAboveSurfaceInMeters: Float
    maximumElevationInMeters: Float
    measurementOrFactItems: JSON
    mediaLicenses: [String]
    mediaTypes: [MediaType]
    minimumDepthInMeters: Float
    minimumDistanceAboveSurfaceInMeters: Float
    minimumElevationInMeters: Float
    modified: DateTime
    month: Int
    multimediaItems: [MultimediaItem]
    networkKeys: [ID]
    # notIssues: String
    occurrenceId: String
    organismId: String
    organismQuantity: Float
    organismQuantityType: String
    parentEventId: String
    programmeAcronym: String
    projectId: String
    protocol: String
    publisherTitle: String
    publishingCountry: String
    publishingOrganizationKey: ID
    recordNumber: String
    recordedBy: String
    recordedByIds: RecordedByIds
    references: String
    relativeOrganismQuantity: Float
    repatriated: Boolean
    sampleSizeUnit: String
    sampleSizeValue: Float
    samplingProtocol: String
    scoordinates: String
    sex: String
    startDayOfYear: Float
    stateProvince: String
    typeStatus: String
    typifiedName: String
    waterBody: String
    year: Int

    # useful additions
    """
    Currently the primary image is considered the first image retruned from the REST API
    """
    primaryImage: MultimediaItem
  }

  type GbifClassification {
    acceptedUsage: OccurrenceNameUsage
    class: String
    classKey: Int
    classification: Classification
    classificationPath: String
    diagnostics: Diagnostics
    family: String
    familyKey: Int
    genus: String
    genusKey: Int
    kingdom: String
    kingdomKey: Int
    order: String
    orderKey: Int
    phylum: String
    phylumKey: Int
    species: String
    speciesKey: Int
    synonym: Boolean
    taxonID: String
    taxonKey: Int
    usage: OccurrenceNameUsage
    usageParsedName: UsageParsedName
    verbatimScientificName: String
  }

  type Classification {
    key: Int
    name: String
    rank: String
    synonym: Boolean
  }

  type Diagnostics {
    matchType: String
    note: String
    status: String
  }

  type OccurrenceNameUsage {
    key: Int!
    name: String!
    rank: String!
    formattedName: String!
  }

  type UsageParsedName {
    abbreviated: Boolean
    autonym: Boolean
    basionymAuthorship: BasionymAuthorship
    binomial: Boolean
    candidatus: Boolean
    code: String
    combinationAuthorship: CombinationAuthorship
    doubtful: Boolean
    genericName: String
    genus: String
    incomplete: Boolean
    indetermined: Boolean
    infraspecificEpithet: String
    notho: String
    rank: String
    specificEpithet: String
    state: String
    terminalEpithet: String
    trinomial: Boolean
    type: String
    uninomial: String
    unparsed: String
  }

  type BasionymAuthorship {
    authors: String
    empty: Boolean
    exAuthors: String
    year: String
  }

  type CombinationAuthorship {
    authors: String
    empty: Boolean
    exAuthors: String
    year: String
  }

  type IdentifiedByIds {
    type: String
    value: String
  }

  type RecordedByIds {
    type: String
    value: String
  }

  type MultimediaItem {
    type: String
    format: String
    identifier: String
    created: String
    creator: String
    license: String
    publisher: String
    references: String
    rightsHolder: String
  }
`;

module.exports = typeDef;