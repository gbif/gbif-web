import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    taxon(key: ID!): Taxon
  }

  type Taxon {
    """
    Changed 'key' type from Int to String
    """
    key: String!
    nubKey: Int

    kingdom: String
    phylum: String
    class: String
    order: String
    family: String
    genus: String
    species: String
    """
    Changed key type from Int to String
    """
    kingdomKey: String
    phylumKey: String
    classKey: String
    orderKey: String
    familyKey: String
    genusKey: String
    speciesKey: String

    accepted: String
    acceptedKey: Int
    authorship: String
    canonicalName: String
    constituentKey: ID
    """
    Actual 'constituent' type: Dataset
    """
    constituent: JSON
    constituentTitle: String
    datasetKey: ID
    """
    Actual 'dataset' type: Dataset
    """
    dataset: JSON
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
    """
    Actual 'parentKey' type: Int
    """
    parentKey: String
    rank: Rank
    remarks: String
    scientificName: String
    formattedName: String
    sourceTaxonKey: Int
    synonym: Boolean
    taxonID: String
    taxonomicStatus: String
    vernacularName: String
    """
    Actual 'wikiData' type: WikiDataTaxonData
    """
    wikiData: JSON
  }
`;

export default typeDef;
