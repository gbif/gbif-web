const { gql } = require('apollo-server');

const typeDef = gql`
  type Occurrence {
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
    datasetID: String
    datasetKey: ID
    datasetName: String
    date: DateTime
    dateAccepted: String
    dateCopyrighted: String
    dateIdentified: DateTime
    dateSubmitted: String
    day: Int
    decimalLatitude: Float
    decimalLongitude: Float
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
    # extensions: String
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
    gbifClassification: GbifClassification
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
    identifiedBy: String
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
    media: [String]
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
    otherCatalogNumbers: String
    ownerInstitutionCode: String
    parentEventID: String
    parentNameUsage: String
    parentNameUsageID: String
    phylum: String
    phylumKey: ID
    pointRadiusSpatialFit: String
    preparations: String
    previousIdentifications: String
    protocol: String
    provenance: String
    """as provided on record - this can differ from the GBIF publishing organisation"""
    publisher: String
    # publishingCountry: String
    """The ID of the publisher who published this record to GBIF"""
    publishingOrgKey: ID
    recordNumber: String
    recordedBy: String
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
    samplingProtocol: String
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
    typeStatus: TypeStatus
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

    datasetTitle: String
    publisherTitle: String

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
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    """
    volatile: VolatileOccurrenceData
    """
    Volatile: this is an experimental feature likely to change
    """
    related: [RelatedOccurrence]
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    """
    groups: TermGroups
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    """
    terms: [Term]
  }

  type RelatedOccurrence {
    reasons: [String]!
    occurrence: Occurrence
  }

  type Term {
    value: JSON
    verbatim: JSON
    remarks: String
    issues: [JSON]
    htmlValue: String
    group: String
    simpleName: String
    qualifiedName: String
  }

  type TermGroups {
    occurrence: JSON!
    record: JSON!
    organism: JSON!
    materialSample: JSON!
    event: JSON!
    location: JSON!
    geologicalContext: JSON!
    identification: JSON!
    taxon: JSON!
    other: JSON!
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
    classification: [Classification]
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
  }
`;

module.exports = typeDef;