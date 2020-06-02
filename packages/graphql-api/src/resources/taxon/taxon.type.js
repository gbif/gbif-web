const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    taxonSearch(limit: Int, 
                offset: Int,
                q: String, 
                datasetKey: [ID], 
                rank: [Rank], 
                highertaxonKey: [Int], 
                status: [TaxonomicStatus], 
                isExtinct: Boolean, 
                habitat: [Habitat], 
                nameType: [NameType], 
                nomenclaturalStatus: [NomenclaturalStatus], 
                issue: [NameUsageIssue], 
                hl: Boolean
              ): TaxonSearchResult!
    backboneSearch(limit: Int, 
                offset: Int,
                q: String, 
                rank: [Rank], 
                highertaxonKey: [Int], 
                status: [TaxonomicStatus], 
                isExtinct: Boolean, 
                habitat: [Habitat], 
                nameType: [NameType], 
                nomenclaturalStatus: [NomenclaturalStatus], 
                issue: [NameUsageIssue], 
                hl: Boolean
              ): TaxonSearchResult!
    taxon(key: Int!): Taxon
    checklistRoots(datasetKey: ID!, limit: Int, offset: Int): TaxonListResult
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
    results: [Taxon]!
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
    rank: Rank
    remarks: String
    scientificName: String
    formattedName: String
    sourceTaxonKey: Int
    synonym: Boolean
    taxonID: String
    taxonomicStatus: String
    vernacularName: String
    wikiData: WikiDataTaxonData
  }

  type TaxonBreakdown {
    name: String!
    count: Int!
    _query: JSON
    taxonSearch(limit: Int, 
                offset: Int,
                q: String, 
                datasetKey: [ID], 
                rank: [Rank], 
                highertaxonKey: [Int], 
                status: [TaxonomicStatus], 
                isExtinct: Boolean, 
                habitat: [Habitat], 
                nameType: [NameType], 
                nomenclaturalStatus: [NomenclaturalStatus], 
                issue: [NameUsageIssue], 
                hl: String
              ): TaxonSearchResult!
    taxon: Taxon
  }

  type TaxonFacet {
    rank(limit: Int, offset: Int): [TaxonFacetResult]
    status(limit: Int, offset: Int): [TaxonFacetResult]
    higherTaxon(limit: Int, offset: Int): [TaxonBreakdown]
    issue(limit: Int, offset: Int): [TaxonFacetResult]
  }

  type TaxonFacetResult {
    name: String!
    count: Int!
    _query: JSON
    taxonSearch(limit: Int, 
                offset: Int,
                q: String, 
                datasetKey: [ID], 
                rank: [Rank], 
                highertaxonKey: [Int], 
                status: [TaxonomicStatus], 
                isExtinct: Boolean, 
                habitat: [Habitat], 
                nameType: [NameType], 
                nomenclaturalStatus: [NomenclaturalStatus], 
                issue: [NameUsageIssue], 
                hl: String
              ): TaxonSearchResult!
  }

`;

module.exports = typeDef;