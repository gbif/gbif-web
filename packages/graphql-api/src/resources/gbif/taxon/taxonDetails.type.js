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
    identifier: URL
    publisher: String
    references: URL
    source: String
    taxonKey: Int
    title: String
    type: MediaType
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
    sourceTaxonKey: Int!
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
    sourceTaxonKey: Int!
    taxonKey: Int!
    vernacularName: String!
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

  extend type Taxon {
    """
    Lists all direct child usages for a name usage
    """
    children(limit: Int, offset: Int): TaxonListResult
    """
    Lists all parent usages for a name usage
    """
    parents: [Taxon]
    """
    Lists all related name usages in other checklists
    """
    related(limit: Int, offset: Int): TaxonListResult
    """
    Lists all synonyms for a name usage
    """
    synonyms(limit: Int, offset: Int): TaxonListResult
    """
    Gets the verbatim name usage
    """
    verbatim: JSON
    """
    Gets the parsed name for a name usage
    """
    name: TaxonName
    """
    Lists all media items for a name usage
    """
    media: MediaListResult
    """
    Lists all descriptions for a name usage
    """
    descriptions(limit: Int, offset: Int): TaxonDescriptionResult
    """
    Lists all distributions for a name usage
    """
    distributions(limit: Int, offset: Int): TaxonDistributionResult

    """
    Lists all references for a name usage
    """
    references(limit: Int, offset: Int): TaxonReferenceResult

    """
    Lists all species profiles for a name usage
    """
    speciesProfiles(limit: Int, offset: Int): TaxonProfileResult

    """
    Lists all vernacular names for a name usage
    """
    vernacularNames(limit: Int, offset: Int): TaxonVernacularNameResult

    """
    Lists all type specimens for a name usage, see also lmitations: https://github.com/gbif/portal-feedback/issues/1146#issuecomment-366260607
    """
    typeSpecimens(limit: Int, offset: Int): TaxonTypeSpecimenResult
  }
`;

export default typeDef;
