import { gql } from 'apollo-server';

const typeDef = gql`
  type ChecklistBankDataset {
    created: DateTime
    createdBy: Int
    modified: DateTime
    modifiedBy: Int
    key: Int
    type: String
    origin: String
    attempt: Int
    imported: DateTime
    gbifKey: ID
    gbifPublisherKey: ID
    size: Int
    """
    Stats about the dataset, defaulting to latest finished import
    """
    import(state: String, limit: Int): ChecklistBankImport
  }

  type ChecklistBankGbifMultimedia {
    dwcaID: Int
    dctermstype: Int
    dctermstitle: Int
    dctermsformat: Int
    dctermslicense: Int
    dctermsidentifier: Int
    dctermsreferences: Int
  }

  type ChecklistBankDwcTaxon {
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

  type ChecklistBankVerbatimByRowTypeCount {
    gbifMultimedia: ChecklistBankGbifMultimedia
    dwcTaxon: ChecklistBankDwcTaxon
  }

  type ChecklistBankVerbatimByTermCount {
    gbifMultimedia: Int
    dwcTaxon: Int
  }

  type ChecklistBankUsagesByOriginCount {
    source: Int
  }

  type ChecklistBankUsagesByStatusCount {
    accepted: Int
  }

  type ChecklistBankTaxaByRankCount {
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

  type ChecklistBankNamesByTypeCount {
    otu: Int
    scientific: Int
    informal: Int
    noname: Int
    placeholder: Int
    hybridformula: Int
  }

  type ChecklistBankNamesByStatusCount {
    notestablished: Int
  }

  type ChecklistBankNamesByRankCount {
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

  type ChecklistBankNamesByCodeCount {
    zoological: Int
  }

  type ChecklistBankMediaByTypeCount {
    image: Int
  }

  type ChecklistBankIssuesCount {
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

  type ChecklistBankImport {
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
    verbatimByRowTypeCount: ChecklistBankVerbatimByRowTypeCount
    verbatimByTermCount: ChecklistBankVerbatimByTermCount
    usagesByOriginCount: ChecklistBankUsagesByOriginCount
    usagesByStatusCount: ChecklistBankUsagesByStatusCount
    taxaByRankCount: ChecklistBankTaxaByRankCount
    namesByTypeCount: ChecklistBankNamesByTypeCount
    namesByStatusCount: ChecklistBankNamesByStatusCount
    namesByRankCount: ChecklistBankNamesByRankCount
    namesByCodeCount: ChecklistBankNamesByCodeCount
    mediaByTypeCount: ChecklistBankMediaByTypeCount
    issuesCount: ChecklistBankIssuesCount
  }
`;

export default typeDef;
