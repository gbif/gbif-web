import { gql } from 'apollo-server';

const typeDef = gql`
  type TaxonName {
    bracketAuthorship: String
    bracketYear: String
    canonicalName: String
    canonicalNameComplete: String
    canonicalNameWithMarker: String
    genusOrAbove: String
    key: String!
    parsed: Boolean
    parsedPartially: Boolean
    rankMarker: String
    scientificName: String
    specificEpithet: String
    type: NameType
  }

  type MediaListResult {
    results: [TaxonMedia]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonMedia {
    audience: String
    created: DateTime
    creator: String
    description: String
    format: String
    identifier: String
    publisher: String
    references: String
    source: String
    rightsHolder: String
    taxonKey: Int
    title: String
    type: MediaType
  }

  type TaxonOccurrenceMedia {
    taxonKey: ID!
    mediaType: MediaType
    offset: Int!
    limit: Int!
    count: Int
    endOfRecords: Boolean!
    results: [TaxonOccurrenceMediaResult]!
  }

  type TaxonOccurrenceMediaResult {
    occurrenceKey: ID!
    identifier: String
    thumbor(width: Int, height: Int, fitIn: Boolean): String
  }

  type TaxonDescriptionResult {
    results: [TaxonDescription]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonDescription {
    description: String
    key: Int!
    language: String # unfortunately this is free text
    source: String
    sourceTaxonKey: Int!
    taxonKey: Int!
    type: String
  }

  type TaxonDistributionResult {
    results: [TaxonDistribution]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonDistribution {
    country: Country
    establishmentMeans: EstablishmentMeans
    locality: String
    locationId: String
    source: String
    sourceTaxonKey: Int
    status: OccurrenceStatus
    taxonKey: Int!
    threatStatus: String
  }

  type TaxonReferenceResult {
    results: [TaxonReference]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonReference {
    citation: String
    source: String
    sourceTaxonKey: Int!
    taxonKey: Int!
    type: String
  }

  type TaxonProfileResult {
    results: [TaxonReference]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonProfile {
    extinct: Boolean
    habitat: String
    source: String
    sourceTaxonKey: Int!
    taxonKey: Int!
  }

  type TaxonVernacularNameResult {
    results: [TaxonVernacularName]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonVernacularName {
    country: Country
    language: String # can be empty
    source: String
    sourceTaxonKey: Int
    taxonKey: Int!
    vernacularName: String!
    sourceTaxon: Taxon
  }

  type TaxonTypeSpecimenResult {
    results: [TaxonTypeSpecimen]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonTypeSpecimen {
    scientificName: String
    source: String
    sourceTaxonKey: Int
    taxonKey: Int!
    typeDesignatedBy: String
  }

  type IucnRedListCategoryResult {
    category: ThreatStatus
    usageKey: Int!
    scientificName: String
    taxonomicStatus: TaxonomicStatus
    code: String
  }

  type Treatment {
    description: String
    sourceTaxon: Taxon
    publisherTitle: String
    publisherHomepage: String
    publisherKey: String
    datasetTitle: String
    datasetKey: String
    citation: String
    link: String
  }
`;

export default typeDef;
