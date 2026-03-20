import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    taxonInfo(datasetKey: ID!, key: ID!): TaxonInfo
    taxon(datasetKey: ID!, key: ID!): TaxonSimple
    speciesMatchByUsageKey(usageKey: ID!, checklistKey: ID): SpeciesMatchResult
    checklistMetadata(checklistKey: ID!): ChecklistMeta
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
    citation: String
    remarks: String
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
    source: String
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
    datasetKey: String
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
    link: String
    label: String!

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
    namePublishedIn: String
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
    link: String
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
    link: String
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
    thumbor(width: Int, height: Int, fitIn: Boolean): String
  }

  type TaxonInfo {
    group: String
    checklistBankLink: String
    # environment: [String]!
    measurementOrFacts: [MeasurementOrFact!]
    bibliography: [Bibliography!]
    distributions: [Distribution!]
    media: [Media!]
    vernacularNames: [VernacularName!]
    classification: [TaxonClassification!]
    synonyms: TaxonSynonyms
    taxon: TaxonFull

    """
    Get a single vernacular name for a given language. If there are multiple vernacular names for the same language, it will return the most frequently occurring one. If there are no vernacular names for the given language, it will return null.
    """
    vernacularName(language: String): VernacularName
  }
`;

export default typeDef;
