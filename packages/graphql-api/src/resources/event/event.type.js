const { gql } = require('apollo-server');

const typeDef = gql`
  type Event {
    key: Float
    
    abstract: String
    acceptedNameUsage: String
    acceptedNameUsageID: String
    acceptedScientificName: String
    acceptedTaxonKey: ID
    accessRights: String
    accrualMethod: String
    accrualPeriodicity: String
    accrualPolicy: String
    alternative: String
    associatedMedia: String
    associatedOccurrences: String
    associatedOrganisms: String
    associatedReferences: String
    associatedSequences: String
    associatedTaxa: String
    audience: String
    available: String
    basisOfRecord: String
    bed: String
    behavior: String
    bibliographicCitation: String
    catalogNumber: String
    class: String
    classKey: ID
    collectionCode: String
    collectionID: String
    collectionKey: ID
    conformsTo: String
    continent: String
    contributor: String
    coordinatePrecision: Float
    coordinateUncertaintyInMeters: Float
    country: String
    countryCode: Country
    county: String
    coverage: String
    crawlId: ID
    created: DateTime
    creator: String
    dataGeneralizations: String
    datasetID: [String]
    datasetKey: ID
    datasetName: [String]
    date: DateTime
    dateAccepted: String
    dateCopyrighted: String
    dateIdentified: DateTime
    dateSubmitted: String
    day: Int
    decimalLatitude: Float
    decimalLongitude: Float
    degreeOfEstablishment: String # Is a vocabulary, but only a string in the schema for now
    depth: Float
    depthAccuracy: Float
    description: String
    disposition: String
    # Unclear how these terms are to be indexed or displayed
    # distanceAboveSurface: Float
    # distanceAboveSurfaceAccuracy: String
    dynamicProperties: String
    earliestAgeOrLowestStage: String
    earliestEonOrLowestEonothem: String
    earliestEpochOrLowestSeries: String
    earliestEraOrLowestErathem: String
    earliestPeriodOrLowestSystem: String
    educationLevel: String
    elevation: Float
    elevationAccuracy: Float
    endDayOfYear: Int
    establishmentMeans: String
    eventDate: DateTime
    eventID: String
    eventRemarks: String
    eventTime: String
    extensions: JSON
    extent: String
    facts: [JSON]
    family: String
    familyKey: ID
    fieldNotes: String
    fieldNumber: String
    footprintSRS: String
    footprintSpatialFit: String
    footprintWKT: String
    format: String
    formation: String
    gadm: JSON
    genericName: String
    genus: String
    genusKey: ID
    geodeticDatum: String
    geologicalContextID: String
    georeferenceProtocol: String
    georeferenceRemarks: String
    georeferenceSources: String
    georeferenceVerificationStatus: String
    georeferencedBy: String
    georeferencedDate: String
    group: String
    habitat: String
    hasFormat: String
    hasPart: String
    hasVersion: String
    higherClassification: String
    higherGeography: String
    higherGeographyID: String
    highestBiostratigraphicZone: String
    identificationID: String
    identificationQualifier: String
    identificationReferences: String
    identificationRemarks: String
    identificationVerificationStatus: String
    identifiedBy: [String]
    identifiedByIDs: [AssociatedID]
    identifier: String
    # Unclear what this field contains
    # identifiers: [String]
    individualCount: Int
    informationWithheld: String
    infraspecificEpithet: String
    installationKey: ID
    institutionCode: String
    institutionID: String
    institutionKey: ID
    instructionalMethod: String
    isFormatOf: String
    isPartOf: String
    isReferencedBy: String
    isReplacedBy: String
    isRequiredBy: String
    isVersionOf: String
    island: String
    islandGroup: String
    issued: String
    issues: [OccurrenceIssue]
    kingdom: String
    kingdomKey: ID
    language: String
    lastCrawled: DateTime
    lastParsed: DateTime
    latestAgeOrHighestStage: String
    latestEonOrHighestEonothem: String
    latestEpochOrHighestSeries: String
    latestEraOrHighestErathem: String
    latestPeriodOrHighestSystem: String
    license: License
    lifeStage: String
    lithostratigraphicTerms: String
    locality: String
    locationAccordingTo: String
    locationID: String
    locationRemarks: String
    lowestBiostratigraphicZone: String
    materialSampleID: String
    media: [MultimediaItem]
    mediator: String
    medium: String
    member: String
    modified: DateTime
    month: Int
    municipality: String
    nameAccordingTo: String
    nameAccordingToID: String
    namePublishedIn: String
    namePublishedInID: String
    namePublishedInYear: String
    networkKey: [ID]
    nomenclaturalCode: String
    nomenclaturalStatus: String
    occurrenceID: String
    occurrenceRemarks: String
    occurrenceStatus: OccurrenceStatus
    order: String
    orderKey: ID
    organismID: String
    organismName: String
    organismQuantity: String
    organismQuantityType: String
    organismRemarks: String
    organismScope: String
    originalNameUsage: String
    originalNameUsageID: String
    otherCatalogNumbers: [String]
    ownerInstitutionCode: String
    parentEventID: String
    parentNameUsage: String
    parentNameUsageID: String
    pathway: String # Is a vocabulary, but only a string in the schema for now
    phylum: String
    phylumKey: ID
    pointRadiusSpatialFit: String
    preparations: [String]
    previousIdentifications: String
    protocol: String
    provenance: String
    """as provided on record - this can differ from the GBIF publishing organisation"""
    publisher: String
    # publishingCountry: String
    """The ID of the publisher who published this record to GBIF"""
    publishingOrgKey: ID
    recordNumber: String
    recordedBy: [String]
    recordedByIDs: [AssociatedID]
    references: String
    relation: String
    # relations: [JSON] # unclear what this field encodes if anything
    # relativeOrganismQuantity: Float # internal value that probably shouldn't be in the response ?
    replaces: String
    reproductiveCondition: String
    requires: String
    rights: String
    rightsHolder: String
    sampleSizeUnit: String
    sampleSizeValue: Float
    samplingEffort: String
    samplingProtocol: [String]
    scientificName: String
    scientificNameAuthorship: String
    scientificNameID: String
    sex: String
    source: String
    spatial: String
    species: String
    speciesKey: ID
    specificEpithet: String
    startDayOfYear: Int
    stateProvince: String
    subgenus: String
    subgenusKey: ID
    subject: String
    tableOfContents: String
    taxonConceptID: String
    taxonID: String
    taxonKey: ID
    taxonRank: String
    taxonRemarks: String
    taxonomicStatus: String
    temporal: String
    title: String
    type: String
    typeStatus: [TypeStatus]
    typifiedName: String
    valid: String
    verbatimCoordinateSystem: String
    verbatimCoordinates: String
    verbatimDepth: String
    verbatimElevation: String
    verbatimEventDate: String
    verbatimLatitude: String
    verbatimLocality: String
    verbatimLongitude: String
    verbatimSRS: String
    verbatimScientificName: String
    verbatimTaxonRank: String
    vernacularName: String
    waterBody: String
    year: Int
    verbatimIdentification: String
    verticalDatum: String


    datasetTitle: String
    publisherTitle: String

    isInCluster: Boolean

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
    coordinates: JSON
    formattedCoordinates: String

    dataset: Dataset
    institution: Institution
    collection: Collection
    bionomia: BionomiaOccurrence
  }

  type BionomiaOccurrence {
    recorded: [BionomiaPerson]
    identified: [BionomiaPerson]
  }

  type BionomiaPerson {
    name: String
    reference: String
  }

  type Globe {
    svg: String
    lat: Float
    lon: Float
  }

  type AssociatedID {
    type: String
    value: String
    person(expand: Boolean): Person
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
    description: String
  }
`;

module.exports = typeDef;