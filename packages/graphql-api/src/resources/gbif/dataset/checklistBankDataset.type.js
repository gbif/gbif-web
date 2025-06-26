import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    clbNameUsageSuggest(
      checklistKey: ID
      q: String!
      limit: Int
    ): [ClbNameUsageSuggestion]
  }

  type ClbDataset {
    created: DateTime
    createdBy: Int
    modified: DateTime
    modifiedBy: Int
    key: Int
    type: String
    origin: String
    attempt: Int
    imported: DateTime
    gbifPublisherKey: ID
    size: Int
    """
    Stats about the dataset, defaulting to latest finished import
    """
    import(state: String, limit: Int): ClbImport
  }

  type ClbNameUsageSuggestion {
    match: String
    usageId: ID
    acceptedUsageId: ID
    rank: String
    status: String
    nomCode: String
    suggestion: String
    context: String
    group: String
    taxGroup: ClbTaxGroup
    acceptedName: String
  }

  type ClbTaxGroup {
    description: String
    icon: String
    iconSVG: String
    name: String
    other: Boolean
    phylopic: String
    parents: [String]
    codes: [String]
  }

  type ClbVernacularName {
    datasetKey: ID
    name: String
    language: String
    referenceId: ID
    reference: ClbReference
  }

  type ClbReference {
    id: ID
    citation: String
  }

  type ClbGbifMultimedia {
    dwcaID: Int
    dctermstype: Int
    dctermstitle: Int
    dctermsformat: Int
    dctermslicense: Int
    dctermsidentifier: Int
    dctermsreferences: Int
  }

  type ClbDwcTaxon {
    dwcaID: Int
    dwctaxonID: Int
    dwctaxonRank: Int
    dwctaxonRemarks: Int
    dctermsreferences: Int
    dwcscientificName: Int
    dwcscientificNameID: Int
    dwcparentNameUsageID: Int
    dwcscientificNameAuthorship: Int
  }

  type ClbVerbatimByRowTypeCount {
    gbifMultimedia: ClbGbifMultimedia
    dwcTaxon: ClbDwcTaxon
  }

  type ClbVerbatimByTermCount {
    gbifMultimedia: Int
    dwcTaxon: Int
  }

  type ClbUsagesByOriginCount {
    source: Int
  }

  type ClbUsagesByStatusCount {
    accepted: Int
  }

  type ClbTaxaByRankCount {
    unranked: Int
    species: Int
    genus: Int
    subspecies: Int
    family: Int
    subfamily: Int
    order: Int
    class: Int
    phylum: Int
    kingdom: Int
  }

  type ClbNamesByTypeCount {
    otu: Int
    scientific: Int
    informal: Int
    noname: Int
    placeholder: Int
    hybridformula: Int
  }

  type ClbNamesByStatusCount {
    notestablished: Int
  }

  type ClbNamesByRankCount {
    unranked: Int
    species: Int
    genus: Int
    subspecies: Int
    family: Int
    subfamily: Int
    order: Int
    class: Int
    phylum: Int
    kingdom: Int
  }

  type ClbNamesByCodeCount {
    zoological: Int
  }

  type ClbMediaByTypeCount {
    image: Int
  }

  type ClbIssuesCount {
    partiallyparsablename: Int
    indetermined: Int
    urlinvalid: Int
    duplicatename: Int
    doubtfulname: Int
    unusualnamecharacters: Int
    subspeciesassigned: Int
    inconsistentname: Int
    escapedcharacters: Int
    unparsablename: Int
    unparsableauthorship: Int
    blacklistedepithet: Int
    parentnamemismatch: Int
    nomenclaturalstatusinvalid: Int
    unlikelyyear: Int
    authorshipcontainstaxonomicnote: Int
    unmatchednamebrackets: Int
    authorshipcontainsnomenclaturalnote: Int
    invisiblecharacters: Int
    citationunparsed: Int
    missinggenus: Int
    identifierwithoutscope: Int
    parentspeciesmissing: Int
  }

  type ClbImport {
    datasetKey: Int
    attempt: Int
    job: String
    state: String
    started: String
    finished: String
    createdBy: Int
    bareNameCount: Int
    distributionCount: Int
    estimateCount: Int
    mediaCount: Int
    nameCount: Int
    referenceCount: Int
    synonymCount: Int
    taxonCount: Int
    treatmentCount: Int
    typeMaterialCount: Int
    vernacularCount: Int
    downloadUri: String
    origin: String
    download: String
    md5: String
    verbatimCount: Int
    upload: Boolean
    nameRelationsCount: Int
    usagesCount: Int
    taxonConceptRelationsCount: Int
    speciesInteractionsCount: Int
    verbatimByRowTypeCount: ClbVerbatimByRowTypeCount
    verbatimByTermCount: ClbVerbatimByTermCount
    usagesByOriginCount: ClbUsagesByOriginCount
    usagesByStatusCount: ClbUsagesByStatusCount
    taxaByRankCount: ClbTaxaByRankCount
    namesByTypeCount: ClbNamesByTypeCount
    namesByStatusCount: ClbNamesByStatusCount
    namesByRankCount: ClbNamesByRankCount
    namesByCodeCount: ClbNamesByCodeCount
    mediaByTypeCount: ClbMediaByTypeCount
    issuesCount: ClbIssuesCount
  }
`;

export default typeDef;
