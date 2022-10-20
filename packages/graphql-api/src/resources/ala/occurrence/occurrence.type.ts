import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    biocacheSearch(
      search: String
      size: Int
      from: Int
      sort: String
      dir: String
      facet: String
      filters: [String]
    ): BiocacheSearchResult
  }

  type BiocacheSearchResult {
    pageSize: Int
    totalRecords: Int
    sort: String
    dir: String
    status: String
    occurrences: [Occurrence]
  }

  type Occurrence {
    occurrenceID: String!
    datasetKey: String
    datasetTitle: String
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
    infraspecificEpithet: String
    catalogNumber: String
    samplingProtocol: String
    locationID: String
    basisOfRecord: String
    stateProvince: String
    recordedBy: String
    recordedById: String
    identifiedBy: String
    identifiedById: String
    scientificNames: String
    month: Int
    year: Int
    images: [ImageMeta]
    imageMeta: ImageMeta
  }

  type OccurrenceFacet {
    datasetKey(size: Int, include: String): [OccurrenceFacetResult_string]
    kingdom(size: Int, include: String): [OccurrenceFacetResult_string]
    phylum(size: Int, include: String): [OccurrenceFacetResult_string]
    class(size: Int, include: String): [OccurrenceFacetResult_string]
    order(size: Int, include: String): [OccurrenceFacetResult_string]
    family(size: Int, include: String): [OccurrenceFacetResult_string]
    genus(size: Int, include: String): [OccurrenceFacetResult_string]
    species(size: Int, include: String): [OccurrenceFacetResult_string]
    catalogNumber(size: Int, include: String): [OccurrenceFacetResult_string]
    samplingProtocol(size: Int, include: String): [OccurrenceFacetResult_string]
    locationID(size: Int, include: String): [OccurrenceFacetResult_string]
    basisOfRecord(size: Int, include: String): [OccurrenceFacetResult_string]
    stateProvince(size: Int, include: String): [OccurrenceFacetResult_string]
    recordedBy(size: Int, include: String): [OccurrenceFacetResult_string]
    recordedById(size: Int, include: String): [OccurrenceFacetResult_string]
    identifiedBy(size: Int, include: String): [OccurrenceFacetResult_string]
    identifiedById(size: Int, include: String): [OccurrenceFacetResult_string]
    scientificNames(size: Int, include: String): [OccurrenceFacetResult_string]
    month(size: Int, include: String): [OccurrenceFacetResult_string]
    year(size: Int, include: String): [OccurrenceFacetResult_string]

    eventHierarchyJoined(
      size: Int
      include: String
    ): [OccurrenceFacetResult_string]
    eventHierarchy(size: Int, include: String): [OccurrenceFacetResult_string]
    eventTypeHierarchyJoined(
      size: Int
      include: String
    ): [OccurrenceFacetResult_string]
    eventTypeHierarchy(
      size: Int
      include: String
    ): [OccurrenceFacetResult_string]
  }

  type OccurrenceFacetResult_string {
    key: String!
    count: Int!
    _predicate: JSON
  }
`;
