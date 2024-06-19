import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    eventSearch(
      apiKey: String
      predicate: Predicate
      size: Int
      from: Int
    ): EventSearchResult

    event(eventID: String, datasetKey: String): Event

    occurrences(eventID: String, datasetKey: String, locationID: String, month:Int, year:Int
      size: Int, from: Int): SimpleOccurrenceResults

    location(locationID: String): Event
  }

  type EventSearchResult {
    """
    The events that match the filter
    """
    documents(size: Int, from: Int, randomize: Boolean): EventDocuments!
    """
    Get number of events per distinct values in a field. E.g. how many events per year.
    """
    facet(size: Int, from: Int): EventFacet
    """
    Get number of events per distinct values in two or more fields. E.g. how many events per year.
    """
    multifacet(size: Int, from: Int): EventMultiFacet
    """
    Get number of occurrences per distinct values in a field. E.g. how many occurrence per year.
    """
    occurrenceFacet: EventOccurrenceFacet
    """
    Get number of occurrences matching this search
    """
    occurrenceCount: Int

    """
    Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set
    """
    cardinality: EventCardinality

    """
    Get number of events per distinct values in a field. E.g. how many events per year.
    """
    temporal: EventTemporal
    """
    Get statistics for a numeric field. Minimimum value etc.
    """
    stats: EventStats
    _predicate: JSON
    """
    Register the search predicate with the ES tile server
    """
    _tileServerToken: String
    _meta: JSON
  }

  type EventDocuments {
    size: Int!
    from: Int!
    total: Int!
    results: [Event]!
  }

  type SimpleOccurrenceResults {
    size: Int!
    from: Int!
    total: Int!
    results: [SimpleOccurrence]!
  }

  type Event {
    eventID: String
    surveyID:String
    type: String
    eventType: EventType
    eventName: String
    parentEventID: String
    datasetKey: String
    locality: String
    datasetTitle: String
    samplingProtocol: [String]
    sampleSizeUnit: String
    sampleSizeValue: Float
    stateProvince: String
    country: String
    countryCode: String
    year: Int
    month: Int
    day: Int
    eventDate: String
    decimalLatitude: Float
    decimalLongitude: Float
    occurrenceCount: Int
    childEventCount: Int
    coordinates: JSON
    formattedCoordinates: String
    measurementOrFactTypes: [String]
    measurementOrFactCount: Int
    parentEvent: Event
    measurementOrFacts: [Measurement]
    eventHierarchy: [String]
    eventHierarchyJoined: String
    eventTypeHierarchy: [String]
    eventTypeHierarchyJoined: String
    eventHierarchyLevels: Int
    eventRemarks: String
    locationID: String
    """
    get dataset information via EML
    """
    dataset: JSON!
    """
    Get number of distinct species for this event and its children
    """
    speciesCount: Int!
    wktConvexHull: String
    temporalCoverage: TemporalCoverage
    distinctTaxa: [DistinctTaxon]!
    extensions: EventExtensions
  }

  type TemporalCoverage {
    gte: String
    lte: String
  }

  type SimpleOccurrence {
    key: String
    scientificName: String
    kingdom: String
    family: String
    individualCount: String
    occurrenceStatus: String
    basisOfRecord: String
  }

  type DistinctTaxon {
    count: Int
    key: String
    rank: String
    scientificName: String
    kingdom: String
    kingdomKey: String
    phylum: String
    phylumKey: String
    class: String
    classKey: String
    order: String
    orderKey: String
    family: String
    familyKey: String
    genus: String
    genusKey: String
    species: String
    speciesKey: String
  }

  type Measurement {
    measurementID: String
    measurementType: String
    measurementValue: String
    measurementUnit: String
    measurementAccuracy: String
    measurementDeterminedBy: String
    measurementDeterminedDate: String
    measurementMethod: String
    measurementRemarks: String
  }

  type EventType {
    concept: String
    lineage: [String]
  }

  type EventMultiFacet {
    locationIDStateProvince(size: Int, include: String): [EventMultiFacetResult_string]
  }

  type EventFacet {
    kingdomKey(size: Int, include: String):                 [EventFacetResult_string]
    phylumKey(size: Int, include: String):                    [EventFacetResult_string]
    classKey(size: Int, include: String):                  [EventFacetResult_string]
    orderKey(size: Int, include: String):                   [EventFacetResult_string]
    familyKey(size: Int, include: String):                 [EventFacetResult_string]
    genusKey(size: Int, include: String):                   [EventFacetResult_string]
    speciesKey(size: Int, include: String):                  [EventFacetResult_string]
    eventHierarchyJoined(size: Int, include: String):     [EventFacetResult_string]
    eventHierarchy(size: Int, include: String):           [EventFacetResult_string]
    eventTypeHierarchyJoined(size: Int, include: String): [EventFacetResult_string]
    eventTypeHierarchy(size: Int, include: String):       [EventFacetResult_string]
    surveyID(size: Int, from: Int, include: String):      [EventFacetResult_string]
    locality(size: Int, include: String):                 [EventFacetResult_string]
    samplingProtocol(size: Int, include: String):         [EventFacetResult_string]
    measurementOrFactTypes(size: Int, include: String):   [EventFacetResult_string]
    stateProvince(size: Int, include: String):            [EventFacetResult_string]
    datasetKey(size: Int, include: String):               [EventFacetResult_dataset]
    measurementOfFactTypes(size: Int, include: String):   [EventFacetResult_dataset]
    locationID(size: Int, from: Int):                     [EventFacetResult_string]
    year(size: Int, from: Int):                           [EventFacetResult_float]
    month(size: Int, from: Int):                          [EventFacetResult_float]
    eventType(size: Int, include: String):                [EventFacetResult_string]
    scientificNames(size: Int, include: String):          [EventFacetResult_string]
  }

  type EventCardinality {
    species: Int!
    datasetKey: Int!
    locationID: Int!
    parentEventID: Int!
    surveyID: Int!
  }

  type EventTemporal {
    datasetKey(size: Int, include: String): EventTemporalCardinalityResult
    locationID(
      size: Int
      from: Int
      include: String
    ): EventTemporalCardinalityResult
  }

  type EventTemporalCardinalityResult {
    cardinality: Int!
    results: [EventTemporalResult_string]
  }

  type EventFacetResult_string {
    key: String!
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventMultiFacetResult_string {
    keys: [String]
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventFacetResult_float {
    key: Float!
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventTemporalResult_string {
    key: String!
    count: Int!
    breakdown: [YearBreakdown]
    temporal: EventTemporal
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type YearBreakdown {
    y: Int!
    c: Int!
    ms: [MonthBreakdown]
  }

  type MonthBreakdown {
    m: Int!
    c: Int!
  }

  type EventFacetResult_dataset {
    key: String!
    count: Int!
    occurrenceCount: Int
    extensions: [String]
    datasetTitle: String!
    archive: DataArchive
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventStats {
    occurrenceCount: Stats!
    year: Stats!
  }

  type DataArchive {
    url: String
    fileSizeInMB: Float
    modified: String
  }

  type Stats {
    count: Float!
    min: Float
    max: Float
    avg: Float
    sum: Float
  }

  type EventOccurrenceFacet {
    datasetKey(size: Int, include: String):       [EventOccurrenceFacetResult_string]
    kingdomKey(size: Int, include: String):          [EventOccurrenceFacetResult_string]
    phylumKey(size: Int, include: String):           [EventOccurrenceFacetResult_string]
    classKey(size: Int, include: String):            [EventOccurrenceFacetResult_string]
    orderKey(size: Int, include: String):            [EventOccurrenceFacetResult_string]
    familyKey(size: Int, include: String):           [EventOccurrenceFacetResult_string]
    genusKey(size: Int, include: String):            [EventOccurrenceFacetResult_string]
    speciesKey(size: Int, include: String):          [EventOccurrenceFacetResult_string]
    samplingProtocol(size: Int, include: String): [EventOccurrenceFacetResult_string]
    locationID(size: Int, include: String):       [EventOccurrenceFacetResult_string]
    basisOfRecord(size: Int, include: String):    [EventOccurrenceFacetResult_string]
    occurrenceStatus(size: Int, include: String): [EventOccurrenceFacetResult_string]
    stateProvince(size: Int, include: String):    [EventOccurrenceFacetResult_string]
    recordedBy(size: Int, include: String):       [EventOccurrenceFacetResult_string]
    recordedById(size: Int, include: String):     [EventOccurrenceFacetResult_string]
    identifiedBy(size: Int, include: String):     [EventOccurrenceFacetResult_string]
    identifiedById(size: Int, include: String):   [EventOccurrenceFacetResult_string]
    scientificNames(size: Int, include: String):  [EventOccurrenceFacetResult_string]
    month(size: Int, include: String):            [EventOccurrenceFacetResult_string]
    year(size: Int, include: String):             [EventOccurrenceFacetResult_string]
    eventHierarchyJoined(size: Int, include: String):     [EventOccurrenceFacetResult_string]
    eventHierarchy(size: Int, include: String):           [EventOccurrenceFacetResult_string]
    eventTypeHierarchyJoined(size: Int, include: String): [EventOccurrenceFacetResult_string]
    eventTypeHierarchy(size: Int, include: String):       [EventOccurrenceFacetResult_string]
  }

  type EventOccurrenceFacetResult_string {
    key: String!
    count: Int!
    _predicate: JSON
  }

  type EventExtensions {
    test: String
  }
`;
