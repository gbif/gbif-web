import { gql } from 'apollo-server';

const typeDef = gql`
  type Occurrence {
    key: Float

    abstract: String
    acceptedNameUsage: String
    acceptedNameUsageID: String
    acceptedScientificName: String
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
    eventDate: String
    eventID: String
    eventRemarks: String
    eventTime: String
    extensions: OccurrenceExtensions
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
    higherGeography: [String]
    higherGeographyID: String
    highestBiostratigraphicZone: String
    hostingOrganizationKey: ID
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
    issues(types: [String!]): [OccurrenceIssue!]
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
    iucnRedListCategory: String
    """
    as provided on record - this can differ from the GBIF publishing organisation
    """
    publisher: String
    # publishingCountry: String
    """
    The ID of the publisher who published this record to GBIF
    """
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
    """
    Deprecated - to get interpretations use the classifications and select a checklistKey
    """
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
    typeStatus: [String]
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

    """
    Volatile: this is currently an exact mapping of the record in Elastic Search - the format is likely to change over time
    """
    gbifClassification: GbifClassification
    classifications: [ChecklistClassification!]!
    classification(checklistKey: ID): ChecklistClassification

    datasetTitle: String
    publisherTitle: String

    isInCluster: Boolean

    # useful additions
    """
    Currently the primary image is considered the first image retruned from the REST API
    """
    primaryImage: MultimediaItem
    stillImageCount: Int
    stillImages: [MultimediaItem!]
    movingImageCount: Int
    movingImages: [MultimediaItem!]
    soundCount: Int
    sounds: [MultimediaItem!]
    coordinates: JSON
    formattedCoordinates: String
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    """
    volatile: VolatileOccurrenceData
    """
    Volatile: this is an experimental feature likely to change
    """
    related(size: Int, from: Int): RelatedOccurrences
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    """
    groups: TermGroups
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    """
    terms: [Term]
    dataset: Dataset
    institution: Institution
    collection: Collection
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    """
    bionomia: BionomiaOccurrence
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    """
    localContext: LocalContext
    originalUsageMatch: SpeciesMatchResult
  }

  type BionomiaOccurrence {
    recorded: [BionomiaPerson]
    identified: [BionomiaPerson]
  }

  type BionomiaPerson {
    name: String
    reference: String
  }

  type RelatedOccurrences {
    count: Int
    size: Int
    from: Int
    currentOccurrence: RelatedCurrentOccurrence!
    relatedOccurrences: [RelatedOccurrence]
  }

  type RelatedOccurrence {
    reasons: [String]!
    occurrence: Occurrence
    """
    The occurrence as provided by the cluster API. It only has relev
    """
    stub: RelatedOccurrenceStub
  }

  type RelatedCurrentOccurrence {
    occurrence: Occurrence
    """
    The occurrence as provided by the cluster API. It only has relev
    """
    stub: RelatedOccurrenceStub
  }

  type RelatedOccurrenceStub {
    gbifId: ID
    scientificName: String
    publishingOrgKey: ID
    publishingOrgName: String
    datasetKey: ID
    datasetName: [String]
    occurrenceID: String
    catalogNumber: String
  }

  type Term {
    value: JSON
    verbatim: JSON
    remarks: String
    issues: [JSON!]
    htmlValue: JSON
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
    """
    Feedback options for the occurrence
    """
    feedback: OccurrenceFeedback
    """
    Lists all vernacular names for a name usage. The language paramter isn't supported in the official API, so paging will not work properly when using the language parameter
    """
    vernacularNames(
      limit: Int
      offset: Int
      language: String
      checklistKey: ID
      removeDuplicates: Boolean
    ): TaxonVernacularNameResult
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
    """
    The occurrence has an IIIF endpoint
    """
    firstIIIF: String
  }

  type OccurrenceFeedback {
    gbifGithub: String!
    publisherFeedbackSystem: OccurrenceFeedbackValue
    datasetContactEmail: OccurrenceFeedbackValue
  }

  type OccurrenceFeedbackValue {
    value: String!
    title: String!
  }

  type Globe {
    svg: String!
    lat: Float!
    lon: Float!
  }

  type ChecklistClassification {
    iucnRedListCategoryCode: String
    checklistKey: ID!
    classification: [Classification!]
    issues: [String!]
    acceptedUsage: AcceptedUsage!
    usage: Usage!
    taxonMatch: SpeciesMatchResult
    meta: ChecklistMeta
    vernacularNames(lang: String, maxLimit: Int): [ClbVernacularName]
    """
    Volatile: these values are tightly coupled to the webview and are likely to change frequently
    A simple boolean to tell the UI if there are any issues with the taxon that are worth highlighting
    """
    hasTaxonIssues: Boolean
  }

  type ChecklistMeta {
    mainIndex: ChecklistMetaMainIndex!
  }

  type ChecklistMetaMainIndex {
    clbDatasetKey: ID!
    datasetTitle: String!
  }

  type Classification {
    key: String
    rank: String
    name: String
  }

  type AcceptedUsage {
    key: String
    name: String
    rank: String
    authorship: String
  }

  type Usage {
    key: String
    name: String
    rank: String
    authorship: String
    specificEpithet: String
    infraspecificEpithet: String
    genericName: String
  }

  """
  Deprecated. Use the checklistClassification field instead
  """
  type GbifClassification {
    acceptedUsage: OccurrenceNameUsage
    class: String
    classKey: Int
    classification: [Classification]
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

  type OccurrenceNameUsage {
    key: Int!
    name: String!
    rank: String!
    formattedName(useFallback: Boolean): String!
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
    title: String
    type: String
    format: String
    identifier: String
    thumbor(width: Int, height: Int, fitIn: Boolean): String
    created: String
    creator: String
    license: String
    publisher: String
    references: String
    rightsHolder: String
    description: String
  }

  type OccurrenceExtensions {
    audubon: [JSON]
    amplification: [JSON]
    description: [JSON]
    distribution: [JSON]
    eolMedia: [JSON]
    eolReference: [JSON]
    germplasmAccession: [JSON]
    germplasmMeasurementScore: [JSON]
    germplasmMeasurementTrait: [JSON]
    germplasmMeasurementTrial: [JSON]
    identification: [JSON]
    identifier: [JSON]
    image: [JSON]
    measurementOrFact: [JSON]
    multimedia: [JSON]
    reference: [JSON]
    resourceRelationship: [JSON]
    speciesProfile: [JSON]
    typesAndSpecimen: [JSON]
    vernacularName: [JSON]
    cloning: [JSON]
    gelImage: [JSON]
    loan: [JSON]
    materialSample: [JSON]
    permit: [JSON]
    preparation: [JSON]
    preservation: [JSON]
    extendedMeasurementOrFact: [JSON]
    chronometricAge: [JSON]
    chronometricDate: [JSON]
    dnaDerivedData: [JSON]
  }

  type MapCapabilities {
    minLat: Int!
    maxLat: Int!
    minLng: Int!
    maxLng: Int!
    minYear: Int
    maxYear: Int
    total: Long!
    generated: DateTime!
  }
`;

export default typeDef;
