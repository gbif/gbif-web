import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    taxonSearch(
      limit: Int
      offset: Int
      q: String
      datasetKey: [ID]
      rank: [Rank]
      higherTaxonKey: [ID]
      status: [TaxonomicStatus]
      isExtinct: Boolean
      habitat: [Habitat]
      origin: [Origin]
      nameType: [NameType]
      nomenclaturalStatus: [NomenclaturalStatus]
      issue: [NameUsageIssue]
      hl: Boolean
      qField: [TaxonSearchQField]
      query: TaxonSearchInput
    ): TaxonSearchResult
    backboneSearch(
      limit: Int
      offset: Int
      q: String
      rank: [Rank]
      higherTaxonKey: [ID]
      status: [TaxonomicStatus]
      isExtinct: Boolean
      habitat: [Habitat]
      nameType: [NameType]
      nomenclaturalStatus: [NomenclaturalStatus]
      issue: [NameUsageIssue]
      hl: Boolean
      qField: [TaxonSearchQField]
      query: TaxonSearchInput
    ): TaxonSearchResult
    taxon(key: ID!): Taxon
    checklistRoots(datasetKey: ID!, limit: Int, offset: Int): TaxonListResult

    """
    Unstable endpoint! Will return a list of taxon suggestions based on the provided query string. The returned taxonKeys are for the backbone. The datasetKey parameter can be used to restrict the suggestions to a specific checklist, but the results will be matched to the backbone and discarded if there is no match. The limit parameter is indicative only, as the number of results returned may be less than the limit if there are no matches in the backbone or if there is duplicate matches.
    """
    taxonSuggestions(
      limit: Int
      q: String
      language: Language
      preferAccepted: Boolean
      vernacularNamesOnly: Boolean
      strictMatching: Boolean
      checklistKey: ID
      taxonScope: [ID!]
    ): [TaxonSuggestion]!

    taxonBySourceId(sourceId: ID!, datasetKey: ID!): Taxon
    speciesMatchByUsageKey(usageKey: ID!, checklistKey: ID): SpeciesMatchResult
  }

  input TaxonSearchInput {
    limit: Int
    offset: Int
    q: String
    datasetKey: [ID]
    rank: [Rank]
    higherTaxonKey: [ID]
    status: [TaxonomicStatus]
    isExtinct: Boolean
    habitat: [Habitat]
    origin: [Origin]
    nameType: [NameType]
    nomenclaturalStatus: [NomenclaturalStatus]
    issue: [NameUsageIssue]
    hl: Boolean
    qField: [TaxonSearchQField]
  }

  type TaxonSearchResult {
    results: [Taxon]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
    facet: TaxonFacet
    _query: JSON
  }

  type TaxonListResult {
    results: [Taxon!]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type Taxon {
    key: Int!
    nubKey: Int

    kingdom: String
    phylum: String
    class: String
    order: String
    family: String
    genus: String
    species: String
    kingdomKey: Int
    phylumKey: Int
    classKey: Int
    orderKey: Int
    familyKey: Int
    genusKey: Int
    speciesKey: Int

    accepted: String
    acceptedKey: Int
    basionymKey: Int
    authorship: String
    canonicalName: String
    constituentKey: ID
    constituent: Dataset
    constituentTitle: String
    datasetKey: ID
    dataset: Dataset
    datasetTitle: String!
    issues: [String]

    lastCrawled: String
    lastInterpreted: String
    nameKey: Int
    nameType: NameType
    nomenclaturalStatus: [NomenclaturalStatus]
    numDescendants: Int
    origin: Origin
    parent: String
    parentKey: Int
    publishedIn: String
    rank: Rank
    references: String
    remarks: String
    scientificName: String
    formattedName(useFallback: Boolean): String
    sourceTaxonKey: Int
    synonym: Boolean
    taxonID: String
    taxonomicStatus: String
    vernacularName: String

    wikiData: WikiDataTaxonData
    backboneTaxon: Taxon
    acceptedTaxon: Taxon
    """
    This is an experiment that might be stopped at any time. It is not part of the stable API. It will attempt ti find a nice image to represent the taxon.
    """
    taxonImages_volatile(size: Int): [Image]!
    speciesCount: Int
    checklistBankBreakdown: [ClbBreakdownTaxon]
    invasiveInCountries: [InvasiveInCountry]
    iucnStatus: IUCNstatus

    """
    Get capabilities from map server
    """
    mapCapabilities: MapCapabilities
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

  type InvasiveInCountry {
    country: String!
    isSubCountry: Boolean
    datasetKey: String!
    dataset: String
    scientificName: String
    nubKey: ID!
    taxonKey: ID!
    isInvasive: Boolean
  }

  type IUCNstatus {
    distribution: TaxonDistribution
    references: String
  }

  type TaxonBreakdown {
    name: String!
    count: Int!
    _query: JSON
    taxonSearch(
      limit: Int
      offset: Int
      q: String
      datasetKey: [ID]
      rank: [Rank]
      higherTaxonKey: [ID]
      status: [TaxonomicStatus]
      isExtinct: Boolean
      habitat: [Habitat]
      nameType: [NameType]
      nomenclaturalStatus: [NomenclaturalStatus]
      issue: [NameUsageIssue]
      hl: String
    ): TaxonSearchResult!
    taxon: Taxon
  }

  type TaxonFacet {
    rank(limit: Int, offset: Int): [TaxonFacetResult]
    status(limit: Int, offset: Int): [TaxonFacetResult]
    higherTaxonKey(limit: Int, offset: Int): [TaxonBreakdown]
    issue(limit: Int, offset: Int): [TaxonFacetResult]
  }

  type TaxonFacetResult {
    name: String!
    count: Int!
    _query: JSON
    taxonSearch(
      limit: Int
      offset: Int
      q: String
      datasetKey: [ID]
      rank: [Rank]
      higherTaxonKey: [Int]
      status: [TaxonomicStatus]
      isExtinct: Boolean
      habitat: [Habitat]
      nameType: [NameType]
      nomenclaturalStatus: [NomenclaturalStatus]
      issue: [NameUsageIssue]
      hl: String
    ): TaxonSearchResult!
  }

  enum TaxonSearchQField {
    DESCRIPTION
    VERNACULAR
    SCIENTIFIC
  }

  type TaxonSuggestion {
    key: ID!
    scientificName: String
    canonicalName: String
    rank: String
    classification: [Classification]
    vernacularName: String
    taxonomicStatus: String
    acceptedNameOf: String
  }
`;

export default typeDef;
