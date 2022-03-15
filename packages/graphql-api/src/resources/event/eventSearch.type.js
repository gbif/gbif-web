const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    eventSearch(
      apiKey: String,
      predicate: Predicate
      size: Int
      from: Int
      ): EventSearchResult
    event(key: ID!): Event
    globe(cLat: Float, cLon: Float, pLat: Float, pLon: Float, sphere: Boolean, graticule: Boolean, land: Boolean): Globe
  }

  type EventSearchResult {
    """
    The events that match the filter
    """
    documents(size: Int, from: Int): EventDocuments!
    """
    Get number of events per distinct values in a field. E.g. how many events per year.
    """
    facet: EventFacet
    """
    Get statistics for a numeric field. Minimimum value, maximum etc.
    """
    stats: EventStats
    """
    Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set
    """
    cardinality: EventCardinality
    _predicate: JSON
    _downloadPredicate: JSON
    """
    Register the search predicate with the v1 endpoints and get a hash back. This can be used to query e.g. the tile API.
    """
    _v1PredicateHash: String,
    _meta: JSON
  }

  type EventDocuments {
    size: Int!
    from: Int!
    total: Long!
    results: [Event]!
  }

  type EventStats {
    year: Stats!
  }

  type EventCardinality {
    datasetKey: Int!
    publishingOrgKey: Int!
    recordedBy: Int!
    catalogNumber: Int!
    identifiedBy: Int!
    locality: Int!
    waterBody: Int!
    stateProvince: Int!
    samplingProtocol: Int!
    sampleSizeUnit: Int!
    verbatimScientificName: Int!
    eventId: Int!
  }

  type EventFacet {
    # datasetTitle(size: Int): [EventFacetResult_string]
    # publisherTitle(size: Int): [EventFacetResult_string]

    basisOfRecord(size: Int): [EventFacetResult_string]
    catalogNumber(size: Int): [EventFacetResult_string]
    collectionCode(size: Int): [EventFacetResult_string]
    continent(size: Int): [EventFacetResult_string]
    countryCode(size: Int): [EventFacetResult_string]
    datasetPublishingCountry(size: Int): [EventFacetResult_string]
    dwcaExtension(size: Int): [EventFacetResult_string]
    establishmentMeans(size: Int): [EventFacetResult_string]
    id(size: Int): [EventFacetResult_string]
    institutionCode(size: Int): [EventFacetResult_string]
    issues(size: Int): [EventFacetResult_string]
    license(size: Int): [EventFacetResult_string]
    lifeStage(size: Int): [EventFacetResult_string]
    locality(size: Int): [EventFacetResult_string]
    mediaLicenses(size: Int): [EventFacetResult_string]
    mediaTypes(size: Int): [EventFacetResult_string]
    # notIssues(size: Int): [EventFacetResult_string]
    eventId(size: Int): [EventFacetResult_string]
    organismId(size: Int): [EventFacetResult_string]
    organismQuantityType(size: Int): [EventFacetResult_string]
    parentEventId(size: Int): [EventFacetResult_string]
    programmeAcronym(size: Int): [EventFacetResult_string]
    projectId(size: Int): [EventFacetResult_string]
    protocol(size: Int): [EventFacetResult_string]
    publishingCountry(size: Int): [EventFacetResult_string]
    recordNumber(size: Int): [EventFacetResult_string]
    sampleSizeUnit(size: Int): [EventFacetResult_string]
    samplingProtocol(size: Int): [EventFacetResult_string]
    sex(size: Int): [EventFacetResult_string]
    stateProvince(size: Int): [EventFacetResult_string]
    typeStatus(size: Int): [EventFacetResult_string]
    typifiedName(size: Int): [EventFacetResult_string]
    waterBody(size: Int): [EventFacetResult_string]
    agentIds_type(size: Int): [EventFacetResult_string]
    agentIds_value(size: Int): [EventFacetResult_string]

    coordinatePrecision(size: Int): [EventFacetResult_float]
    coordinateUncertaintyInMeters(size: Int): [EventFacetResult_float]
    crawlId(size: Int): [EventFacetResult_float]
    day(size: Int): [EventFacetResult_float]
    decimalLatitude(size: Int): [EventFacetResult_float]
    decimalLongitude(size: Int): [EventFacetResult_float]
    depth(size: Int): [EventFacetResult_float]
    depthAccuracy(size: Int): [EventFacetResult_float]
    elevation(size: Int): [EventFacetResult_float]
    elevationAccuracy(size: Int): [EventFacetResult_float]
    endDayOfYear(size: Int): [EventFacetResult_float]
    individualCount(size: Int): [EventFacetResult_float]
    maximumDepthInMeters(size: Int): [EventFacetResult_float]
    maximumDistanceAboveSurfaceInMeters(size: Int): [EventFacetResult_float]
    maximumElevationInMeters(size: Int): [EventFacetResult_float]
    minimumDepthInMeters(size: Int): [EventFacetResult_float]
    minimumDistanceAboveSurfaceInMeters(size: Int): [EventFacetResult_float]
    minimumElevationInMeters(size: Int): [EventFacetResult_float]
    month(size: Int): [EventFacetResult_float]
    organismQuantity(size: Int): [EventFacetResult_float]
    relativeOrganismQuantity(size: Int): [EventFacetResult_float]
    sampleSizeValue(size: Int): [EventFacetResult_float]
    startDayOfYear(size: Int): [EventFacetResult_float]
    year(size: Int): [EventFacetResult_float]

    hasCoordinate(size: Int): [EventFacetResult_boolean]
    hasGeospatialIssue(size: Int): [EventFacetResult_boolean]

    datasetKey(size: Int): [EventFacetResult_dataset]
    endorsingNodeKey(size: Int): [EventFacetResult_node]
    installationKey(size: Int): [EventFacetResult_installation]
    networkKey(size: Int): [EventFacetResult_network]
    publishingOrgKey(size: Int): [EventFacetResult_organization]

    collectionKey(size: Int): [EventFacetResult_collection]
    institutionKey(size: Int): [EventFacetResult_institution]
    recordedBy(size: Int): [EventFacetResult_recordedBy]
    identifiedBy(size: Int): [EventFacetResult_identifiedBy]
  }

  type EventFacetResult_float {
    key: Float!
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_boolean {
    key: Boolean!
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_string {
    key: String!
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_dataset {
    key: String!
    count: Int!
    dataset: Dataset!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_node {
    key: String!
    count: Int!
    node: Node!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_installation {
    key: String!
    count: Int!
    installation: Node!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_taxon {
    key: String!
    count: Int!
    taxon: Taxon!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_network {
    key: String!
    count: Int!
    network: Network!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_organization {
    key: String!
    count: Int!
    publisher: Organization!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_institution {
    key: String!
    count: Int!
    institution: Institution!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_collection {
    key: String!
    count: Int!
    collection: Collection!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_recordedBy {
    key: String!
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    eventsIdentifiedBy(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_identifiedBy {
    key: String!
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    eventsRecordedBy(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type Stats {
    count: Float!
    min: Float
    max: Float
    avg: Float
    sum: Float
  }
`;

module.exports = typeDef;
