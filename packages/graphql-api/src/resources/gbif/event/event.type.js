import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    eventSearch(
      q: String
      limit: Int
      offset: Int
      count: Int
      query: EventSearchInput
    ): EventSearchResult

    event(eventId: ID, datasetKey: ID): Event
  }

  input EventSearchInput {
    acceptedTaxonKey: [ID]
    associatedSequences: [String]
    catalogNumber: [String]
    classKey: [ID]
    checklistKey: ID
    collectionCode: [String]
    continent: [String]
    coordinateUncertaintyInMeters: String
    country: [Country]
    crawlId: [String]
    datasetId: [String]
    datasetKey: [ID]
    datasetName: [String]
    day: [Int]
    decimalLatitude: String
    decimalLongitude: String
    depth: String
    dwcaExtension: [String]
    elevation: String
    endDayOfYear: Int
    eventDate: [String]
    eventId: [ID]
    eventType: [String]
    familyKey: ID
    fieldNumber: [String]
    gadmGid: [String]
    gadmLevel0Gid: [String]
    gadmLevel1Gid: [String]
    gadmLevel2Gid: [String]
    gadmLevel3Gid: [String]
    gbifId: ID
    gbifRegion: [String]
    genusKey: ID
    geoDistance: String
    georeferencedBy: [String]
    geometry: [String]
    hasCoordinate: [Boolean]
    higherGeography: [String]
    humboldtAbundanceCap: [String]
    humboldtAreNonTargetTaxaFullyReported: [Boolean]
    humboldtCompilationSourceTypes: [String]
    humboldtCompilationTypes: [String]
    humboldtEventDuration: String
    humboldtEventDurationUnit: [String]
    humboldtEventDurationValue: [String]
    humboldtGeospatialScopeAreaUnit: [String]
    humboldtGeospatialScopeAreaValue: [Float]
    humboldtHasMaterialSamples: [Boolean]
    humboldtHasNonTargetOrganisms: [Boolean]
    humboldtHasNonTargetTaxa: [Boolean]
    humboldtHasVouchers: [Boolean]
    humboldtInventoryTypes: [String]
    humboldtIsAbsenceReported: [Boolean]
    humboldtIsAbundanceCapReported: [Boolean]
    humboldtIsAbundanceReported: [Boolean]
    humboldtIsDegreeOfEstablishmentScopeFullyReported: [Boolean]
    humboldtIsGrowthFormScopeFullyReported: [Boolean]
    humboldtIsLeastSpecificTargetCategoryQuantityInclusive: [Boolean]
    humboldtIsLifeStageScopeFullyReported: [Boolean]
    humboldtIsSamplingEffortReported: [Boolean]
    humboldtIsTaxonomicScopeFullyReported: [Boolean]
    humboldtIsVegetationCoverReported: [Boolean]
    humboldtMaterialSampleTypes: [String]
    humboldtProtocolNames: [String]
    humboldtSamplingEffortUnit: [String]
    humboldtSamplingEffortValue: [String]
    humboldtSamplingPerformedBy: [String]
    humboldtSiteCount: [String]
    humboldtTargetDegreeOfEstablishmentScope: [String]
    humboldtTargetGrowthFormScope: [String]
    humboldtTargetHabitatScope: [String]
    humboldtTargetLifeStageScope: [String]
    humboldtTargetTaxonomicScopeTaxonKey: [ID]
    humboldtTargetTaxonomicScopeUsageKey: [ID]
    humboldtTargetTaxonomicScopeUsageName: [String]
    humboldtTaxonCompletenessProtocols: [String]
    humboldtTaxonomicIssue: [String]
    humboldtTotalAreaSampledUnit: [String]
    humboldtTotalAreaSampledValue: [String]
    hasGeospatialIssue: [Boolean]
    hostingOrganizationKey: [ID]
    installationKey: [ID]
    institutionCode: [String]
    issue: [String]
    island: [String]
    islandGroup: [String]
    iucnRedListCategory: [String]
    kingdomKey: [ID]
    lastInterpreted: [String]
    license: [String]
    locality: [String]
    mediaType: [String]
    modified: [String]
    month: [Int]
    networkKey: [ID]
    orderKey: [ID]
    otherCatalogNumbers: [String]
    parentEventId: [ID]
    phylumKey: [ID]
    programme: [String]
    projectId: [String]
    protocol: [String]
    publishingCountry: [String]
    publishedByGbifRegion: [String]
    publishingOrg: [ID]
    recordNumber: [String]
    repatriated: Boolean
    sampleSizeUnit: [String]
    sampleSizeValue: [Float]
    samplingProtocol: [String]
    scientificName: [String]
    speciesKey: [ID]
    startDayOfYear: [Int]
    stateProvince: [String]
    taxonKey: [ID]
    taxonId: [String]
    taxonomicIssue: [String]
    taxonomicStatus: [String]
    verbatimScientificName: [String]
    waterBody: [String]
    year: [String]
    matchCase: Boolean
    shuffle: String
    hl: Boolean
    q: String
    facet: [String]
    facetMincount: Int
    facetMultiselect: Boolean
    facetLimit: Int
    facetOffset: Int
    limit: Int
    offset: Int
  }

  type EventSearchResult {
    results: [Event]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
    facet: EventFacet
    _query: JSON
  }

  type Event {
    eventID: ID!
    eventType: String
    eventName: String
    parentEventID: ID
    datasetKey: String
    locality: String
    datasetTitle: String
    samplingProtocol: [String]
    sampleSizeUnit: String
    sampleSizeValue: Float
    stateProvince: String
    country: Country
    countryCode: String
    year: Int
    month: Int
    day: Int
    eventDate: EventDate
    decimalLatitude: Float
    decimalLongitude: Float
    occurrenceCount: Int
    childEventCount: Int
    coordinates: JSON
    formattedCoordinates: String
    measurementOrFactTypes: [String]
    measurementOrFactMethods: [String]
    parentEvent: Event
    # measurementOrFacts: [Measurement]
    eventHierarchy: [String]
    eventHierarchyJoined: String
    eventTypeHierarchy: [String]
    eventTypeHierarchyJoined: String
    eventHierarchyLevels: Int
    eventRemarks: String
    locationID: String
    """
    Get number of distinct species for this event and its children
    """
    extensions: EventExtensions
    humboldt: [Humboldt]
  }

  type EventDate {
    from: String
    to: String
  }

  type TemporalCoverage {
    gte: String
    lte: String
  }

  type Measurement {
    measurementId: String
    measurementType: String
    measurementValue: String
    measurementUnit: String
    measurementAccuracy: String
    measurementDeterminedBy: String
    measurementDeterminedDate: String
    measurementMethod: String
    measurementRemarks: String
  }

  type EventFacet {
    country(limit: Int, offset: Int): [EventFacetResult]
    continent(limit: Int, offset: Int): [EventFacetResult]
    locality(limit: Int, offset: Int): [EventFacetResult]
    sampleSizeUnit(limit: Int, offset: Int): [EventFacetResult]
    sampleSizeValue(limit: Int, offset: Int): [EventFacetResult]
    humboldtProtocolNames(limit: Int, offset: Int): [EventFacetResult]
    humboldtInventoryTypes(limit: Int, offset: Int): [EventFacetResult]
    humboldtSamplingPerformedBy(limit: Int, offset: Int): [EventFacetResult]
    humboldtSamplingEffortUnit(limit: Int, offset: Int): [EventFacetResult]
    humboldtSamplingEffortValue(limit: Int, offset: Int): [EventFacetResult]

    humboldtTargetDegreeOfEstablishmentScope(
      limit: Int
      offset: Int
    ): [EventFacetResult]
    humboldtEventDurationUnit(limit: Int, offset: Int): [EventFacetResult]
    humboldtEventDurationValue(limit: Int, offset: Int): [EventFacetResult]
    humboldtTargetGrowthFormScope(limit: Int, offset: Int): [EventFacetResult]
    humboldtTargetHabitatScope(limit: Int, offset: Int): [EventFacetResult]
    humboldtTargetLifeStageScope(limit: Int, offset: Int): [EventFacetResult]
    humboldtTotalAreaSampledUnit(limit: Int, offset: Int): [EventFacetResult]
    humboldtTotalAreaSampledValue(limit: Int, offset: Int): [EventFacetResult]
    humboldtTargetTaxonomicScopeUsageName(
      limit: Int
      offset: Int
    ): [EventFacetResult]
    humboldtAbundanceCap(limit: Int, offset: Int): [EventFacetResult]
    humboldtMaterialSampleTypes(limit: Int, offset: Int): [EventFacetResult]

    month(limit: Int, offset: Int): [EventFacetResult]
    year(limit: Int, offset: Int): [EventFacetResult]
    eventId(limit: Int, offset: Int): [EventFacetResult]
    dwcaExtension(limit: Int, offset: Int): [EventFacetResult]
    samplingProtocol(limit: Int, offset: Int): [EventFacetResult]
    eventType(limit: Int, offset: Int): [EventFacetResult]
    gadmGid(limit: Int, offset: Int): [EventFacetResult]
  }

  type EventFacetResult {
    name: String!
    count: Int!
    _query: JSON
    eventSearch(
      q: String
      limit: Int
      offset: Int
      query: EventSearchInput
    ): EventSearchResult!
  }

  type EventExtensions {
    audubon: [JSON]
    image: [JSON]
    measurementOrFact: [JSON]
    multimedia: [JSON]
    extendedMeasurementOrFact: [JSON]
    humboldtEcologicalInventory: [JSON]
  }

  type Humboldt {
    """
    absentTaxa
    """
    abundanceCap: Int
    areNonTargetTaxaFullyReported: Boolean
    compilationSourceTypes: [String]
    compilationTypes: [String]
    eventDurationUnit: String
    eventDurationValue: Int
    """
    eventDurationValueInMinutes
    """
    excludedDegreeOfEstablishmentScope: [String]
    excludedGrowthFormScope: [String]
    excludedHabitatScope: [String]
    excludedLifeStageScope: [String]
    geospatialScopeAreaUnit: String
    geospatialScopeAreaValue: Float
    hasMaterialSamples: Boolean
    hasNonTargetOrganisms: Boolean
    hasNonTargetTaxa: Boolean
    hasVouchers: Boolean
    inventoryTypes: [String]
    isAbsenceReported: Boolean
    isAbundanceCapReported: Boolean
    isAbundanceReported: Boolean
    isDegreeOfEstablishmentScopeFullyReported: Boolean
    isGrowthFormScopeFullyReported: Boolean
    isLeastSpecificTargetCategoryQuantityInclusive: Boolean
    isLifeStageScopeFullyReported: Boolean
    isSamplingEffortReported: Boolean
    isTaxonomicScopeFullyReported: Boolean
    isVegetationCoverReported: Boolean
    materialSampleTypes: [String]
    protocolDescriptions: [String]
    protocolNames: [String]
    protocolReferences: [String]
    samplingEffortUnit: String
    samplingEffortValue: Float
    samplingPerformedBy: [String]
    siteCount: Int
    targetDegreeOfEstablishmentScope: [String]
    targetGrowthFormScope: [String]
    targetHabitatScope: [String]
    targetLifeStageScope: [String]
    targetTaxonomicScope(checklistKey: ID): HumboldtTaxonomicScope
    taxonCompletenessProtocols: [String]
    totalAreaSampledUnit: String
    totalAreaSampledValue: Float
    verbatimSiteDescriptions: [String]
    verbatimSiteNames: [String]
    voucherInstitutions: [String]
  }

  type HumboldtTaxonomicScope {
    usageKey: ID!
    usageName: String
    usageRank: String
    classification: [HumboldtClassificationNode]
  }

  type HumboldtClassificationNode {
    key: ID!
    name: String
    rank: String
  }
`;
