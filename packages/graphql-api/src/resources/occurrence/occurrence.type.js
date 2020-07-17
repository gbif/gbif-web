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
    coordinates: JSON

    # extracted from verbatim
    abstract: String 
    accessRights: String 
    accrualMethod: String 
    accrualPeriodicity: String 
    accrualPolicy: String 
    alternative: String 
    audience: String 
    available: String 
    bibliographicCitation: String 
    conformsTo: String 
    contributor: String 
    coverage: String 
    creator: String 
    date: String 
    dateAccepted: String 
    dateCopyrighted: String 
    dateSubmitted: String 
    description: String 
    educationLevel: String 
    extent: String 
    format: String 
    hasFormat: String 
    hasPart: String 
    hasVersion: String 
    identifier: String 
    instructionalMethod: String 
    isFormatOf: String 
    isPartOf: String 
    isReferencedBy: String 
    isReplacedBy: String 
    isRequiredBy: String 
    isVersionOf: String 
    issued: String 
    language: String 
    mediator: String 
    medium: String 
    provenance: String 
    publisher: String 
    relation: String 
    replaces: String 
    requires: String 
    rights: String 
    rightsHolder: String 
    source: String 
    spatial: String 
    subject: String 
    tableOfContents: String 
    temporal: String 
    title: String 
    type: String 
    valid: String 
    institutionID: String 
    collectionID: String 
    datasetID: String 
    datasetName: String 
    ownerInstitutionCode: String 
    informationWithheld: String 
    dataGeneralizations: String 
    dynamicProperties: String 
    occurrenceID: String 
    reproductiveCondition: String 
    behavior: String 
    occurrenceStatus: String 
    preparations: String 
    disposition: String 
    associatedReferences: String 
    associatedSequences: String 
    associatedTaxa: String 
    otherCatalogNumbers: String 
    occurrenceRemarks: String 
    organismID: String 
    organismName: String 
    organismScope: String 
    associatedOccurrences: String 
    associatedOrganisms: String 
    previousIdentifications: String 
    organismRemarks: String 
    materialSampleID: String 
    eventID: String 
    parentEventID: String 
    fieldNumber: String 
    eventDate: String 
    eventTime: String 
    verbatimEventDate: String 
    habitat: String 
    samplingEffort: String 
    fieldNotes: String 
    eventRemarks: String 
    locationID: String 
    higherGeographyID: String 
    higherGeography: String 
    islandGroup: String 
    island: String 
    county: String 
    municipality: String 
    verbatimLocality: String 
    verbatimElevation: String 
    verbatimDepth: String 
    locationAccordingTo: String 
    locationRemarks: String 
    pointRadiusSpatialFit: String 
    verbatimCoordinateSystem: String 
    verbatimSRS: String 
    footprintWKT: String 
    footprintSRS: String 
    footprintSpatialFit: String 
    georeferencedBy: String 
    georeferencedDate: String 
    georeferenceProtocol: String 
    georeferenceSources: String 
    georeferenceVerificationStatus: String 
    georeferenceRemarks: String 
    geologicalContextID: String 
    earliestEonOrLowestEonothem: String 
    latestEonOrHighestEonothem: String 
    earliestEraOrLowestErathem: String 
    latestEraOrHighestErathem: String 
    earliestPeriodOrLowestSystem: String 
    latestPeriodOrHighestSystem: String 
    earliestEpochOrLowestSeries: String 
    latestEpochOrHighestSeries: String 
    earliestAgeOrLowestStage: String 
    latestAgeOrHighestStage: String 
    lowestBiostratigraphicZone: String 
    highestBiostratigraphicZone: String 
    lithostratigraphicTerms: String 
    group: String 
    formation: String 
    member: String 
    bed: String 
    identificationID: String 
    identificationQualifier: String 
    identifiedBy: String 
    identificationReferences: String 
    identificationVerificationStatus: String 
    identificationRemarks: String 
    taxonID: String 
    scientificNameID: String 
    acceptedNameUsageID: String 
    parentNameUsageID: String 
    originalNameUsageID: String 
    nameAccordingToID: String 
    namePublishedInID: String 
    taxonConceptID: String 
    scientificName: String 
    acceptedNameUsage: String 
    parentNameUsage: String 
    originalNameUsage: String 
    nameAccordingTo: String 
    namePublishedIn: String 
    namePublishedInYear: String 
    higherClassification: String 
    kingdom: String 
    phylum: String 
    class: String 
    order: String 
    family: String 
    genus: String 
    subgenus: String 
    specificEpithet: String 
    infraspecificEpithet: String 
    taxonRank: String 
    verbatimTaxonRank: String 
    vernacularName: String 
    nomenclaturalCode: String 
    taxonomicStatus: String 
    nomenclaturalStatus: String 
    taxonRemarks: String 
    associatedMedia: String 
    geodeticDatum: String 
    verbatimCoordinates: String 
    verbatimLatitude: String 
    verbatimLongitude: String 
    scientificNameAuthorship: String

    # useful additions
    """
    Currently the primary image is considered the first image retruned from the REST API
    """
    primaryImage: MultimediaItem
    stillImageCount: Int
    stillImages: [MultimediaItem]
    movingImageCount: Int
    movingImages: [MultimediaItem]
    soundCount: Int
    sounds: [MultimediaItem]
    formattedCoordinates: String
    volatile: VolatileOccurrenceData
    related: [RelatedOccurrence]
  }

  type RelatedOccurrence {
    reasons: [String]!
    occurrence: Occurrence
  }

  type VolatileOccurrenceData {
    globe(sphere: Boolean, graticule: Boolean, land: Boolean): Globe
    """
    Duck typing various features that is worth highlighting
    """
    features: OccurrenceFeatures
  }

  type OccurrenceFeatures {
    """
    Basis of record is either preserved specimen, living specimen, fossil specimen or material sample.
    """
    isSpecimen: Boolean
    """
    We know for sure that this is related to a treatment (based on the publisher)
    """
    isTreament: Boolean
    """
    Looks like it is sequenced based on extensions and fields
    """
    isSequenced: Boolean
    """
    This occurrence has related records
    """
    isClustered: Boolean
    """
    The occurrence has fields that are intended for use by sampling events
    """
    isSamplingEvent: Boolean
  }

  type Globe {
    svg: String
    lat: Float
    lon: Float
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