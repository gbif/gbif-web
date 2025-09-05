import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    occurrenceSearch(
      apiKey: String
      predicate: Predicate
      q: String
      size: Int
      from: Int
    ): OccurrenceSearchResult
    occurrence(key: ID!): Occurrence
    globe(
      cLat: Float
      cLon: Float
      pLat: Float
      pLon: Float
      sphere: Boolean
      graticule: Boolean
      land: Boolean
    ): Globe
    occurrenceDatasetSuggest(
      q: String
      size: Int
      predicate: Predicate
    ): [OccurrenceDatasetSuggestResult]
    occurrencePublisherSuggest(
      q: String
      size: Int
      predicate: Predicate
    ): [OccurrencePublisherSuggestResult]
  }

  type OccurrenceDatasetSuggestResult {
    key: String!
    count: Long!
    dataset: Dataset!
  }

  type OccurrencePublisherSuggestResult {
    key: String!
    count: Long!
    publisher: Organization!
  }

  enum OccurrenceSortBy {
    basisOfRecord
    catalogNumber
    collectionCode
    collectionKey
    continent
    coordinatePrecision
    coordinateUncertaintyInMeters
    countryCode
    datasetID
    publishingCountry
    datasetKey
    degreeOfEstablishment
    depth
    distanceFromCentroidInMeters
    elevation
    establishmentMeans
    eventDate
    eventId
    fieldNumber
    taxonKey
    gbifId
    gbifRegion
    bed
    biostratigraphy
    identifiedBy
    individualCount
    institutionCode
    institutionKey
    isClustered
    isSequenced
    island
    license
    lifeStage
    locality
    month
    occurrenceId
    occurrenceStatus
    organismId
    preparations
    recordNumber
    recordedBy
    sex
    waterBody
    year
    iucnRedListCategoryCode
    stateProvince
  }

  type OccurrenceSearchResult {
    """
    The occurrences that match the filter
    """
    documents(
      size: Int
      from: Int
      sortBy: OccurrenceSortBy
      sortOrder: SortOrder
      checklistKey: ID
    ): OccurrenceDocuments!
    """
    Get number of occurrences per distinct values in a field. E.g. how many occurrences per year.
    """
    facet: OccurrenceFacet
    """
    Get statistics for a numeric field. Minimimum value, maximum etc.
    """
    stats: OccurrenceStats
    """
    Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set
    """
    cardinality: OccurrenceCardinality
    """
    Get histogram for a numeric field with the option to specify an interval size
    """
    histogram: OccurrenceHistogram
    autoDateHistogram: OccurrenceAutoDateHistogram
    _predicate: JSON
    _meta: JSON
    """
    Register the search predicate with the v1 endpoints and get a hash back. This can be used to query e.g. the tile API.
    """
    metaPredicate: JSON
  }

  type OccurrenceMetaPredicate {
    predicateHash: String
    predicate: JSON
  }

  type OccurrenceDocuments {
    size: Int!
    from: Int!
    total: Long!
    results: [Occurrence]!
  }

  type OccurrenceStats {
    year: Stats!
    decimalLatitude: Stats!
    decimalLongitude: Stats!
    eventDate: Stats!
  }

  type OccurrenceCardinality {
    datasetKey: Long!
    datasetId: Long!
    publishingOrg: Long!
    hostingOrganizationKey: Long!
    recordedBy: Long!
    catalogNumber: Long!
    identifiedBy: Long!
    locality: Long!
    waterBody: Long!
    stateProvince: Long!
    samplingProtocol: Long!
    sampleSizeUnit: Long!
    verbatimScientificName: Long!
    eventId: Long!
    month: Long!
    license: Long!
    basisOfRecord: Long!
    issue: Long!
    taxonomicIssue: Long!
    collectionKey: Long!
    institutionKey: Long!
    collectionCode: Long!
    institutionCode: Long!
    networkKey: Long!
    programme: Long!
    taxonKey(checklistKey: ID): ID!
    classKey(checklistKey: ID): ID!
    familyKey(checklistKey: ID): ID!
    genusKey(checklistKey: ID): ID!
    kingdomKey(checklistKey: ID): ID!
    orderKey(checklistKey: ID): ID!
    phylumKey(checklistKey: ID): ID!
    speciesKey(checklistKey: ID): ID!
    usageKey(checklistKey: ID): ID!
    preparations: Long!
    iucnRedListCategory(checklistKey: ID): Long!
    establishmentMeans: Long!
    countryCode: Long!
    publishingCountry: Long!
    continent: Long!
    dwcaExtension: Long!
    mediaType: Long!
    protocol: Long!
    typeStatus: Long!
    fieldNumber: Long!
    repatriated: Long!
    gadmGid: Long!
    projectId: Long!
    higherGeography: Long!
    isSequenced: Long!
    sex: Long!
    pathway: Long!
    degreeOfEstablishment: Long!
    islandGroup: Long!
    island: Long!
    georeferencedBy: Long!
    datasetName: Long!
    publishedByGbifRegion: Long!
    gbifRegion: Long!
    organismQuantityType: Long!
    biostratigraphy: Long!
    lithostratigraphy: Long!
  }

  type OccurrenceHistogram {
    decimalLongitude(interval: Float): LongitudeHistogram!
    year(interval: Float): JSON
  }

  type OccurrenceAutoDateHistogram {
    eventDate(
      buckets: Float
      minimum_interval: String
    ): AutoDateHistogramResult!
  }

  type AutoDateHistogramResult {
    bucketSize: Int!
    buckets: [AutoDateHistogramBucket]
    interval: String!
  }

  type AutoDateHistogramBucket {
    date: DateTime!
    key: ID!
    count: Long!
  }

  type LongitudeHistogram {
    buckets: JSON!
    bounds: JSON
  }

  type Histogram {
    interval: Long
    buckets: [HistogramBucket]
  }

  type HistogramBucket {
    key: ID!
    count: Long!
  }

  type OccurrenceFacet {
    # datasetTitle(size: Int): [OccurrenceFacetResult_string]
    # publisherTitle(size: Int): [OccurrenceFacetResult_string]

    basisOfRecord(size: Int, from: Int): [OccurrenceFacetResult_string]
    catalogNumber(size: Int, from: Int): [OccurrenceFacetResult_string]
    collectionCode(size: Int, from: Int): [OccurrenceFacetResult_string]
    continent(size: Int, from: Int): [OccurrenceFacetResult_string]
    countryCode(size: Int, from: Int): [OccurrenceFacetResult_string]
    datasetPublishingCountry(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_string]
    dwcaExtension(size: Int, from: Int): [OccurrenceFacetResult_string]
    eventId(size: Int, from: Int): [OccurrenceFacetResult_string]
    fieldNumber(size: Int, from: Int): [OccurrenceFacetResult_string]
    higherGeography(size: Int, from: Int): [OccurrenceFacetResult_string]
    id(size: Int, from: Int): [OccurrenceFacetResult_string]
    institutionCode(size: Int, from: Int): [OccurrenceFacetResult_string]
    issue(size: Int, from: Int): [OccurrenceFacetResult_string]
    taxonomicIssue(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_string]
    license(size: Int, from: Int): [OccurrenceFacetResult_string]
    lifeStage(size: Int, from: Int): [OccurrenceFacetResult_string]
    locality(size: Int, from: Int): [OccurrenceFacetResult_string]
    mediaLicenses(size: Int, from: Int): [OccurrenceFacetResult_string]
    mediaType(size: Int, from: Int): [OccurrenceFacetResult_string]
    # notIssues(size: Int, from: Int): [OccurrenceFacetResult_string]
    occurrenceId(size: Int, from: Int): [OccurrenceFacetResult_string]
    organismId(size: Int, from: Int): [OccurrenceFacetResult_string]
    organismQuantityType(size: Int, from: Int): [OccurrenceFacetResult_string]
    parentEventId(size: Int, from: Int): [OccurrenceFacetResult_string]
    preparations(
      size: Int
      from: Int
      include: String
    ): [OccurrenceFacetResult_string]
    biostratigraphy(
      size: Int
      from: Int
      include: String
    ): [OccurrenceFacetResult_string]
    lithostratigraphy(
      size: Int
      from: Int
      include: String
    ): [OccurrenceFacetResult_string]
    programme(size: Int, from: Int): [OccurrenceFacetResult_string]
    projectId(size: Int, from: Int): [OccurrenceFacetResult_string]
    protocol(size: Int, from: Int): [OccurrenceFacetResult_string]
    publishingCountry(size: Int, from: Int): [OccurrenceFacetResult_string]
    recordNumber(size: Int, from: Int): [OccurrenceFacetResult_string]
    sampleSizeUnit(size: Int, from: Int): [OccurrenceFacetResult_string]
    samplingProtocol(size: Int, from: Int): [OccurrenceFacetResult_string]
    sex(size: Int, from: Int): [OccurrenceFacetResult_sex]
    pathway(size: Int, from: Int): [OccurrenceFacetResult_pathway]
    degreeOfEstablishment(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_degreeOfEstablishment]
    stateProvince(size: Int, from: Int): [OccurrenceFacetResult_string]
    typeStatus(size: Int, from: Int): [OccurrenceFacetResult_typeStatus]
    typifiedName(size: Int, from: Int): [OccurrenceFacetResult_string]
    waterBody(size: Int, from: Int): [OccurrenceFacetResult_string]
    agentIds_type(size: Int, from: Int): [OccurrenceFacetResult_string]
    agentIds_value(size: Int, from: Int): [OccurrenceFacetResult_string]
    datasetId(size: Int, from: Int): [OccurrenceFacetResult_string]
    islandGroup(size: Int, from: Int): [OccurrenceFacetResult_string]
    island(size: Int, from: Int): [OccurrenceFacetResult_string]
    georeferencedBy(size: Int, from: Int): [OccurrenceFacetResult_string]
    datasetName(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifRegion(size: Int, from: Int): [OccurrenceFacetResult_string]
    publishedByGbifRegion(size: Int, from: Int): [OccurrenceFacetResult_string]

    gbifClassification_classificationPath(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_string]
    verbatimScientificName(size: Int, from: Int): [OccurrenceFacetResult_string]
    iucnRedListCategory(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_string]
    occurrenceStatus(size: Int): [OccurrenceFacetResult_string]

    coordinatePrecision(size: Int, from: Int): [OccurrenceFacetResult_float]
    coordinateUncertaintyInMeters(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_float]
    crawlId(size: Int, from: Int): [OccurrenceFacetResult_float]
    day(size: Int, from: Int): [OccurrenceFacetResult_float]
    decimalLatitude(size: Int, from: Int): [OccurrenceFacetResult_float]
    decimalLongitude(size: Int, from: Int): [OccurrenceFacetResult_float]
    depth(size: Int, from: Int): [OccurrenceFacetResult_float]
    depthAccuracy(size: Int, from: Int): [OccurrenceFacetResult_float]
    elevation(size: Int, from: Int): [OccurrenceFacetResult_float]
    elevationAccuracy(size: Int, from: Int): [OccurrenceFacetResult_float]
    endDayOfYear(size: Int, from: Int): [OccurrenceFacetResult_float]
    individualCount(size: Int, from: Int): [OccurrenceFacetResult_float]
    maximumDepthInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    maximumDistanceAboveSurfaceInMeters(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_float]
    maximumElevationInMeters(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_float]
    minimumDepthInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    minimumDistanceAboveSurfaceInMeters(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_float]
    minimumElevationInMeters(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_float]
    month(size: Int, from: Int): [OccurrenceFacetResult_float]
    organismQuantity(size: Int, from: Int): [OccurrenceFacetResult_float]
    relativeOrganismQuantity(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_float]
    sampleSizeValue(size: Int, from: Int): [OccurrenceFacetResult_float]
    startDayOfYear(size: Int, from: Int): [OccurrenceFacetResult_float]
    year(size: Int, from: Int): [OccurrenceFacetResult_float]

    hasCoordinate(size: Int): [OccurrenceFacetResult_boolean]
    hasGeospatialIssue(size: Int): [OccurrenceFacetResult_boolean]
    repatriated(size: Int): [OccurrenceFacetResult_boolean]

    isInCluster(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    isSequenced(size: Int, from: Int): [OccurrenceFacetResult_boolean]

    datasetKey(size: Int, from: Int): [OccurrenceFacetResult_dataset]
    endorsingNodeKey(size: Int, from: Int): [OccurrenceFacetResult_node]
    installationKey(size: Int, from: Int): [OccurrenceFacetResult_installation]
    networkKey(size: Int, from: Int): [OccurrenceFacetResult_network]
    publishingOrg(size: Int, from: Int): [OccurrenceFacetResult_organization]
    hostingOrganizationKey(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_organization]

    establishmentMeans(
      size: Int
      from: Int
    ): [OccurrenceFacetResult_establishmentMeans]

    gadmGid(size: Int, from: Int): [OccurrenceFacetResult_gadm]

    taxonID(size: Int, from: Int): [OccurrenceFacetResult_string]
    collectionKey(size: Int, from: Int): [OccurrenceFacetResult_collection]
    institutionKey(size: Int, from: Int): [OccurrenceFacetResult_institution]
    recordedBy(
      size: Int
      from: Int
      include: String
    ): [OccurrenceFacetResult_recordedBy]
    identifiedBy(
      size: Int
      from: Int
      include: String
    ): [OccurrenceFacetResult_identifiedBy]

    taxonKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    classKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    familyKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    genusKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    kingdomKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    orderKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    phylumKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    speciesKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    acceptedUsageKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
    usageKey(
      size: Int
      from: Int
      checklistKey: ID
    ): [OccurrenceFacetResult_taxon]
  }

  type OccurrenceFacetResult_float {
    key: Float!
    count: Long!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_establishmentMeans {
    key: String!
    count: Long!
    concept: VocabularyConcept!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_gadm {
    key: String!
    count: Long!
    gadm: Gadm!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_boolean {
    key: Boolean!
    count: Long!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_string {
    key: String!
    count: Long!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_typeStatus {
    key: String!
    count: Long!
    concept: VocabularyConcept
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_sex {
    key: String!
    count: Long!
    concept: VocabularyConcept
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_pathway {
    key: String!
    count: Long!
    concept: VocabularyConcept
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_degreeOfEstablishment {
    key: String!
    count: Long!
    concept: VocabularyConcept
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_dataset {
    key: String!
    count: Long!
    dataset: Dataset
    occurrences(size: Int, from: Int): OccurrenceSearchResult
    _predicate: JSON
  }

  type OccurrenceFacetResult_node {
    key: String!
    count: Long!
    node: Node!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_installation {
    key: String!
    count: Long!
    installation: Node!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_taxon {
    key: String!
    count: Long!
    """
    Only apply to backbone taxa at the moment
    """
    taxon: Taxon
    """
    Get whatever minimum shared data we can compile for both backbone and other checklists. The idea is to allow UIs to generate a nice diaplay label with classification
    """
    taxonMatch(checklistKey: ID): SpeciesMatchResult
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceTaxonFacetSummary {
    name: String!
    classification: [Classification!]
  }

  type OccurrenceFacetResult_network {
    key: String!
    count: Long!
    network: Network!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_organization {
    key: String!
    count: Long!
    publisher: Organization!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_institution {
    key: String!
    count: Long!
    institution: Institution!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_collection {
    key: String!
    count: Long!
    collection: Collection!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_recordedBy {
    key: String!
    count: Long!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    occurrencesIdentifiedBy(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_identifiedBy {
    key: String!
    count: Long!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    occurrencesRecordedBy(size: Int, from: Int): OccurrenceSearchResult!
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

export default typeDef;
