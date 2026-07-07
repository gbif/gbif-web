import { gql } from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    speciesKey(key: ID!): SpeciesKey
  }
  type SpeciesKey {
    key: ID
    nubKey: ID
    nameKey: ID
    taxonID: ID
    kingdom: String
    phylum: String
    order: String
    family: String
    genus: String
    species: String
    kingdomKey: ID
    phylumKey: ID
    classKey: ID
    orderKey: ID
    familyKey: ID
    genusKey: ID
    speciesKey: ID
    datasetKey: ID
    parentKey: ID
    parent: String
    scientificName: String
    canonicalName: String
    vernacularName: String
    authorship: String
    nameType: String
    rank: String
    origin: String
    taxonomicStatus: String
    numDescendants: Int
    lastCrawled: String
    lastInterpreted: String
    class: String
    deleted: String
    issues: [String]
    nomenclaturalStatus: [String]
    """
    Attempt to map the species to the taxon API.
    """
    taxon: TaxonSimple
    """
    If it is a backbone key and there is a match to Catalogue of Life, this is the ID of the match. This can be used to fetch the taxon from COL.
    """
    colMatchId: ID
  }
`;

export default typeDef;
