const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    occurrenceSearch(
      size: Int,
      from: Int,
      predicate: Predicate
      ): OccurrenceSearchResult
    occurrence(key: String!): Occurrence
  }

  type OccurrenceSearchResult {
    documents: OccurrenceDocuments!
    facet: OccurrenceFacet
    stats: OccurrenceStats
    _query: JSON
  }

  type OccurrenceDocuments {
    size: Int!
    from: Int!
    total: Int!
    results: [Occurrence]!
  }

  type OccurrenceStats {
    year: Stats!
  }

  type OccurrenceFacet {
    # datasetTitle(size: Int): [OccurrenceFacetResult_string]
    # publisherTitle(size: Int): [OccurrenceFacetResult_string]

    basisOfRecord(size: Int): [OccurrenceFacetResult_string]
    catalogNumber(size: Int): [OccurrenceFacetResult_string]
    collectionCode(size: Int): [OccurrenceFacetResult_string]
    continent(size: Int): [OccurrenceFacetResult_string]
    countryCode(size: Int): [OccurrenceFacetResult_string]
    datasetPublishingCountry(size: Int): [OccurrenceFacetResult_string]
    establishmentMeans(size: Int): [OccurrenceFacetResult_string]
    eventId(size: Int): [OccurrenceFacetResult_string]
    id(size: Int): [OccurrenceFacetResult_string]
    institutionCode(size: Int): [OccurrenceFacetResult_string]
    issues(size: Int): [OccurrenceFacetResult_string]
    license(size: Int): [OccurrenceFacetResult_string]
    lifeStage(size: Int): [OccurrenceFacetResult_string]
    locality(size: Int): [OccurrenceFacetResult_string]
    mediaLicenses(size: Int): [OccurrenceFacetResult_string]
    mediaTypes(size: Int): [OccurrenceFacetResult_string]
    notIssues(size: Int): [OccurrenceFacetResult_string]
    occurrenceId(size: Int): [OccurrenceFacetResult_string]
    organismId(size: Int): [OccurrenceFacetResult_string]
    organismQuantityType(size: Int): [OccurrenceFacetResult_string]
    parentEventId(size: Int): [OccurrenceFacetResult_string]
    programmeAcronym(size: Int): [OccurrenceFacetResult_string]
    projectId(size: Int): [OccurrenceFacetResult_string]
    protocol(size: Int): [OccurrenceFacetResult_string]
    publishingCountry(size: Int): [OccurrenceFacetResult_string]
    recordNumber(size: Int): [OccurrenceFacetResult_string]
    recordedBy(size: Int): [OccurrenceFacetResult_string]
    sampleSizeUnit(size: Int): [OccurrenceFacetResult_string]
    samplingProtocol(size: Int): [OccurrenceFacetResult_string]
    sex(size: Int): [OccurrenceFacetResult_string]
    stateProvince(size: Int): [OccurrenceFacetResult_string]
    typeStatus(size: Int): [OccurrenceFacetResult_string]
    typifiedName(size: Int): [OccurrenceFacetResult_string]
    waterBody(size: Int): [OccurrenceFacetResult_string]
    agentIds_type(size: Int): [OccurrenceFacetResult_string]
    agentIds_value(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_classificationPath(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_verbatimScientificName(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_acceptedUsage_rank(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_classification_rank(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_diagnostics_matchType(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_diagnostics_status(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_usage_name(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_usage_rank(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_notho(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_rank(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_state(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_type(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_basionymAuthorship_year(size: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_combinationAuthorship_year(size: Int): [OccurrenceFacetResult_string]

    coordinatePrecision(size: Int): [OccurrenceFacetResult_float]
    coordinateUncertaintyInMeters(size: Int): [OccurrenceFacetResult_float]
    crawlId(size: Int): [OccurrenceFacetResult_float]
    day(size: Int): [OccurrenceFacetResult_float]
    decimalLatitude(size: Int): [OccurrenceFacetResult_float]
    decimalLongitude(size: Int): [OccurrenceFacetResult_float]
    depth(size: Int): [OccurrenceFacetResult_float]
    depthAccuracy(size: Int): [OccurrenceFacetResult_float]
    elevation(size: Int): [OccurrenceFacetResult_float]
    elevationAccuracy(size: Int): [OccurrenceFacetResult_float]
    endDayOfYear(size: Int): [OccurrenceFacetResult_float]
    gbifId(size: Int): [OccurrenceFacetResult_float]
    individualCount(size: Int): [OccurrenceFacetResult_float]
    maximumDepthInMeters(size: Int): [OccurrenceFacetResult_float]
    maximumDistanceAboveSurfaceInMeters(size: Int): [OccurrenceFacetResult_float]
    maximumElevationInMeters(size: Int): [OccurrenceFacetResult_float]
    minimumDepthInMeters(size: Int): [OccurrenceFacetResult_float]
    minimumDistanceAboveSurfaceInMeters(size: Int): [OccurrenceFacetResult_float]
    minimumElevationInMeters(size: Int): [OccurrenceFacetResult_float]
    month(size: Int): [OccurrenceFacetResult_float]
    organismQuantity(size: Int): [OccurrenceFacetResult_float]
    relativeOrganismQuantity(size: Int): [OccurrenceFacetResult_float]
    sampleSizeValue(size: Int): [OccurrenceFacetResult_float]
    startDayOfYear(size: Int): [OccurrenceFacetResult_float]
    year(size: Int): [OccurrenceFacetResult_float]

    hasCoordinate(size: Int): [OccurrenceFacetResult_boolean]
    hasGeospatialIssue(size: Int): [OccurrenceFacetResult_boolean]
    repatriated(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_synonym(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_classification_synonym(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_abbreviated(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_autonym(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_binomial(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_candidatus(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_doubtful(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_incomplete(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_indetermined(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_trinomial(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_basionymAuthorship_empty(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_combinationAuthorship_empty(size: Int): [OccurrenceFacetResult_boolean]

    datasetKey(size: Int): [OccurrenceFacetResult_dataset]
    endorsingNodeKey(size: Int): [OccurrenceFacetResult_node]
    installationKey(size: Int): [OccurrenceFacetResult_installation]
    networkKeys(size: Int): [OccurrenceFacetResult_network]
    publishingOrganizationKey(size: Int): [OccurrenceFacetResult_organization]

    gbifClassification_taxonID(size: Int): [OccurrenceFacetResult_string]
    collectionKey(size: Int): [OccurrenceFacetResult_string]
    institutionKey(size: Int): [OccurrenceFacetResult_string]
    
    taxonKey(size: Int):                              [OccurrenceFacetResult_taxon]
    gbifClassification_classKey(size: Int):           [OccurrenceFacetResult_taxon]
    gbifClassification_familyKey(size: Int):          [OccurrenceFacetResult_taxon]
    gbifClassification_genusKey(size: Int):           [OccurrenceFacetResult_taxon]
    gbifClassification_kingdomKey(size: Int):         [OccurrenceFacetResult_taxon]
    gbifClassification_orderKey(size: Int):           [OccurrenceFacetResult_taxon]
    gbifClassification_phylumKey(size: Int):          [OccurrenceFacetResult_taxon]
    gbifClassification_speciesKey(size: Int):         [OccurrenceFacetResult_taxon]
    gbifClassification_acceptedUsage_key(size: Int):  [OccurrenceFacetResult_taxon]
    gbifClassification_classification_key(size: Int): [OccurrenceFacetResult_taxon]
    gbifClassification_usage_key(size: Int):          [OccurrenceFacetResult_taxon]
  }

  type OccurrenceFacetResult_float {
    key: Float!
    count: Int!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type OccurrenceFacetResult_boolean {
    key: Boolean!
    count: Int!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type OccurrenceFacetResult_string {
    key: String!
    count: Int!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type OccurrenceFacetResult_dataset {
    key: String!
    count: Int!
    dataset: Dataset!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type OccurrenceFacetResult_node {
    key: String!
    count: Int!
    node: Node!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type OccurrenceFacetResult_installation {
    key: String!
    count: Int!
    installation: Node!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type OccurrenceFacetResult_taxon {
    key: String!
    count: Int!
    taxon: Taxon!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type OccurrenceFacetResult_network {
    key: String!
    count: Int!
    network: Network!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type OccurrenceFacetResult_organization {
    key: String!
    count: Int!
    publisher: Organization!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _query: JSON
  }

  type Stats {
    count: Float!
    min: Float
    max: Float
    avg: Float
    sum: Float
  }

  type Occurrence {
    gbifId: ID!
    
    basisOfRecord: String
    catalogNumber: String
    collectionCode: String
    collectionKey: String
    continent: String
    coordinatePrecision: Float
    coordinateUncertaintyInMeters: Float
    country: String
    countryCode: String
    crawlId: Int
    created: DateTime
    datasetKey: String
    datasetPublishingCountry: String
    datasetTitle: String
    dateIdentified: DateTime
    day: Float
    decimalLatitude: Float
    decimalLongitude: Float
    depth: Float
    depthAccuracy: Float
    elevation: Float
    elevationAccuracy: Float
    endDayOfYear: Float
    endorsingNodeKey: String
    establishmentMeans: String
    eventDateSingle: DateTime
    eventId: String
    gbifClassification: GbifClassification
    hasCoordinate: Boolean
    hasGeospatialIssue: Boolean
    id: String
    individualCount: Int
    installationKey: String
    institutionCode: String
    institutionKey: String
    issues: String
    lastCrawled: DateTime
    license: String
    lifeStage: String
    locality: String
    maximumDepthInMeters: Float
    maximumDistanceAboveSurfaceInMeters: Float
    maximumElevationInMeters: Float
    measurementOrFactItems: JSON
    mediaLicenses: String
    mediaTypes: String
    minimumDepthInMeters: Float
    minimumDistanceAboveSurfaceInMeters: Float
    minimumElevationInMeters: Float
    modified: DateTime
    month: Float
    multimediaItems: JSON
    networkKeys: String
    notIssues: String
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
    publishingOrganizationKey: String
    recordNumber: String
    recordedBy: String
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
    year: Float
  }

  type GbifClassification {
    acceptedUsage: AcceptedUsage
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
    usage: Usage
    usageParsedName: UsageParsedName
    verbatimScientificName: String
  }

  type AcceptedUsage {
    key: Int
    name: String
    rank: String
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

  type Usage {
    key: Int
    name: String
    rank: String
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
`;

module.exports = typeDef;