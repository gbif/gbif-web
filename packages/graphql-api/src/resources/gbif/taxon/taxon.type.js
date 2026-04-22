import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    taxonInfo(datasetKey: ID, key: ID!): TaxonInfo
    taxon(datasetKey: ID, key: ID!): TaxonSimple
    speciesMatchByUsageKey(usageKey: ID!, checklistKey: ID): SpeciesMatchResult
    checklistMetadata(checklistKey: ID!): ChecklistMeta
    taxonSearch(
      datasetKey: ID
      taxonRank: [String]
      taxonID: [ID]
      taxonomicStatus: [String]
      extinct: Boolean
      nameType: [String]
      code: [String]
      origin: [String]
      group: [String]
      authorship: [String]
      authorshipYear: [Int]
      issue: [String]
      q: String

      searchType: TaxonSearchQType
      sortBy: TaxonSearchSortBy
      reverse: Boolean
      limit: Int
      offset: Int
      facet: [String]
      facetMinCount: Int
      facetMultiselect: Boolean
      facetLimit: Int
      facetOffset: Int
      query: TaxonSearchInput
    ): TaxonSearchResult
    datasetRoots(datasetKey: ID, limit: Int, offset: Int): TaxonTreeResults
  }

  enum TaxonSearchQType {
    WORDS
    EXACT
    FUZZY
  }

  enum TaxonSearchSortBy {
    NAME
    TAXONOMIC
    RELEVANCE
  }

  input TaxonSearchInput {
    datasetKey: ID
    taxonRank: [String]
    taxonId: [ID]
    taxonomicStatus: [String]
    extinct: Boolean
    nameType: [String]
    code: [String]
    origin: [String]
    group: [String]
    authorship: [String]
    authorshipYear: [Int]
    issue: [String]
    q: String

    searchType: TaxonSearchQType
    sortBy: TaxonSearchSortBy
    reverse: Boolean
    limit: Int
    offset: Int
    facet: [String]
    facetMinCount: Int
    facetMultiselect: Boolean
    facetLimit: Int
    facetOffset: Int
  }

  type TaxonSearchResult {
    results: [TaxonResult!]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
    facet: TaxonFacet
    _query: JSON
  }

  type TaxonResult {
    taxon: TaxonSimple!
    classification: [TaxonClassification!]!
    vernacularNames: [VernacularName!]!
    """
    Get a single vernacular name for a given language. If there are multiple vernacular names for the same language, it will return the most frequently occurring one. If there are no vernacular names for the given language, it will return null.
    """
    vernacularName(language: String): VernacularName
  }

  type TaxonFacet {
    taxonRank(limit: Int, offset: Int): [TaxonFacetResult]
    taxonomicStatus(limit: Int, offset: Int): [TaxonFacetResult]
    taxonId(limit: Int, offset: Int): [TaxonFacetResult_taxonId]
    issue(limit: Int, offset: Int): [TaxonFacetResult]
  }

  type TaxonFacetResult {
    name: String!
    count: Int!
    _query: JSON
  }

  type TaxonFacetResult_taxonId {
    name: String!
    count: Int!
    _query: JSON
    taxon: TaxonInfo
    taxonSearch(
      datasetKey: [ID]
      rank: [String]
      taxonId: [ID]
      status: [String]
      extinct: Boolean
      nameType: [String]
      code: [String]
      origin: [String]
      group: [String]
      authorship: [String]
      authorshipYear: [Int]
      issue: [String]
      q: String

      limit: Int
      offset: Int
      facet: [String]
      facetMinCount: Int
      facetMultiselect: Boolean
      facetLimit: Int
      facetOffset: Int
      query: TaxonSearchInput
    ): TaxonSearchResult
  }

  type TaxonTreeResults {
    offset: Int
    limit: Int
    endOfRecords: Boolean
    count: Int
    results: [TaxonTreeItem!]!
  }

  type TaxonTreeItem {
    taxonID: ID!
    parentNameUsageID: ID
    scientificName: String
    scientificNameAuthorship: String
    taxonRank: String!
    taxonomicStatus: String!
    label: String!
    children: Int!
    species: Int!
  }

  type ChecklistMeta {
    mainIndex: ChecklistMetaMainIndex!
  }

  type ChecklistMetaMainIndex {
    clbDatasetKey: ID!
    datasetTitle: String!
    version: String
  }

  """
  A smaller subset of the fields provided by the match service v2. This is used in lack of a species API for e.g. extended CoL.
  """
  type SpeciesMatchResult {
    checklistKey: ID!
    synonym: Boolean!
    classification: [Classification]!
    acceptedUsage: SpeciesMatchAcceptedUsage
    usage: SpeciesMatchUsage!
    iucnStatus: String
    iucnStatusCode: String
    diagnostics: SpeciesMatchDiagnostics
  }

  type SpeciesMatchDiagnostics {
    matchType: String
    confidence: Float
  }
  type SpeciesMatchUsage {
    key: ID!
    name: String
    canonicalName: String
    rank: String
    doubtful: Boolean
    formattedName: String
  }

  type SpeciesMatchAcceptedUsage {
    key: ID!
    name: String
    canonicalName: String
    rank: String
    doubtful: Boolean
    formattedName: String
  }

  type ClbBreakdownTaxon {
    id: String
    name: String
    rank: String
    status: String
    label: String
    labelHtml: String
    species: Int
    children: [ClbBreakdownTaxon]
  }

  type MeasurementOrFact {
    measurementType: String
    measurementValue: String
    measurementRemarks: String
  }

  type Bibliography {
    referenceID: ID!
    doi: String
    citation: String!
    remarks: String
    """
    Indicates whether the taxon name was published in a specific source according to the field namePublishedInID. This is a derived field that checks if the taxon's namePublishedInID matches the referenceID of any bibliography entry.
    """
    isNamePublishedIn: Boolean
  }

  type Distribution {
    locationID: String
    locality: String
    countryCode: String
    lifeStage: String
    establishmentMeans: String
    degreeOfEstablishment: String
    pathway: String
    threatStatus: String
    eventDate: String
    referenceID: ID
    remarks: String
  }

  type Media {
    identifier: String
    type: String
    title: String
    created: String
    creator: String
    license: String
    references: String
    source: String
    remarks: String
  }

  type VernacularName {
    vernacularName: String
    language: String
    temporal: String
    locality: String
    countryCode: String
    sex: String
    preferredName: Boolean
    source: String
    remarks: String
  }

  type TaxonClassification {
    taxonID: ID!
    acceptedNameUsageID: ID
    parentNameUsageID: ID
    scientificName: String
    scientificNameAuthorship: String
    taxonRank: String
    taxonomicStatus: String
    nomenclaturalCode: String
    label: String
  }

  type TaxonSynonyms {
    heterotypic: [[Synonym!]]!
    homotypic: [Synonym!]!
  }

  type Synonym {
    taxonID: ID!
    scientificName: String
    scientificNameAuthorship: String
    taxonRank: String
    taxonomicStatus: String
    nomenclaturalCode: String
    label: String
    """
    Indicates whether the homotypic synonym is the original name usage according to the field originalNameUsageID. This is a derived field that checks if the synonym's taxonID matches the taxon's originalNameUsageID.
    """
    isOriginalNameUsage: Boolean
  }

  type TaxonSimple {
    datasetKey: ID!
    taxonID: ID!
    acceptedNameUsageID: ID
    parentNameUsageID: ID
    scientificName: String!
    scientificNameAuthorship: String
    taxonRank: String!
    taxonomicStatus: String!
    nomenclaturalCode: String
    extinct: Boolean
    references: String
    label: String!
    mapCapabilities: MapCapabilities

    acceptedNameUsage: String

    dataset: Dataset
    acceptedTaxon: TaxonSimple
    occurrenceMedia(
      limit: Int
      offset: Int
      mediaType: MediaType
    ): TaxonOccurrenceMedia
    breakdown(sortByCount: Boolean): TaxonBreakdown
    wikiData: WikiDataTaxonData
    relatedInfo: RelatedTaxonInfo
    related(datasetType: RelatedDatasetType): [TaxonSimple!]!
    children(limit: Int, offset: Int): Children
    parentTree: [TaxonChild!]
  }

  type TaxonFull {
    datasetKey: ID!
    taxonID: ID!
    acceptedNameUsageID: ID
    parentNameUsageID: ID
    scientificName: String!
    scientificNameAuthorship: String
    taxonRank: String!
    taxonomicStatus: String!
    nomenclaturalCode: String
    extinct: Boolean
    label: String!
    scientificNameID: ID!
    acceptedNameUsage: String
    parentNameUsage: String
    originalNameUsageID: ID
    originalNameUsage: String
    nameAccordingTo: String
    namePublishedInID: String
    namePhrase: String
    nomenclaturalStatus: String
    nameType: String!
    taxonomicGroup: String
    genericName: String
    infragenericEpithet: String
    specificEpithet: String
    infraspecificEpithet: String
    cultivarEpithet: String
    sourceDatasetKey: String
    sourceID: ID
    references: String
    taxonRemarks: String
    issues: [String]

    dataset: Dataset
    acceptedTaxon: TaxonSimple
    occurrenceMedia(
      limit: Int
      offset: Int
      mediaType: MediaType
    ): TaxonOccurrenceMedia
    breakdown(sortByCount: Boolean): TaxonBreakdown
    wikiData: WikiDataTaxonData
    relatedInfo: RelatedTaxonInfo
    related(datasetType: RelatedDatasetType): [TaxonSimple!]!
    children(limit: Int, offset: Int): Children
    parentTree: [TaxonChild!]
    mapCapabilities: MapCapabilities
  }

  type Children {
    offset: Int!
    limit: Int!
    endOfRecords: Boolean!
    count: Int!
    results: [TaxonChild!]!
  }

  type TaxonChild {
    taxonID: ID!
    parentNameUsageID: ID
    scientificName: String
    scientificNameAuthorship: String
    taxonRank: String!
    taxonomicStatus: String
    label: String
    children: Int
    species: Int
    childrenTree(limit: Int, offset: Int): Children
  }

  enum RelatedDatasetType {
    ARTICLE
  }

  type RelatedTaxonInfo {
    redlist: Redlist
    griis: [Griis!]
  }

  type Redlist {
    datasetKey: ID!
    taxonID: ID
    parentNameUsageID: ID
    scientificName: String
    scientificNameAuthorship: String
    taxonRank: String
    taxonomicStatus: String
    nomenclaturalCode: String
    references: String
    label: String
    threatStatus: String
  }

  type Griis {
    datasetKey: ID!
    taxonID: ID!
    locality: String
    locationID: String
    countryCode: String
    establishmentMeans: String
    pathway: String
    eventDate: String
    source: String
    isInvasive: Boolean

    dataset: Dataset
    isCountry: Boolean!
  }

  type TaxonBreakdown {
    taxonID: ID!
    taxonRank: String
    scientificName: String
    species: Int
    breakdown: [TaxonBreakdown]
  }

  type TaxonOccurrenceMedia {
    taxonKey: ID!
    mediaType: MediaType
    offset: Int!
    limit: Int!
    count: Int
    endOfRecords: Boolean!
    results: [TaxonOccurrenceMediaResult!]!
  }

  type TaxonOccurrenceMediaResult {
    occurrenceKey: ID!
    identifier: String
    rightsHolder: String
    license: String
    thumbor(width: Int, height: Int, fitIn: Boolean): String
  }

  type TaxonInfo {
    group: String
    groupIconSVG: String
    checklistBankLink: String
    # environment: [String]!
    measurementOrFacts: [MeasurementOrFact!]
    bibliography: [Bibliography!]!
    distributions: [Distribution!]
    media(limit: Int): [Media!]
    vernacularNames: [VernacularName!]
    classification: [TaxonClassification!]
    synonyms: TaxonSynonyms
    taxon: TaxonFull

    namePublishedIn: String
    """
    Get a single vernacular name for a given language. If there are multiple vernacular names for the same language, it will return the most frequently occurring one. If there are no vernacular names for the given language, it will return null.
    """
    vernacularName(language: String): VernacularName
    """
    Shortcut to get scientific name from the taxon object.
    """
    scientificName: String
    """
    Shortcut to get scientific name from the taxon object.
    """
    label: String
  }
`;

export default typeDef;
