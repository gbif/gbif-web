/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: { input: any; output: any; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  GUID: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `Long` scalar type represents 52-bit integers */
  Long: { input: any; output: any; }
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: { input: any; output: any; }
};

export enum AccessionStatus {
  Institutional = 'INSTITUTIONAL',
  Project = 'PROJECT'
}

export type Address = {
  __typename?: 'Address';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Country>;
  key: Scalars['ID']['output'];
  postalCode?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
};

export enum AgentIdentifierType {
  Orcid = 'ORCID',
  Other = 'OTHER',
  Wikidata = 'WIKIDATA'
}

export type AlternativeCode = {
  __typename?: 'AlternativeCode';
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
};

export enum AppRole {
  App = 'APP',
  Ipt = 'IPT'
}

export type Article = {
  __typename?: 'Article';
  articleType?: Maybe<Scalars['String']['output']>;
  audiences?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  body?: Maybe<Scalars['String']['output']>;
  citation?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  displayDate?: Maybe<Scalars['Boolean']['output']>;
  documents?: Maybe<Array<Maybe<DocumentAsset>>>;
  excerpt?: Maybe<Scalars['String']['output']>;
  gbifHref: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  meta?: Maybe<Scalars['JSON']['output']>;
  primaryImage?: Maybe<AssetImage>;
  purposes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  secondaryLinks?: Maybe<Array<Maybe<Link>>>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  topics?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  urlAlias?: Maybe<Scalars['String']['output']>;
};

export type AssetImage = {
  __typename?: 'AssetImage';
  description?: Maybe<Scalars['String']['output']>;
  file: ImageFile;
  title?: Maybe<Scalars['String']['output']>;
};

export type AssociatedId = {
  __typename?: 'AssociatedID';
  person?: Maybe<Person>;
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};


export type AssociatedIdPersonArgs = {
  expand?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Author = {
  __typename?: 'Author';
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
};

export type AutoDateHistogramBucket = {
  __typename?: 'AutoDateHistogramBucket';
  count: Scalars['Long']['output'];
  date: Scalars['DateTime']['output'];
  key: Scalars['ID']['output'];
};

export type AutoDateHistogramResult = {
  __typename?: 'AutoDateHistogramResult';
  bucketSize: Scalars['Int']['output'];
  buckets?: Maybe<Array<Maybe<AutoDateHistogramBucket>>>;
  interval: Scalars['String']['output'];
};

export type BasionymAuthorship = {
  __typename?: 'BasionymAuthorship';
  authors?: Maybe<Scalars['String']['output']>;
  empty?: Maybe<Scalars['Boolean']['output']>;
  exAuthors?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

export enum BasisOfRecord {
  FossilSpecimen = 'FOSSIL_SPECIMEN',
  HumanObservation = 'HUMAN_OBSERVATION',
  Literature = 'LITERATURE',
  LivingSpecimen = 'LIVING_SPECIMEN',
  MachineObservation = 'MACHINE_OBSERVATION',
  MaterialCitation = 'MATERIAL_CITATION',
  MaterialSample = 'MATERIAL_SAMPLE',
  Observation = 'OBSERVATION',
  Occurrence = 'OCCURRENCE',
  PreservedSpecimen = 'PRESERVED_SPECIMEN',
  Unknown = 'UNKNOWN'
}

export type BibliographicCitation = {
  __typename?: 'BibliographicCitation';
  identifier?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
};

export type BionomiaOccurrence = {
  __typename?: 'BionomiaOccurrence';
  identified?: Maybe<Array<Maybe<BionomiaPerson>>>;
  recorded?: Maybe<Array<Maybe<BionomiaPerson>>>;
};

export type BionomiaPerson = {
  __typename?: 'BionomiaPerson';
  name?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
};

export type BlockItem = CarouselBlock | CustomComponentBlock | FeatureBlock | FeaturedTextBlock | HeaderBlock | MediaBlock | MediaCountBlock | TextBlock;

export type BoundingBox = {
  __typename?: 'BoundingBox';
  globalCoverage?: Maybe<Scalars['Boolean']['output']>;
  maxLatitude?: Maybe<Scalars['Float']['output']>;
  maxLongitude?: Maybe<Scalars['Float']['output']>;
  minLatitude?: Maybe<Scalars['Float']['output']>;
  minLongitude?: Maybe<Scalars['Float']['output']>;
};

export type Call = {
  __typename?: 'Call';
  acronym?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  meta?: Maybe<Scalars['JSON']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CarouselBlock = {
  __typename?: 'CarouselBlock';
  backgroundColour?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  features?: Maybe<Array<CarouselBlockFeature>>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type CarouselBlockFeature = MediaBlock | MediaCountBlock;

export type Certification = {
  __typename?: 'Certification';
  created?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['Int']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankDataset = {
  __typename?: 'ChecklistBankDataset';
  attempt?: Maybe<Scalars['Int']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['Int']['output']>;
  gbifKey?: Maybe<Scalars['ID']['output']>;
  gbifPublisherKey?: Maybe<Scalars['ID']['output']>;
  /** Stats about the dataset, defaulting to latest finished import */
  import?: Maybe<ChecklistBankImport>;
  imported?: Maybe<Scalars['DateTime']['output']>;
  key?: Maybe<Scalars['Int']['output']>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['Int']['output']>;
  origin?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};


export type ChecklistBankDatasetImportArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

export type ChecklistBankDwcTaxon = {
  __typename?: 'ChecklistBankDwcTaxon';
  dctermsreferences?: Maybe<Scalars['Int']['output']>;
  dwcaID?: Maybe<Scalars['Int']['output']>;
  dwcparentNameUsageID?: Maybe<Scalars['Int']['output']>;
  dwcscientificName?: Maybe<Scalars['Int']['output']>;
  dwcscientificNameAuthorship?: Maybe<Scalars['Int']['output']>;
  dwcscientificNameID?: Maybe<Scalars['Int']['output']>;
  dwctaxonID?: Maybe<Scalars['Int']['output']>;
  dwctaxonRank?: Maybe<Scalars['Int']['output']>;
  dwctaxonRemarks?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankGbifMultimedia = {
  __typename?: 'ChecklistBankGbifMultimedia';
  dctermsformat?: Maybe<Scalars['Int']['output']>;
  dctermsidentifier?: Maybe<Scalars['Int']['output']>;
  dctermslicense?: Maybe<Scalars['Int']['output']>;
  dctermsreferences?: Maybe<Scalars['Int']['output']>;
  dctermstitle?: Maybe<Scalars['Int']['output']>;
  dctermstype?: Maybe<Scalars['Int']['output']>;
  dwcaID?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankImport = {
  __typename?: 'ChecklistBankImport';
  attempt?: Maybe<Scalars['Int']['output']>;
  bareNameCount?: Maybe<Scalars['Int']['output']>;
  createdBy?: Maybe<Scalars['Int']['output']>;
  datasetKey?: Maybe<Scalars['Int']['output']>;
  distributionCount?: Maybe<Scalars['Int']['output']>;
  download?: Maybe<Scalars['String']['output']>;
  downloadUri?: Maybe<Scalars['String']['output']>;
  estimateCount?: Maybe<Scalars['Int']['output']>;
  finished?: Maybe<Scalars['String']['output']>;
  issuesCount?: Maybe<ChecklistBankIssuesCount>;
  job?: Maybe<Scalars['String']['output']>;
  md5?: Maybe<Scalars['String']['output']>;
  mediaByTypeCount?: Maybe<ChecklistBankMediaByTypeCount>;
  mediaCount?: Maybe<Scalars['Int']['output']>;
  nameCount?: Maybe<Scalars['Int']['output']>;
  nameRelationsCount?: Maybe<Scalars['Int']['output']>;
  namesByCodeCount?: Maybe<ChecklistBankNamesByCodeCount>;
  namesByRankCount?: Maybe<ChecklistBankNamesByRankCount>;
  namesByStatusCount?: Maybe<ChecklistBankNamesByStatusCount>;
  namesByTypeCount?: Maybe<ChecklistBankNamesByTypeCount>;
  origin?: Maybe<Scalars['String']['output']>;
  referenceCount?: Maybe<Scalars['Int']['output']>;
  speciesInteractionsCount?: Maybe<Scalars['Int']['output']>;
  started?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  synonymCount?: Maybe<Scalars['Int']['output']>;
  taxaByRankCount?: Maybe<ChecklistBankTaxaByRankCount>;
  taxonConceptRelationsCount?: Maybe<Scalars['Int']['output']>;
  taxonCount?: Maybe<Scalars['Int']['output']>;
  treatmentCount?: Maybe<Scalars['Int']['output']>;
  typeMaterialCount?: Maybe<Scalars['Int']['output']>;
  upload?: Maybe<Scalars['Boolean']['output']>;
  usagesByOriginCount?: Maybe<ChecklistBankUsagesByOriginCount>;
  usagesByStatusCount?: Maybe<ChecklistBankUsagesByStatusCount>;
  usagesCount?: Maybe<Scalars['Int']['output']>;
  verbatimByRowTypeCount?: Maybe<ChecklistBankVerbatimByRowTypeCount>;
  verbatimByTermCount?: Maybe<ChecklistBankVerbatimByTermCount>;
  verbatimCount?: Maybe<Scalars['Int']['output']>;
  vernacularCount?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankIssuesCount = {
  __typename?: 'ChecklistBankIssuesCount';
  authorshipcontainsnomenclaturalnote?: Maybe<Scalars['Int']['output']>;
  authorshipcontainstaxonomicnote?: Maybe<Scalars['Int']['output']>;
  blacklistedepithet?: Maybe<Scalars['Int']['output']>;
  citationunparsed?: Maybe<Scalars['Int']['output']>;
  doubtfulname?: Maybe<Scalars['Int']['output']>;
  duplicatename?: Maybe<Scalars['Int']['output']>;
  escapedcharacters?: Maybe<Scalars['Int']['output']>;
  identifierwithoutscope?: Maybe<Scalars['Int']['output']>;
  inconsistentname?: Maybe<Scalars['Int']['output']>;
  indetermined?: Maybe<Scalars['Int']['output']>;
  invisiblecharacters?: Maybe<Scalars['Int']['output']>;
  missinggenus?: Maybe<Scalars['Int']['output']>;
  nomenclaturalstatusinvalid?: Maybe<Scalars['Int']['output']>;
  parentnamemismatch?: Maybe<Scalars['Int']['output']>;
  parentspeciesmissing?: Maybe<Scalars['Int']['output']>;
  partiallyparsablename?: Maybe<Scalars['Int']['output']>;
  subspeciesassigned?: Maybe<Scalars['Int']['output']>;
  unlikelyyear?: Maybe<Scalars['Int']['output']>;
  unmatchednamebrackets?: Maybe<Scalars['Int']['output']>;
  unparsableauthorship?: Maybe<Scalars['Int']['output']>;
  unparsablename?: Maybe<Scalars['Int']['output']>;
  unusualnamecharacters?: Maybe<Scalars['Int']['output']>;
  urlinvalid?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankMediaByTypeCount = {
  __typename?: 'ChecklistBankMediaByTypeCount';
  image?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankNamesByCodeCount = {
  __typename?: 'ChecklistBankNamesByCodeCount';
  zoological?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankNamesByRankCount = {
  __typename?: 'ChecklistBankNamesByRankCount';
  class?: Maybe<Scalars['Int']['output']>;
  family?: Maybe<Scalars['Int']['output']>;
  genus?: Maybe<Scalars['Int']['output']>;
  kingdom?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  phylum?: Maybe<Scalars['Int']['output']>;
  species?: Maybe<Scalars['Int']['output']>;
  subfamily?: Maybe<Scalars['Int']['output']>;
  subspecies?: Maybe<Scalars['Int']['output']>;
  unranked?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankNamesByStatusCount = {
  __typename?: 'ChecklistBankNamesByStatusCount';
  notestablished?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankNamesByTypeCount = {
  __typename?: 'ChecklistBankNamesByTypeCount';
  hybridformula?: Maybe<Scalars['Int']['output']>;
  informal?: Maybe<Scalars['Int']['output']>;
  noname?: Maybe<Scalars['Int']['output']>;
  otu?: Maybe<Scalars['Int']['output']>;
  placeholder?: Maybe<Scalars['Int']['output']>;
  scientific?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankTaxaByRankCount = {
  __typename?: 'ChecklistBankTaxaByRankCount';
  class?: Maybe<Scalars['Int']['output']>;
  family?: Maybe<Scalars['Int']['output']>;
  genus?: Maybe<Scalars['Int']['output']>;
  kingdom?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  phylum?: Maybe<Scalars['Int']['output']>;
  species?: Maybe<Scalars['Int']['output']>;
  subfamily?: Maybe<Scalars['Int']['output']>;
  subspecies?: Maybe<Scalars['Int']['output']>;
  unranked?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankUsagesByOriginCount = {
  __typename?: 'ChecklistBankUsagesByOriginCount';
  source?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankUsagesByStatusCount = {
  __typename?: 'ChecklistBankUsagesByStatusCount';
  accepted?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistBankVerbatimByRowTypeCount = {
  __typename?: 'ChecklistBankVerbatimByRowTypeCount';
  dwcTaxon?: Maybe<ChecklistBankDwcTaxon>;
  gbifMultimedia?: Maybe<ChecklistBankGbifMultimedia>;
};

export type ChecklistBankVerbatimByTermCount = {
  __typename?: 'ChecklistBankVerbatimByTermCount';
  dwcTaxon?: Maybe<Scalars['Int']['output']>;
  gbifMultimedia?: Maybe<Scalars['Int']['output']>;
};

export type Citation = {
  __typename?: 'Citation';
  citationProvidedBySource?: Maybe<Scalars['Boolean']['output']>;
  text: Scalars['String']['output'];
};

export enum CitesAppendix {
  I = 'I',
  Ii = 'II',
  Iii = 'III'
}

export type Classification = {
  __typename?: 'Classification';
  key?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['String']['output']>;
  synonym?: Maybe<Scalars['Boolean']['output']>;
};

export type Collection = {
  __typename?: 'Collection';
  accessionStatus?: Maybe<AccessionStatus>;
  active?: Maybe<Scalars['Boolean']['output']>;
  address?: Maybe<Address>;
  alternativeCodes?: Maybe<Array<Maybe<AlternativeCode>>>;
  apiUrl?: Maybe<Scalars['URL']['output']>;
  catalogUrl?: Maybe<Scalars['URL']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  collectionSummary?: Maybe<Scalars['JSON']['output']>;
  comments?: Maybe<Comment>;
  contactPersons: Array<Maybe<ContactPerson>>;
  /** The contacts type is deprecated and will no longer be updated */
  contacts?: Maybe<Array<Maybe<StaffMember>>>;
  contentTypes?: Maybe<Array<Maybe<CollectionContentType>>>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  doi?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  excerpt?: Maybe<Scalars['String']['output']>;
  geography?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['URL']['output']>;
  identifiers?: Maybe<Array<Maybe<Identifier>>>;
  importantCollectors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  incorporatedCollections?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  indexHerbariorumRecord?: Maybe<Scalars['Boolean']['output']>;
  institution?: Maybe<Institution>;
  institutionKey?: Maybe<Scalars['ID']['output']>;
  key: Scalars['ID']['output'];
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  mailingAddress?: Maybe<Address>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  numberSpecimens?: Maybe<Scalars['Int']['output']>;
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  personalCollection?: Maybe<Scalars['Boolean']['output']>;
  phone?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  preservationTypes?: Maybe<Array<Maybe<PreservationType>>>;
  replacedBy?: Maybe<Scalars['ID']['output']>;
  replacedByCollection?: Maybe<Collection>;
  richness?: Maybe<Scalars['Float']['output']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  taxonomicCoverage?: Maybe<Scalars['String']['output']>;
};

export enum CollectionContentType {
  ArchaeologicalC14 = 'ARCHAEOLOGICAL_C14',
  ArchaeologicalCeramicArtifacts = 'ARCHAEOLOGICAL_CERAMIC_ARTIFACTS',
  ArchaeologicalCoprolites = 'ARCHAEOLOGICAL_COPROLITES',
  ArchaeologicalFaunalArtifacts = 'ARCHAEOLOGICAL_FAUNAL_ARTIFACTS',
  ArchaeologicalFaunalRemains = 'ARCHAEOLOGICAL_FAUNAL_REMAINS',
  ArchaeologicalFloralArtifacts = 'ARCHAEOLOGICAL_FLORAL_ARTIFACTS',
  ArchaeologicalFloralRemains = 'ARCHAEOLOGICAL_FLORAL_REMAINS',
  ArchaeologicalHumanRemains = 'ARCHAEOLOGICAL_HUMAN_REMAINS',
  ArchaeologicalLithicArtifacts = 'ARCHAEOLOGICAL_LITHIC_ARTIFACTS',
  ArchaeologicalMetalArtifacts = 'ARCHAEOLOGICAL_METAL_ARTIFACTS',
  ArchaeologicalOther = 'ARCHAEOLOGICAL_OTHER',
  ArchaeologicalTechonologicalProcessesRemains = 'ARCHAEOLOGICAL_TECHONOLOGICAL_PROCESSES_REMAINS',
  ArchaeologicalTextilesBasketry = 'ARCHAEOLOGICAL_TEXTILES_BASKETRY',
  ArchaeologicaWoodenArtifacts = 'ARCHAEOLOGICA_WOODEN_ARTIFACTS',
  BiologicalAnimalBuiltStructures = 'BIOLOGICAL_ANIMAL_BUILT_STRUCTURES',
  BiologicalAnimalDerived = 'BIOLOGICAL_ANIMAL_DERIVED',
  BiologicalBiofluids = 'BIOLOGICAL_BIOFLUIDS',
  BiologicalCellsTissue = 'BIOLOGICAL_CELLS_TISSUE',
  BiologicalEndoskeletons = 'BIOLOGICAL_ENDOSKELETONS',
  BiologicalExoskeletons = 'BIOLOGICAL_EXOSKELETONS',
  BiologicalFeces = 'BIOLOGICAL_FECES',
  BiologicalLivingCellOrTissueCultures = 'BIOLOGICAL_LIVING_CELL_OR_TISSUE_CULTURES',
  BiologicalLivingOrganisms = 'BIOLOGICAL_LIVING_ORGANISMS',
  BiologicalMolecularDerivates = 'BIOLOGICAL_MOLECULAR_DERIVATES',
  BiologicalOther = 'BIOLOGICAL_OTHER',
  BiologicalPlantDerived = 'BIOLOGICAL_PLANT_DERIVED',
  BiologicalPreservedOrganisms = 'BIOLOGICAL_PRESERVED_ORGANISMS',
  EarthPlanetaryAsteroids = 'EARTH_PLANETARY_ASTEROIDS',
  EarthPlanetaryComets = 'EARTH_PLANETARY_COMETS',
  EarthPlanetaryCosmicInterplanetaryDust = 'EARTH_PLANETARY_COSMIC_INTERPLANETARY_DUST',
  EarthPlanetaryGas = 'EARTH_PLANETARY_GAS',
  EarthPlanetaryGems = 'EARTH_PLANETARY_GEMS',
  EarthPlanetaryIce = 'EARTH_PLANETARY_ICE',
  EarthPlanetaryLunarMaterials = 'EARTH_PLANETARY_LUNAR_MATERIALS',
  EarthPlanetaryMetalsOres = 'EARTH_PLANETARY_METALS_ORES',
  EarthPlanetaryMeteorites = 'EARTH_PLANETARY_METEORITES',
  EarthPlanetaryMinerals = 'EARTH_PLANETARY_MINERALS',
  EarthPlanetaryOther = 'EARTH_PLANETARY_OTHER',
  EarthPlanetaryRocks = 'EARTH_PLANETARY_ROCKS',
  EarthPlanetarySediments = 'EARTH_PLANETARY_SEDIMENTS',
  EarthPlanetarySoils = 'EARTH_PLANETARY_SOILS',
  EarthPlanetarySpaceExposedMaterials = 'EARTH_PLANETARY_SPACE_EXPOSED_MATERIALS',
  EarthPlanetaryWater = 'EARTH_PLANETARY_WATER',
  HumanDerivedBiofluidsHuman = 'HUMAN_DERIVED_BIOFLUIDS_HUMAN',
  HumanDerivedBloodHuman = 'HUMAN_DERIVED_BLOOD_HUMAN',
  HumanDerivedCellsHuman = 'HUMAN_DERIVED_CELLS_HUMAN',
  HumanDerivedFecesHuman = 'HUMAN_DERIVED_FECES_HUMAN',
  HumanDerivedMolecularDerivatives = 'HUMAN_DERIVED_MOLECULAR_DERIVATIVES',
  HumanDerivedOther = 'HUMAN_DERIVED_OTHER',
  HumanDerivedTissueHuman = 'HUMAN_DERIVED_TISSUE_HUMAN',
  PaleontologicalConodonts = 'PALEONTOLOGICAL_CONODONTS',
  PaleontologicalInvertebrateFossils = 'PALEONTOLOGICAL_INVERTEBRATE_FOSSILS',
  PaleontologicalInvertebrateMicrofossils = 'PALEONTOLOGICAL_INVERTEBRATE_MICROFOSSILS',
  PaleontologicalOther = 'PALEONTOLOGICAL_OTHER',
  PaleontologicalPetrifiedWood = 'PALEONTOLOGICAL_PETRIFIED_WOOD',
  PaleontologicalPlantFossils = 'PALEONTOLOGICAL_PLANT_FOSSILS',
  PaleontologicalTraceFossils = 'PALEONTOLOGICAL_TRACE_FOSSILS',
  PaleontologicalVertebrateFossils = 'PALEONTOLOGICAL_VERTEBRATE_FOSSILS',
  RecordsAssociatedData = 'RECORDS_ASSOCIATED_DATA',
  RecordsDerivedData = 'RECORDS_DERIVED_DATA',
  RecordsDocumentation = 'RECORDS_DOCUMENTATION',
  RecordsDocuments = 'RECORDS_DOCUMENTS',
  RecordsImages = 'RECORDS_IMAGES',
  RecordsMaps = 'RECORDS_MAPS',
  RecordsOther = 'RECORDS_OTHER',
  RecordsRadiograph = 'RECORDS_RADIOGRAPH',
  RecordsRecordings = 'RECORDS_RECORDINGS',
  RecordsSeismograms = 'RECORDS_SEISMOGRAMS'
}

export type CollectionSearchResults = {
  __typename?: 'CollectionSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Collection>>;
};

export enum CollectionsSortField {
  NumberSpecimens = 'NUMBER_SPECIMENS'
}

export type CombinationAuthorship = {
  __typename?: 'CombinationAuthorship';
  authors?: Maybe<Scalars['String']['output']>;
  empty?: Maybe<Scalars['Boolean']['output']>;
  exAuthors?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

export type Comment = {
  __typename?: 'Comment';
  content?: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  key: Scalars['ID']['output'];
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
};

export type Composition = {
  __typename?: 'Composition';
  blocks?: Maybe<Array<BlockItem>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  machineIdentifier?: Maybe<Scalars['String']['output']>;
  primaryImage?: Maybe<AssetImage>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  urlAlias?: Maybe<Scalars['String']['output']>;
};

export type ConceptSearchResult = {
  __typename?: 'ConceptSearchResult';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<VocabularyConcept>>;
};

export type Contact = {
  __typename?: 'Contact';
  _highlighted?: Maybe<Scalars['Boolean']['output']>;
  address: Array<Maybe<Scalars['String']['output']>>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Country>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  firstName?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Array<Maybe<Scalars['URL']['output']>>>;
  key?: Maybe<Scalars['ID']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  position?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  postalCode?: Maybe<Scalars['String']['output']>;
  primary?: Maybe<Scalars['Boolean']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ContactPerson = {
  __typename?: 'ContactPerson';
  address: Array<Maybe<Scalars['String']['output']>>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Country>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  email: Array<Maybe<Scalars['String']['output']>>;
  fax: Array<Maybe<Scalars['String']['output']>>;
  firstName?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['ID']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  phone: Array<Maybe<Scalars['String']['output']>>;
  position: Array<Maybe<Scalars['String']['output']>>;
  postalCode?: Maybe<Scalars['String']['output']>;
  primary?: Maybe<Scalars['Boolean']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  taxonomicExpertise: Array<Maybe<Scalars['String']['output']>>;
  userIds: Array<Maybe<UserId>>;
};

export enum ContactType {
  AdditionalDelegate = 'ADDITIONAL_DELEGATE',
  AdministrativePointOfContact = 'ADMINISTRATIVE_POINT_OF_CONTACT',
  Author = 'AUTHOR',
  ContentProvider = 'CONTENT_PROVIDER',
  Curator = 'CURATOR',
  CustodianSteward = 'CUSTODIAN_STEWARD',
  DataAdministrator = 'DATA_ADMINISTRATOR',
  Distributor = 'DISTRIBUTOR',
  Editor = 'EDITOR',
  HeadOfDelegation = 'HEAD_OF_DELEGATION',
  MetadataAuthor = 'METADATA_AUTHOR',
  NodeManager = 'NODE_MANAGER',
  NodeStaff = 'NODE_STAFF',
  Originator = 'ORIGINATOR',
  Owner = 'OWNER',
  PointOfContact = 'POINT_OF_CONTACT',
  PrincipalInvestigator = 'PRINCIPAL_INVESTIGATOR',
  Processor = 'PROCESSOR',
  Programmer = 'PROGRAMMER',
  Publisher = 'PUBLISHER',
  RegionalNodeRepresentative = 'REGIONAL_NODE_REPRESENTATIVE',
  Reviewer = 'REVIEWER',
  SystemAdministrator = 'SYSTEM_ADMINISTRATOR',
  TechnicalPointOfContact = 'TECHNICAL_POINT_OF_CONTACT',
  TemporaryDelegate = 'TEMPORARY_DELEGATE',
  TemporaryHeadOfDelegation = 'TEMPORARY_HEAD_OF_DELEGATION',
  User = 'USER'
}

export type ContactsCitation = {
  __typename?: 'ContactsCitation';
  abbreviatedName?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  key: Scalars['Int']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  userId?: Maybe<Array<Maybe<Scalars['URL']['output']>>>;
};

export enum ContentType {
  Article = 'ARTICLE',
  Composition = 'COMPOSITION',
  DataUse = 'DATA_USE',
  Document = 'DOCUMENT',
  Event = 'EVENT',
  Help = 'HELP',
  Literature = 'LITERATURE',
  News = 'NEWS',
  Notification = 'NOTIFICATION',
  Project = 'PROJECT',
  Tool = 'TOOL'
}

export enum Continent {
  Africa = 'AFRICA',
  Antarctica = 'ANTARCTICA',
  Asia = 'ASIA',
  Europe = 'EUROPE',
  NorthAmerica = 'NORTH_AMERICA',
  Oceania = 'OCEANIA',
  SouthAmerica = 'SOUTH_AMERICA'
}

export type Coordinates = {
  __typename?: 'Coordinates';
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
};

export enum Country {
  Aa = 'AA',
  Ad = 'AD',
  Ae = 'AE',
  Af = 'AF',
  Ag = 'AG',
  Ai = 'AI',
  Al = 'AL',
  Am = 'AM',
  Ao = 'AO',
  Aq = 'AQ',
  Ar = 'AR',
  As = 'AS',
  At = 'AT',
  Au = 'AU',
  Aw = 'AW',
  Ax = 'AX',
  Az = 'AZ',
  Ba = 'BA',
  Bb = 'BB',
  Bd = 'BD',
  Be = 'BE',
  Bf = 'BF',
  Bg = 'BG',
  Bh = 'BH',
  Bi = 'BI',
  Bj = 'BJ',
  Bl = 'BL',
  Bm = 'BM',
  Bn = 'BN',
  Bo = 'BO',
  Bq = 'BQ',
  Br = 'BR',
  Bs = 'BS',
  Bt = 'BT',
  Bv = 'BV',
  Bw = 'BW',
  By = 'BY',
  Bz = 'BZ',
  Ca = 'CA',
  Cc = 'CC',
  Cd = 'CD',
  Cf = 'CF',
  Cg = 'CG',
  Ch = 'CH',
  Ci = 'CI',
  Ck = 'CK',
  Cl = 'CL',
  Cm = 'CM',
  Cn = 'CN',
  Co = 'CO',
  Cr = 'CR',
  Cu = 'CU',
  Cv = 'CV',
  Cw = 'CW',
  Cx = 'CX',
  Cy = 'CY',
  Cz = 'CZ',
  De = 'DE',
  Dj = 'DJ',
  Dk = 'DK',
  Dm = 'DM',
  Do = 'DO',
  Dz = 'DZ',
  Ec = 'EC',
  Ee = 'EE',
  Eg = 'EG',
  Eh = 'EH',
  Er = 'ER',
  Es = 'ES',
  Et = 'ET',
  Fi = 'FI',
  Fj = 'FJ',
  Fk = 'FK',
  Fm = 'FM',
  Fo = 'FO',
  Fr = 'FR',
  Ga = 'GA',
  Gb = 'GB',
  Gd = 'GD',
  Ge = 'GE',
  Gf = 'GF',
  Gg = 'GG',
  Gh = 'GH',
  Gi = 'GI',
  Gl = 'GL',
  Gm = 'GM',
  Gn = 'GN',
  Gp = 'GP',
  Gq = 'GQ',
  Gr = 'GR',
  Gs = 'GS',
  Gt = 'GT',
  Gu = 'GU',
  Gw = 'GW',
  Gy = 'GY',
  Hk = 'HK',
  Hm = 'HM',
  Hn = 'HN',
  Hr = 'HR',
  Ht = 'HT',
  Hu = 'HU',
  Id = 'ID',
  Ie = 'IE',
  Il = 'IL',
  Im = 'IM',
  In = 'IN',
  Io = 'IO',
  Iq = 'IQ',
  Ir = 'IR',
  Is = 'IS',
  It = 'IT',
  Je = 'JE',
  Jm = 'JM',
  Jo = 'JO',
  Jp = 'JP',
  Ke = 'KE',
  Kg = 'KG',
  Kh = 'KH',
  Ki = 'KI',
  Km = 'KM',
  Kn = 'KN',
  Kp = 'KP',
  Kr = 'KR',
  Kw = 'KW',
  Ky = 'KY',
  Kz = 'KZ',
  La = 'LA',
  Lb = 'LB',
  Lc = 'LC',
  Li = 'LI',
  Lk = 'LK',
  Lr = 'LR',
  Ls = 'LS',
  Lt = 'LT',
  Lu = 'LU',
  Lv = 'LV',
  Ly = 'LY',
  Ma = 'MA',
  Mc = 'MC',
  Md = 'MD',
  Me = 'ME',
  Mf = 'MF',
  Mg = 'MG',
  Mh = 'MH',
  Mk = 'MK',
  Ml = 'ML',
  Mm = 'MM',
  Mn = 'MN',
  Mo = 'MO',
  Mp = 'MP',
  Mq = 'MQ',
  Mr = 'MR',
  Ms = 'MS',
  Mt = 'MT',
  Mu = 'MU',
  Mv = 'MV',
  Mw = 'MW',
  Mx = 'MX',
  My = 'MY',
  Mz = 'MZ',
  Na = 'NA',
  Nc = 'NC',
  Ne = 'NE',
  Nf = 'NF',
  Ng = 'NG',
  Ni = 'NI',
  Nl = 'NL',
  No = 'NO',
  Np = 'NP',
  Nr = 'NR',
  Nu = 'NU',
  Nz = 'NZ',
  Om = 'OM',
  Pa = 'PA',
  Pe = 'PE',
  Pf = 'PF',
  Pg = 'PG',
  Ph = 'PH',
  Pk = 'PK',
  Pl = 'PL',
  Pm = 'PM',
  Pn = 'PN',
  Pr = 'PR',
  Ps = 'PS',
  Pt = 'PT',
  Pw = 'PW',
  Py = 'PY',
  Qa = 'QA',
  Re = 'RE',
  Ro = 'RO',
  Rs = 'RS',
  Ru = 'RU',
  Rw = 'RW',
  Sa = 'SA',
  Sb = 'SB',
  Sc = 'SC',
  Sd = 'SD',
  Se = 'SE',
  Sg = 'SG',
  Sh = 'SH',
  Si = 'SI',
  Sj = 'SJ',
  Sk = 'SK',
  Sl = 'SL',
  Sm = 'SM',
  Sn = 'SN',
  So = 'SO',
  Sr = 'SR',
  Ss = 'SS',
  St = 'ST',
  Sv = 'SV',
  Sx = 'SX',
  Sy = 'SY',
  Sz = 'SZ',
  Tc = 'TC',
  Td = 'TD',
  Tf = 'TF',
  Tg = 'TG',
  Th = 'TH',
  Tj = 'TJ',
  Tk = 'TK',
  Tl = 'TL',
  Tm = 'TM',
  Tn = 'TN',
  To = 'TO',
  Tr = 'TR',
  Tt = 'TT',
  Tv = 'TV',
  Tw = 'TW',
  Tz = 'TZ',
  Ua = 'UA',
  Ug = 'UG',
  Um = 'UM',
  Us = 'US',
  Uy = 'UY',
  Uz = 'UZ',
  Va = 'VA',
  Vc = 'VC',
  Ve = 'VE',
  Vg = 'VG',
  Vi = 'VI',
  Vn = 'VN',
  Vu = 'VU',
  Wf = 'WF',
  Ws = 'WS',
  Xk = 'XK',
  Xz = 'XZ',
  Ye = 'YE',
  Yt = 'YT',
  Za = 'ZA',
  Zm = 'ZM',
  Zw = 'ZW',
  Zz = 'ZZ'
}

export enum CountryUsageSortField {
  CountryCode = 'COUNTRY_CODE',
  RecordCount = 'RECORD_COUNT'
}

export type CustomComponentBlock = {
  __typename?: 'CustomComponentBlock';
  backgroundColour?: Maybe<Scalars['String']['output']>;
  componentType?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  settings?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['String']['output']>;
};

export type DataDescription = {
  __typename?: 'DataDescription';
  charset?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  formatVersion?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type DataUse = {
  __typename?: 'DataUse';
  audiences?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  body?: Maybe<Scalars['String']['output']>;
  citation?: Maybe<Scalars['String']['output']>;
  countriesOfCoverage?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  countriesOfResearcher?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  gbifHref: Scalars['String']['output'];
  gbifRegion?: Maybe<Array<Maybe<GbifRegion>>>;
  homepage?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  meta?: Maybe<Scalars['JSON']['output']>;
  primaryImage?: Maybe<AssetImage>;
  primaryLink?: Maybe<Link>;
  purposes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  resourceUsed?: Maybe<Scalars['String']['output']>;
  searchable?: Maybe<Scalars['Boolean']['output']>;
  secondaryLinks?: Maybe<Array<Maybe<Link>>>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  topics?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Dataset = {
  __typename?: 'Dataset';
  additionalInfo?: Maybe<Scalars['String']['output']>;
  bibliographicCitations?: Maybe<Array<Maybe<BibliographicCitation>>>;
  /** Get the dataset as it looks like in checklist bank. Only available for checklists. And not for all of them. */
  checklistBankDataset?: Maybe<ChecklistBankDataset>;
  citation?: Maybe<Citation>;
  collections?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  comments?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  constituents?: Maybe<DatasetListResults>;
  contacts?: Maybe<Array<Maybe<Contact>>>;
  contactsCitation?: Maybe<Array<ContactsCitation>>;
  countryCoverage?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  curatorialUnits?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  dataDescriptions?: Maybe<Array<Maybe<DataDescription>>>;
  dataLanguage?: Maybe<Scalars['String']['output']>;
  decades?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  doi?: Maybe<Scalars['String']['output']>;
  duplicateOfDataset?: Maybe<Dataset>;
  duplicateOfDatasetKey?: Maybe<Scalars['ID']['output']>;
  endpoints?: Maybe<Array<Maybe<Endpoint>>>;
  /** volatile shortened version of the description */
  excerpt?: Maybe<Scalars['String']['output']>;
  external?: Maybe<Scalars['Boolean']['output']>;
  geographicCoverages?: Maybe<Array<Maybe<GeographicCoverage>>>;
  gridded?: Maybe<Array<Maybe<GridMetric>>>;
  homepage?: Maybe<Scalars['URL']['output']>;
  identifiers?: Maybe<Array<Maybe<Identifier>>>;
  installation?: Maybe<Installation>;
  installationKey?: Maybe<Scalars['ID']['output']>;
  key: Scalars['ID']['output'];
  keywordCollections?: Maybe<Array<Maybe<KeywordCollection>>>;
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  language?: Maybe<Language>;
  license?: Maybe<Scalars['String']['output']>;
  lockedForAutoUpdate?: Maybe<Scalars['Boolean']['output']>;
  /** Link to homepage with crawling logs. */
  logInterfaceUrl?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['URL']['output']>;
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  maintenanceDescription?: Maybe<Scalars['String']['output']>;
  maintenanceUpdateFrequency?: Maybe<MaintenanceUpdateFrequency>;
  mapCapabilities?: Maybe<MapCapabilities>;
  metrics?: Maybe<DatasetChecklistMetrics>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  networks: Array<Maybe<Network>>;
  numConstituents?: Maybe<Scalars['Int']['output']>;
  parentDataset?: Maybe<Dataset>;
  parentDatasetKey?: Maybe<Scalars['ID']['output']>;
  project?: Maybe<Project>;
  projectIdentifier?: Maybe<Scalars['ID']['output']>;
  pubDate?: Maybe<Scalars['DateTime']['output']>;
  publishingCountry?: Maybe<Country>;
  publishingOrganization?: Maybe<Organization>;
  publishingOrganizationKey: Scalars['ID']['output'];
  publishingOrganizationTitle?: Maybe<Scalars['String']['output']>;
  purpose?: Maybe<Scalars['String']['output']>;
  samplingDescription?: Maybe<SamplingDescription>;
  subtype?: Maybe<DatasetSubtype>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  taxonomicCoverages?: Maybe<Array<Maybe<TaxonomicCoverage>>>;
  temporalCoverages?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<DatasetType>;
  volatileContributors?: Maybe<Array<Maybe<Contact>>>;
};


export type DatasetConstituentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetGriddedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type DatasetBreakdown = {
  __typename?: 'DatasetBreakdown';
  count?: Maybe<Scalars['Int']['output']>;
  dataset?: Maybe<Dataset>;
  name?: Maybe<Scalars['String']['output']>;
};

export type DatasetChecklistMetrics = {
  __typename?: 'DatasetChecklistMetrics';
  colCoveragePct?: Maybe<Scalars['Int']['output']>;
  colMatchingCount?: Maybe<Scalars['Int']['output']>;
  countByConstituent?: Maybe<Scalars['JSON']['output']>;
  countByIssue?: Maybe<Scalars['JSON']['output']>;
  countByKingdom?: Maybe<Scalars['JSON']['output']>;
  countByOrigin?: Maybe<Scalars['JSON']['output']>;
  countByRank?: Maybe<Scalars['JSON']['output']>;
  countExtRecordsByExtension?: Maybe<Scalars['JSON']['output']>;
  countNamesByLanguage?: Maybe<Scalars['JSON']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  datasetKey?: Maybe<Scalars['ID']['output']>;
  distinctNamesCount?: Maybe<Scalars['Int']['output']>;
  downloaded?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  nubCoveragePct?: Maybe<Scalars['Int']['output']>;
  nubMatchingCount?: Maybe<Scalars['Int']['output']>;
  otherCount?: Maybe<Scalars['JSON']['output']>;
  synonymsCount?: Maybe<Scalars['Int']['output']>;
  usagesCount?: Maybe<Scalars['Int']['output']>;
};

export type DatasetDownload = {
  __typename?: 'DatasetDownload';
  datasetCitation?: Maybe<Scalars['String']['output']>;
  datasetDOI?: Maybe<Scalars['String']['output']>;
  datasetKey?: Maybe<Scalars['ID']['output']>;
  datasetTitle?: Maybe<Scalars['String']['output']>;
  download?: Maybe<Download>;
  downloadKey: Scalars['ID']['output'];
  numberRecords?: Maybe<Scalars['Int']['output']>;
};

export type DatasetDownloadListResults = {
  __typename?: 'DatasetDownloadListResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<DatasetDownload>>;
};

export type DatasetFacet = {
  __typename?: 'DatasetFacet';
  decade?: Maybe<Array<Maybe<DatasetFacetResult>>>;
  hostingOrg?: Maybe<Array<Maybe<DatasetOrganizationFacet>>>;
  keyword?: Maybe<Array<Maybe<DatasetFacetResult>>>;
  license?: Maybe<Array<Maybe<DatasetFacetResult>>>;
  projectId?: Maybe<Array<Maybe<DatasetFacetResult>>>;
  publishingCountry?: Maybe<Array<Maybe<DatasetFacetResult>>>;
  publishingOrg?: Maybe<Array<Maybe<DatasetOrganizationFacet>>>;
  type?: Maybe<Array<Maybe<DatasetFacetResult>>>;
};


export type DatasetFacetDecadeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetFacetHostingOrgArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetFacetKeywordArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetFacetLicenseArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetFacetProjectIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetFacetPublishingCountryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetFacetPublishingOrgArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetFacetTypeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type DatasetFacetResult = {
  __typename?: 'DatasetFacetResult';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type DatasetListResults = {
  __typename?: 'DatasetListResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Dataset>;
};

export type DatasetOrganizationFacet = {
  __typename?: 'DatasetOrganizationFacet';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organization?: Maybe<Organization>;
};

export type DatasetSearchResults = {
  __typename?: 'DatasetSearchResults';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  facet?: Maybe<DatasetFacet>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<DatasetSearchStub>;
};

export type DatasetSearchStub = {
  __typename?: 'DatasetSearchStub';
  dataset?: Maybe<Dataset>;
  decades?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  description?: Maybe<Scalars['String']['output']>;
  doi?: Maybe<Scalars['String']['output']>;
  /** volatile shortened version of the description */
  excerpt?: Maybe<Scalars['String']['output']>;
  hostingOrganization?: Maybe<Organization>;
  hostingOrganizationKey?: Maybe<Scalars['ID']['output']>;
  hostingOrganizationTitle?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  license?: Maybe<Scalars['String']['output']>;
  literatureCount?: Maybe<Scalars['Int']['output']>;
  logoUrl?: Maybe<Scalars['URL']['output']>;
  mapCapabilities?: Maybe<MapCapabilities>;
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  publishingCountry?: Maybe<Country>;
  publishingOrganization?: Maybe<Organization>;
  publishingOrganizationKey: Scalars['ID']['output'];
  publishingOrganizationTitle?: Maybe<Scalars['String']['output']>;
  recordCount?: Maybe<Scalars['Int']['output']>;
  subtype?: Maybe<DatasetSubtype>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<DatasetType>;
};

export enum DatasetSubtype {
  DerivedFromOccurrence = 'DERIVED_FROM_OCCURRENCE',
  GlobalSpeciesDataset = 'GLOBAL_SPECIES_DATASET',
  InventoryRegional = 'INVENTORY_REGIONAL',
  InventoryThematic = 'INVENTORY_THEMATIC',
  NomenclatorAuthority = 'NOMENCLATOR_AUTHORITY',
  Observation = 'OBSERVATION',
  Specimen = 'SPECIMEN',
  TaxonomicAuthority = 'TAXONOMIC_AUTHORITY'
}

export enum DatasetType {
  Checklist = 'CHECKLIST',
  MaterialEntity = 'MATERIAL_ENTITY',
  Metadata = 'METADATA',
  Occurrence = 'OCCURRENCE',
  SamplingEvent = 'SAMPLING_EVENT'
}

export enum DatasetUsageSortField {
  CountryCode = 'COUNTRY_CODE',
  DatasetTitle = 'DATASET_TITLE',
  RecordCount = 'RECORD_COUNT'
}

export type Diagnostics = {
  __typename?: 'Diagnostics';
  matchType?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type DirectoryContact = {
  __typename?: 'DirectoryContact';
  address?: Maybe<Scalars['String']['output']>;
  areasExpertise?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  certifications?: Maybe<Array<Maybe<Certification>>>;
  countryCode?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institutionName?: Maybe<Scalars['String']['output']>;
  jobTitle?: Maybe<Scalars['String']['output']>;
  languages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  orcidId?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  profileDescriptions?: Maybe<Array<Maybe<ProfileDescription>>>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<DirectoryPersonRole>>>;
  secondaryEmail?: Maybe<Scalars['String']['output']>;
  skype?: Maybe<Scalars['String']['output']>;
  surname?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type DirectoryContactProfilePictureArgs = {
  base64?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DirectoryPerson = {
  __typename?: 'DirectoryPerson';
  areasExpertise?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  certifications?: Maybe<Array<Maybe<Certification>>>;
  countryCode?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institutionName?: Maybe<Scalars['String']['output']>;
  jobTitle?: Maybe<Scalars['String']['output']>;
  languages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  orcidId?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  profileDescriptions?: Maybe<Array<Maybe<ProfileDescription>>>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<DirectoryPersonRole>>>;
  surname?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type DirectoryPersonProfilePictureArgs = {
  base64?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DirectoryPersonRole = {
  __typename?: 'DirectoryPersonRole';
  Person?: Maybe<DirectoryPerson>;
  award?: Maybe<Scalars['String']['output']>;
  personId?: Maybe<Scalars['Int']['output']>;
  programme?: Maybe<Scalars['String']['output']>;
  relationshipId?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  term?: Maybe<DirectoryTerm>;
};

export type DirectoryPersonRoleSearchResults = {
  __typename?: 'DirectoryPersonRoleSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<DirectoryPersonRole>>;
};

export type DirectoryTerm = {
  __typename?: 'DirectoryTerm';
  end?: Maybe<Scalars['String']['output']>;
  start?: Maybe<Scalars['String']['output']>;
};

export enum Discipline {
  Agricultural = 'AGRICULTURAL',
  AgriculturalAgriculturalAnimalBreeding = 'AGRICULTURAL_AGRICULTURAL_ANIMAL_BREEDING',
  AgriculturalAgriculturalHorticulturalPlantBreeding = 'AGRICULTURAL_AGRICULTURAL_HORTICULTURAL_PLANT_BREEDING',
  AgriculturalAgronomyCropScience = 'AGRICULTURAL_AGRONOMY_CROP_SCIENCE',
  AgriculturalAnimalScience = 'AGRICULTURAL_ANIMAL_SCIENCE',
  AgriculturalAnimalSciencePoultry = 'AGRICULTURAL_ANIMAL_SCIENCE_POULTRY',
  AgriculturalEnvironmentalScience = 'AGRICULTURAL_ENVIRONMENTAL_SCIENCE',
  AgriculturalFishingFisheriesScience = 'AGRICULTURAL_FISHING_FISHERIES_SCIENCE',
  AgriculturalFoodScienceAndTechnology = 'AGRICULTURAL_FOOD_SCIENCE_AND_TECHNOLOGY',
  AgriculturalForestSciencesAndForestry = 'AGRICULTURAL_FOREST_SCIENCES_AND_FORESTRY',
  AgriculturalHorticulturalScience = 'AGRICULTURAL_HORTICULTURAL_SCIENCE',
  AgriculturalNaturalResources = 'AGRICULTURAL_NATURAL_RESOURCES',
  AgriculturalPlantSciences = 'AGRICULTURAL_PLANT_SCIENCES',
  AgriculturalSoilChemistryMicrobiology = 'AGRICULTURAL_SOIL_CHEMISTRY_MICROBIOLOGY',
  AgriculturalSoilSciences = 'AGRICULTURAL_SOIL_SCIENCES',
  AgriculturalWildlifeRangeManagement = 'AGRICULTURAL_WILDLIFE_RANGE_MANAGEMENT',
  AgriculturalWoodScienceAndPulpTechnology = 'AGRICULTURAL_WOOD_SCIENCE_AND_PULP_TECHNOLOGY',
  Anthropology = 'ANTHROPOLOGY',
  AnthropologyBiological = 'ANTHROPOLOGY_BIOLOGICAL',
  AnthropologyCultural = 'ANTHROPOLOGY_CULTURAL',
  AnthropologyLinguistic = 'ANTHROPOLOGY_LINGUISTIC',
  Archaeology = 'ARCHAEOLOGY',
  ArchaeologyHistoric = 'ARCHAEOLOGY_HISTORIC',
  ArchaeologyPrehistoric = 'ARCHAEOLOGY_PREHISTORIC',
  ArchaeologyUnderwater = 'ARCHAEOLOGY_UNDERWATER',
  Atmospheric = 'ATMOSPHERIC',
  AtmosphericClimatology = 'ATMOSPHERIC_CLIMATOLOGY',
  AtmosphericMeteorology = 'ATMOSPHERIC_METEOROLOGY',
  AtmosphericPhysicsDynamics = 'ATMOSPHERIC_PHYSICS_DYNAMICS',
  Biological = 'BIOLOGICAL',
  BiologicalAnatomyAndPhysiology = 'BIOLOGICAL_ANATOMY_AND_PHYSIOLOGY',
  BiologicalCellularBiologyAndHistology = 'BIOLOGICAL_CELLULAR_BIOLOGY_AND_HISTOLOGY',
  BiologicalDevelopmentBiologyEmbryology = 'BIOLOGICAL_DEVELOPMENT_BIOLOGY_EMBRYOLOGY',
  BiologicalEcology = 'BIOLOGICAL_ECOLOGY',
  BiologicalEnvironmentalToxicology = 'BIOLOGICAL_ENVIRONMENTAL_TOXICOLOGY',
  BiologicalEvolutionaryBiology = 'BIOLOGICAL_EVOLUTIONARY_BIOLOGY',
  BiologicalGeneticsGenomics = 'BIOLOGICAL_GENETICS_GENOMICS',
  BiologicalMicrobiologyBacteriologyVirology = 'BIOLOGICAL_MICROBIOLOGY_BACTERIOLOGY_VIROLOGY',
  BiologicalMolecularBiology = 'BIOLOGICAL_MOLECULAR_BIOLOGY',
  BiologicalNeurosciencesAndNeurobiology = 'BIOLOGICAL_NEUROSCIENCES_AND_NEUROBIOLOGY',
  BiologicalParasitology = 'BIOLOGICAL_PARASITOLOGY',
  BiologicalPathologyAnimalPlant = 'BIOLOGICAL_PATHOLOGY_ANIMAL_PLANT',
  BiologicalTaxonomy = 'BIOLOGICAL_TAXONOMY',
  BiologicalZoology = 'BIOLOGICAL_ZOOLOGY',
  Chemical = 'CHEMICAL',
  ChemicalAnalytical = 'CHEMICAL_ANALYTICAL',
  ChemicalAstrochemistry = 'CHEMICAL_ASTROCHEMISTRY',
  ChemicalAtmosphericChemistry = 'CHEMICAL_ATMOSPHERIC_CHEMISTRY',
  ChemicalBiochemistry = 'CHEMICAL_BIOCHEMISTRY',
  ChemicalBiogeochemistry = 'CHEMICAL_BIOGEOCHEMISTRY',
  ChemicalCosmochemistry = 'CHEMICAL_COSMOCHEMISTRY',
  ChemicalInorganicChemistry = 'CHEMICAL_INORGANIC_CHEMISTRY',
  ChemicalNuclearChemistry = 'CHEMICAL_NUCLEAR_CHEMISTRY',
  ChemicalOrganicChemistry = 'CHEMICAL_ORGANIC_CHEMISTRY',
  ChemicalPhysicalChemistry = 'CHEMICAL_PHYSICAL_CHEMISTRY',
  Geological = 'GEOLOGICAL',
  GeologicalEconomicGeologyMineralResources = 'GEOLOGICAL_ECONOMIC_GEOLOGY_MINERAL_RESOURCES',
  GeologicalEnergyResourceGeology = 'GEOLOGICAL_ENERGY_RESOURCE_GEOLOGY',
  GeologicalGeochemistry = 'GEOLOGICAL_GEOCHEMISTRY',
  GeologicalGeology = 'GEOLOGICAL_GEOLOGY',
  GeologicalGeophysicsSeismology = 'GEOLOGICAL_GEOPHYSICS_SEISMOLOGY',
  GeologicalHydrologyWaterResources = 'GEOLOGICAL_HYDROLOGY_WATER_RESOURCES',
  GeologicalMineralogyPetrology = 'GEOLOGICAL_MINERALOGY_PETROLOGY',
  GeologicalPaleontology = 'GEOLOGICAL_PALEONTOLOGY',
  GeologicalVolcanology = 'GEOLOGICAL_VOLCANOLOGY',
  Health = 'HEALTH',
  HealthBiomedicalScience = 'HEALTH_BIOMEDICAL_SCIENCE',
  HealthEnvironmentalHealth = 'HEALTH_ENVIRONMENTAL_HEALTH',
  HealthEpidemiologyPublicHealth = 'HEALTH_EPIDEMIOLOGY_PUBLIC_HEALTH',
  HealthGeneticsGenomics = 'HEALTH_GENETICS_GENOMICS',
  HealthMicrobiologyBacteriologyVirology = 'HEALTH_MICROBIOLOGY_BACTERIOLOGY_VIROLOGY',
  HealthNeurosciencesAndNeurobiology = 'HEALTH_NEUROSCIENCES_AND_NEUROBIOLOGY',
  HealthNutritionSciences = 'HEALTH_NUTRITION_SCIENCES',
  HealthPathologyHuman = 'HEALTH_PATHOLOGY_HUMAN',
  HealthPharmaceuticalMedicinalSciences = 'HEALTH_PHARMACEUTICAL_MEDICINAL_SCIENCES',
  HealthPharmacologyHumanAndAnimal = 'HEALTH_PHARMACOLOGY_HUMAN_AND_ANIMAL',
  HealthToxicology = 'HEALTH_TOXICOLOGY',
  HealthVeterinarySciences = 'HEALTH_VETERINARY_SCIENCES',
  Material = 'MATERIAL',
  Ocean = 'OCEAN',
  OceanMarineBiologyAndBiologicalOceanography = 'OCEAN_MARINE_BIOLOGY_AND_BIOLOGICAL_OCEANOGRAPHY',
  OceanMarineGeologyAndPaleoceanography = 'OCEAN_MARINE_GEOLOGY_AND_PALEOCEANOGRAPHY',
  OceanOceanographyChemicalPhysical = 'OCEAN_OCEANOGRAPHY_CHEMICAL_PHYSICAL',
  Physics = 'PHYSICS',
  PhysicsAcoustics = 'PHYSICS_ACOUSTICS',
  PhysicsAppliedPhysics = 'PHYSICS_APPLIED_PHYSICS',
  PhysicsAtomicMolecularChemicalPhysics = 'PHYSICS_ATOMIC_MOLECULAR_CHEMICAL_PHYSICS',
  PhysicsBiophysics = 'PHYSICS_BIOPHYSICS',
  PhysicsMedicalRadiological = 'PHYSICS_MEDICAL_RADIOLOGICAL',
  PhysicsNuclearPhysics = 'PHYSICS_NUCLEAR_PHYSICS',
  PhysicsOpticsPhotonics = 'PHYSICS_OPTICS_PHOTONICS',
  PhysicsParticlePhysics = 'PHYSICS_PARTICLE_PHYSICS',
  Space = 'SPACE',
  SpaceAstronomy = 'SPACE_ASTRONOMY',
  SpaceAstrophysics = 'SPACE_ASTROPHYSICS',
  SpaceCosmology = 'SPACE_COSMOLOGY',
  SpacePlanetaryScience = 'SPACE_PLANETARY_SCIENCE'
}

export enum DistributionStatus {
  Absent = 'ABSENT',
  Common = 'COMMON',
  Doubtful = 'DOUBTFUL',
  Excluded = 'EXCLUDED',
  Irregular = 'IRREGULAR',
  Present = 'PRESENT',
  Rare = 'RARE'
}

export type Document = {
  __typename?: 'Document';
  body?: Maybe<Scalars['String']['output']>;
  citation?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  document?: Maybe<DocumentAsset>;
  excerpt?: Maybe<Scalars['String']['output']>;
  gbifHref: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  meta?: Maybe<Scalars['JSON']['output']>;
  primaryLink?: Maybe<Link>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type DocumentAsset = {
  __typename?: 'DocumentAsset';
  description?: Maybe<Scalars['String']['output']>;
  file?: Maybe<DocumentAssetFile>;
  title?: Maybe<Scalars['String']['output']>;
};

export type DocumentAssetFile = {
  __typename?: 'DocumentAssetFile';
  contentType?: Maybe<Scalars['String']['output']>;
  details?: Maybe<DocumentAssetFileDetails>;
  fileName?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  /** Used internally by the UI to map the document type to an icon */
  volatile_documentType?: Maybe<Scalars['String']['output']>;
};

export type DocumentAssetFileDetails = {
  __typename?: 'DocumentAssetFileDetails';
  size?: Maybe<Scalars['Int']['output']>;
};

export type Download = {
  __typename?: 'Download';
  created?: Maybe<Scalars['DateTime']['output']>;
  doi?: Maybe<Scalars['String']['output']>;
  downloadLink?: Maybe<Scalars['String']['output']>;
  eraseAfter?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  license?: Maybe<Scalars['String']['output']>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  numberDatasets?: Maybe<Scalars['Int']['output']>;
  request?: Maybe<DownloadRequest>;
  size?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalRecords?: Maybe<Scalars['Int']['output']>;
};

export type DownloadRequest = {
  __typename?: 'DownloadRequest';
  format?: Maybe<Scalars['String']['output']>;
  predicate?: Maybe<Scalars['JSON']['output']>;
  sendNotification?: Maybe<Scalars['Boolean']['output']>;
};

export type Endpoint = {
  __typename?: 'Endpoint';
  created: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  modified?: Maybe<Scalars['String']['output']>;
  type: EndpointType;
  url?: Maybe<Scalars['URL']['output']>;
};

export enum EndpointType {
  Biocase = 'BIOCASE',
  BiocaseXmlArchive = 'BIOCASE_XML_ARCHIVE',
  CamtrapDpV_0_4 = 'CAMTRAP_DP_v_0_4',
  Coldp = 'COLDP',
  Digir = 'DIGIR',
  DigirManis = 'DIGIR_MANIS',
  DwcArchive = 'DWC_ARCHIVE',
  Eml = 'EML',
  Feed = 'FEED',
  OaiPmh = 'OAI_PMH',
  Other = 'OTHER',
  Tapir = 'TAPIR',
  TcsRdf = 'TCS_RDF',
  TcsXml = 'TCS_XML',
  Wfs = 'WFS',
  Wms = 'WMS'
}

export enum EstablishmentMeans {
  Introduced = 'INTRODUCED',
  Invasive = 'INVASIVE',
  Managed = 'MANAGED',
  Native = 'NATIVE',
  Naturalised = 'NATURALISED',
  Uncertain = 'UNCERTAIN'
}

export type Event = {
  __typename?: 'Event';
  allDayEvent?: Maybe<Scalars['Boolean']['output']>;
  attendees?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  coordinates?: Maybe<Coordinates>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documents?: Maybe<Array<Maybe<DocumentAsset>>>;
  end?: Maybe<Scalars['DateTime']['output']>;
  eventLanguage?: Maybe<Scalars['String']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  gbifHref: Scalars['String']['output'];
  gbifRegion?: Maybe<GbifRegion>;
  gbifsAttendee?: Maybe<Scalars['String']['output']>;
  homepage: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  location?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<Scalars['JSON']['output']>;
  organisingParticipants?: Maybe<Array<Maybe<Participant>>>;
  primaryImage?: Maybe<AssetImage>;
  primaryLink?: Maybe<Link>;
  searchable: Scalars['Boolean']['output'];
  secondaryLinks?: Maybe<Array<Maybe<Link>>>;
  start: Scalars['DateTime']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  venue?: Maybe<Scalars['String']['output']>;
};

export enum Extension {
  Amplification = 'AMPLIFICATION',
  Audubon = 'AUDUBON',
  ChronometricAge = 'CHRONOMETRIC_AGE',
  ChronometricDate = 'CHRONOMETRIC_DATE',
  Cloning = 'CLONING',
  Description = 'DESCRIPTION',
  Distribution = 'DISTRIBUTION',
  DnaDerivedData = 'DNA_DERIVED_DATA',
  EolMedia = 'EOL_MEDIA',
  EolReference = 'EOL_REFERENCE',
  ExtendedMeasurementOrFact = 'EXTENDED_MEASUREMENT_OR_FACT',
  GelImage = 'GEL_IMAGE',
  GermplasmAccession = 'GERMPLASM_ACCESSION',
  GermplasmMeasurementScore = 'GERMPLASM_MEASUREMENT_SCORE',
  GermplasmMeasurementTrait = 'GERMPLASM_MEASUREMENT_TRAIT',
  GermplasmMeasurementTrial = 'GERMPLASM_MEASUREMENT_TRIAL',
  Identification = 'IDENTIFICATION',
  Identifier = 'IDENTIFIER',
  Image = 'IMAGE',
  Loan = 'LOAN',
  MaterialSample = 'MATERIAL_SAMPLE',
  MeasurementOrFact = 'MEASUREMENT_OR_FACT',
  Multimedia = 'MULTIMEDIA',
  Permit = 'PERMIT',
  Preparation = 'PREPARATION',
  Preservation = 'PRESERVATION',
  Reference = 'REFERENCE',
  ResourceRelationship = 'RESOURCE_RELATIONSHIP',
  SpeciesProfile = 'SPECIES_PROFILE',
  TypesAndSpecimen = 'TYPES_AND_SPECIMEN',
  VernacularName = 'VERNACULAR_NAME'
}

export type FacetCount = {
  __typename?: 'FacetCount';
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Feature = {
  __typename?: 'Feature';
  contentType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  primaryImage: AssetImage;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FeatureBlock = {
  __typename?: 'FeatureBlock';
  backgroundColour?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  features?: Maybe<Array<FeatureItem>>;
  hideTitle?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  maxPerRow?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type FeatureItem = DataUse | Event | Feature | News;

export type FeaturedTextBlock = {
  __typename?: 'FeaturedTextBlock';
  backgroundColour?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  hideTitle?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  primaryImage?: Maybe<AssetImage>;
  title?: Maybe<Scalars['String']['output']>;
};

export type FundingOrganisation = {
  __typename?: 'FundingOrganisation';
  id: Scalars['ID']['output'];
  logo?: Maybe<AssetImage>;
  meta?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Gadm = {
  __typename?: 'Gadm';
  englishType?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  gadmLevel?: Maybe<Scalars['Int']['output']>;
  higherRegions?: Maybe<Array<Maybe<GadmHigherRegions>>>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  variantName?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type GadmHigherRegions = {
  __typename?: 'GadmHigherRegions';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type GbifClassification = {
  __typename?: 'GbifClassification';
  acceptedUsage?: Maybe<OccurrenceNameUsage>;
  class?: Maybe<Scalars['String']['output']>;
  classKey?: Maybe<Scalars['Int']['output']>;
  classification?: Maybe<Array<Maybe<Classification>>>;
  classificationPath?: Maybe<Scalars['String']['output']>;
  diagnostics?: Maybe<Diagnostics>;
  family?: Maybe<Scalars['String']['output']>;
  familyKey?: Maybe<Scalars['Int']['output']>;
  genus?: Maybe<Scalars['String']['output']>;
  genusKey?: Maybe<Scalars['Int']['output']>;
  kingdom?: Maybe<Scalars['String']['output']>;
  kingdomKey?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['String']['output']>;
  orderKey?: Maybe<Scalars['Int']['output']>;
  phylum?: Maybe<Scalars['String']['output']>;
  phylumKey?: Maybe<Scalars['Int']['output']>;
  species?: Maybe<Scalars['String']['output']>;
  speciesKey?: Maybe<Scalars['Int']['output']>;
  synonym?: Maybe<Scalars['Boolean']['output']>;
  taxonID?: Maybe<Scalars['String']['output']>;
  taxonKey?: Maybe<Scalars['Int']['output']>;
  usage?: Maybe<OccurrenceNameUsage>;
  usageParsedName?: Maybe<UsageParsedName>;
  verbatimScientificName?: Maybe<Scalars['String']['output']>;
};

export type GbifProject = {
  __typename?: 'GbifProject';
  additionalPartners?: Maybe<Array<Maybe<ParticipantOrFundingOrganisation>>>;
  body?: Maybe<Scalars['String']['output']>;
  call?: Maybe<Call>;
  contractCountry?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documents?: Maybe<Array<DocumentAsset>>;
  end?: Maybe<Scalars['DateTime']['output']>;
  events?: Maybe<Array<Event>>;
  excerpt?: Maybe<Scalars['String']['output']>;
  fundingOrganisations?: Maybe<Array<Maybe<ParticipantOrFundingOrganisation>>>;
  fundsAllocated?: Maybe<Scalars['Int']['output']>;
  gbifHref: Scalars['String']['output'];
  gbifProgrammeAcronym?: Maybe<Scalars['String']['output']>;
  gbifRegion?: Maybe<GbifRegion>;
  grantType?: Maybe<Scalars['String']['output']>;
  homepage: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  leadContact?: Maybe<Scalars['String']['output']>;
  leadPartner?: Maybe<ParticipantOrFundingOrganisation>;
  matchingFunds?: Maybe<Scalars['Int']['output']>;
  meta?: Maybe<Scalars['JSON']['output']>;
  news?: Maybe<Array<News>>;
  officialTitle?: Maybe<Scalars['String']['output']>;
  overrideProgrammeFunding?: Maybe<Array<Maybe<FundingOrganisation>>>;
  primaryImage?: Maybe<AssetImage>;
  primaryLink?: Maybe<Link>;
  programme?: Maybe<Programme>;
  projectId?: Maybe<Scalars['String']['output']>;
  purposes?: Maybe<Array<Scalars['String']['output']>>;
  searchable: Scalars['Boolean']['output'];
  secondaryLinks?: Maybe<Array<Link>>;
  start?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum GbifRegion {
  Africa = 'AFRICA',
  Antarctica = 'ANTARCTICA',
  Asia = 'ASIA',
  Europe = 'EUROPE',
  LatinAmerica = 'LATIN_AMERICA',
  NorthAmerica = 'NORTH_AMERICA',
  Oceania = 'OCEANIA'
}

export type GenericFacetResult_Boolean = {
  __typename?: 'GenericFacetResult_boolean';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  key: Scalars['Boolean']['output'];
};

export type GenericFacetResult_Float = {
  __typename?: 'GenericFacetResult_float';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  key: Scalars['Float']['output'];
};

export type GenericFacetResult_String = {
  __typename?: 'GenericFacetResult_string';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  key: Scalars['String']['output'];
};

export type GeographicCoverage = {
  __typename?: 'GeographicCoverage';
  boundingBox?: Maybe<BoundingBox>;
  description?: Maybe<Scalars['String']['output']>;
};

export type Globe = {
  __typename?: 'Globe';
  lat: Scalars['Float']['output'];
  lon: Scalars['Float']['output'];
  svg: Scalars['String']['output'];
};

export type GridMetric = {
  __typename?: 'GridMetric';
  key?: Maybe<Scalars['ID']['output']>;
  maxPercent?: Maybe<Scalars['Float']['output']>;
  minDist?: Maybe<Scalars['Float']['output']>;
  minDistCount?: Maybe<Scalars['Float']['output']>;
  percent?: Maybe<Scalars['Float']['output']>;
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export enum Habitat {
  Freshwater = 'FRESHWATER',
  Marine = 'MARINE',
  Terrestrial = 'TERRESTRIAL'
}

export type HeaderBlock = {
  __typename?: 'HeaderBlock';
  contentType?: Maybe<Scalars['String']['output']>;
  hideTitle?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  primaryImage?: Maybe<AssetImage>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Help = {
  __typename?: 'Help';
  body?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Histogram = {
  __typename?: 'Histogram';
  buckets?: Maybe<Array<Maybe<HistogramBucket>>>;
  interval?: Maybe<Scalars['Long']['output']>;
};

export type HistogramBucket = {
  __typename?: 'HistogramBucket';
  count: Scalars['Long']['output'];
  key: Scalars['ID']['output'];
};

export type Home = {
  __typename?: 'Home';
  aboutBody?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Maybe<MenuItem>>>;
  id: Scalars['ID']['output'];
  primaryImage?: Maybe<Array<Maybe<AssetImage>>>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export enum IdType {
  Huh = 'HUH',
  IhIrn = 'IH_IRN',
  Isni = 'ISNI',
  Orcid = 'ORCID',
  Other = 'OTHER',
  ResearcherId = 'RESEARCHER_ID',
  Viaf = 'VIAF',
  Wikidata = 'WIKIDATA'
}

export type Identifier = {
  __typename?: 'Identifier';
  created: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  identifier: Scalars['String']['output'];
  key: Scalars['ID']['output'];
  type: IdentifierType;
};

export enum IdentifierType {
  Cites = 'CITES',
  Doi = 'DOI',
  Ftp = 'FTP',
  GbifNode = 'GBIF_NODE',
  GbifParticipant = 'GBIF_PARTICIPANT',
  GbifPortal = 'GBIF_PORTAL',
  Grid = 'GRID',
  GrscicollId = 'GRSCICOLL_ID',
  GrscicollUri = 'GRSCICOLL_URI',
  Handler = 'HANDLER',
  IhIrn = 'IH_IRN',
  Lsid = 'LSID',
  NcbiBiocollection = 'NCBI_BIOCOLLECTION',
  Ror = 'ROR',
  SymbiotaUuid = 'SYMBIOTA_UUID',
  Unknown = 'UNKNOWN',
  Uri = 'URI',
  Url = 'URL',
  Uuid = 'UUID',
  Wikidata = 'WIKIDATA'
}

export type Image = {
  __typename?: 'Image';
  IDofContainingCollection?: Maybe<Scalars['String']['output']>;
  accessOriginalURI?: Maybe<Scalars['String']['output']>;
  accessURI?: Maybe<Scalars['String']['output']>;
  createDate?: Maybe<Scalars['String']['output']>;
  creator?: Maybe<Scalars['String']['output']>;
  credit?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  hashFunction?: Maybe<Scalars['String']['output']>;
  hashValue?: Maybe<Scalars['String']['output']>;
  identifier: Scalars['String']['output'];
  metadataDate?: Maybe<Scalars['String']['output']>;
  metadataLanguage?: Maybe<Scalars['String']['output']>;
  metadataLanguageLiteral?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  pixelXDimension?: Maybe<Scalars['Int']['output']>;
  pixelYDimension?: Maybe<Scalars['Int']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  providerLiteral?: Maybe<Scalars['String']['output']>;
  providerManagedID?: Maybe<Scalars['String']['output']>;
  rights?: Maybe<Scalars['String']['output']>;
  subtypeLiteral?: Maybe<Scalars['String']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  webStatement?: Maybe<Scalars['String']['output']>;
};

export type ImageFile = {
  __typename?: 'ImageFile';
  contentType: Scalars['String']['output'];
  details: ImageFileDetails;
  fileName: Scalars['String']['output'];
  thumbor: Scalars['String']['output'];
  url: Scalars['String']['output'];
};


export type ImageFileThumborArgs = {
  fitIn?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type ImageFileDetails = {
  __typename?: 'ImageFileDetails';
  /** @deprecated Use image.height */
  height?: Maybe<Scalars['Int']['output']>;
  image?: Maybe<ImageFileDetailsImage>;
  size?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Use image.width */
  width?: Maybe<Scalars['Int']['output']>;
};

export type ImageFileDetailsImage = {
  __typename?: 'ImageFileDetailsImage';
  height?: Maybe<Scalars['Int']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

export type Installation = {
  __typename?: 'Installation';
  comments?: Maybe<Array<Maybe<Comment>>>;
  contacts?: Maybe<Array<Contact>>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  dataset: DatasetListResults;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  endpoints?: Maybe<Array<Maybe<Endpoint>>>;
  /** The homepage is a computed field that is only available for IPT_INSTALLATION types and extracted from the endpoints */
  homepage?: Maybe<Scalars['String']['output']>;
  identifiers?: Maybe<Array<Maybe<Identifier>>>;
  key: Scalars['ID']['output'];
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Organization>;
  organizationKey?: Maybe<Scalars['ID']['output']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};


export type InstallationDatasetArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type InstallationSearchResults = {
  __typename?: 'InstallationSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Installation>>;
};

export enum InstallationType {
  BiocaseInstallation = 'BIOCASE_INSTALLATION',
  DigirInstallation = 'DIGIR_INSTALLATION',
  EarthcapeInstallation = 'EARTHCAPE_INSTALLATION',
  HttpInstallation = 'HTTP_INSTALLATION',
  IptInstallation = 'IPT_INSTALLATION',
  SymbiotaInstallation = 'SYMBIOTA_INSTALLATION',
  TapirInstallation = 'TAPIR_INSTALLATION'
}

export type Institution = {
  __typename?: 'Institution';
  active?: Maybe<Scalars['Boolean']['output']>;
  additionalNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  address?: Maybe<Address>;
  alternativeCodes?: Maybe<Array<Maybe<AlternativeCode>>>;
  apiUrl?: Maybe<Scalars['URL']['output']>;
  catalogUrl?: Maybe<Scalars['URL']['output']>;
  citesPermitNumber?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  /** collection count will count up to a 1000. After that results will be capped to 1000. This is unlikely to be an issue, but you should worry if you see 1000 results exactly. */
  collectionCount?: Maybe<Scalars['Int']['output']>;
  collections?: Maybe<Array<Maybe<Collection>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  contactPersons: Array<Maybe<ContactPerson>>;
  /** The contacts type is deprecated and will no longer be updated */
  contacts?: Maybe<Array<Maybe<StaffMember>>>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disciplines?: Maybe<Array<Maybe<Discipline>>>;
  email?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  foundingDate?: Maybe<Scalars['Int']['output']>;
  geographicDescription?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['URL']['output']>;
  identifiers?: Maybe<Array<Maybe<Identifier>>>;
  indexHerbariorumRecord?: Maybe<Scalars['Boolean']['output']>;
  institutionalGovernance?: Maybe<InstitutionGovernance>;
  key: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  logoUrl?: Maybe<Scalars['URL']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  mailingAddress?: Maybe<Address>;
  masterSource?: Maybe<Scalars['String']['output']>;
  masterSourceMetadata?: Maybe<MasterSourceMetadata>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  numberSpecimens?: Maybe<Scalars['Int']['output']>;
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  phone?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  replacedBy?: Maybe<Scalars['ID']['output']>;
  replacedByInstitution?: Maybe<Institution>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  taxonomicDescription?: Maybe<Scalars['String']['output']>;
  type?: Maybe<InstitutionType>;
};


export type InstitutionCollectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export enum InstitutionGovernance {
  AcademicFederal = 'ACADEMIC_FEDERAL',
  AcademicForProfit = 'ACADEMIC_FOR_PROFIT',
  AcademicLocal = 'ACADEMIC_LOCAL',
  AcademicNonProfit = 'ACADEMIC_NON_PROFIT',
  AcademicState = 'ACADEMIC_STATE',
  Federal = 'FEDERAL',
  ForProfit = 'FOR_PROFIT',
  Local = 'LOCAL',
  NonProfit = 'NON_PROFIT',
  Other = 'OTHER',
  State = 'STATE'
}

export type InstitutionSearchResults = {
  __typename?: 'InstitutionSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Institution>>;
};

export enum InstitutionType {
  BiomedicalResearchInstitute = 'BIOMEDICAL_RESEARCH_INSTITUTE',
  BotanicalGarden = 'BOTANICAL_GARDEN',
  Herbarium = 'HERBARIUM',
  LivingOrganismCollection = 'LIVING_ORGANISM_COLLECTION',
  MedicalResearchInstitute = 'MEDICAL_RESEARCH_INSTITUTE',
  Museum = 'MUSEUM',
  MuseumHerbariumPrivateNonProfit = 'MUSEUM_HERBARIUM_PRIVATE_NON_PROFIT',
  OtherInstitutionalType = 'OTHER_INSTITUTIONAL_TYPE',
  OtherTypeResearchInstitutionBiorepository = 'OTHER_TYPE_RESEARCH_INSTITUTION_BIOREPOSITORY',
  UniversityCollege = 'UNIVERSITY_COLLEGE',
  ZooAquarium = 'ZOO_AQUARIUM'
}

export enum InterpretationRemarkSeverity {
  Error = 'ERROR',
  Info = 'INFO',
  Warning = 'WARNING'
}

export type IucnRedListCategoryResult = {
  __typename?: 'IucnRedListCategoryResult';
  category?: Maybe<ThreatStatus>;
  code?: Maybe<Scalars['String']['output']>;
  scientificName?: Maybe<Scalars['String']['output']>;
  taxonomicStatus?: Maybe<TaxonomicStatus>;
  usageKey: Scalars['Int']['output'];
};

export type KeywordCollection = {
  __typename?: 'KeywordCollection';
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  thesaurus?: Maybe<Scalars['String']['output']>;
};

export enum Kingdom {
  Animalia = 'ANIMALIA',
  Archaea = 'ARCHAEA',
  Bacteria = 'BACTERIA',
  Chromista = 'CHROMISTA',
  Fungi = 'FUNGI',
  IncertaeSedis = 'INCERTAE_SEDIS',
  Plantae = 'PLANTAE',
  Protozoa = 'PROTOZOA',
  Viruses = 'VIRUSES'
}

export enum Language {
  Aar = 'aar',
  Abk = 'abk',
  Afr = 'afr',
  Aka = 'aka',
  Amh = 'amh',
  Ara = 'ara',
  Arg = 'arg',
  Asm = 'asm',
  Ava = 'ava',
  Ave = 'ave',
  Aym = 'aym',
  Aze = 'aze',
  Bak = 'bak',
  Bam = 'bam',
  Bel = 'bel',
  Ben = 'ben',
  Bih = 'bih',
  Bis = 'bis',
  Bod = 'bod',
  Bos = 'bos',
  Bre = 'bre',
  Bul = 'bul',
  Cat = 'cat',
  Ces = 'ces',
  Cha = 'cha',
  Che = 'che',
  Chu = 'chu',
  Chv = 'chv',
  Cor = 'cor',
  Cos = 'cos',
  Cre = 'cre',
  Cym = 'cym',
  Dan = 'dan',
  Deu = 'deu',
  Div = 'div',
  Dzo = 'dzo',
  Ell = 'ell',
  Eng = 'eng',
  Epo = 'epo',
  Est = 'est',
  Eus = 'eus',
  Ewe = 'ewe',
  Fao = 'fao',
  Fas = 'fas',
  Fij = 'fij',
  Fin = 'fin',
  Fra = 'fra',
  Fry = 'fry',
  Ful = 'ful',
  Gla = 'gla',
  Gle = 'gle',
  Glg = 'glg',
  Glv = 'glv',
  Grn = 'grn',
  Guj = 'guj',
  Hat = 'hat',
  Hau = 'hau',
  Heb = 'heb',
  Her = 'her',
  Hin = 'hin',
  Hmo = 'hmo',
  Hrv = 'hrv',
  Hun = 'hun',
  Hye = 'hye',
  Ibo = 'ibo',
  Ido = 'ido',
  Iii = 'iii',
  Iku = 'iku',
  Ile = 'ile',
  Ina = 'ina',
  Ind = 'ind',
  Ipk = 'ipk',
  Isl = 'isl',
  Ita = 'ita',
  Jav = 'jav',
  Jpn = 'jpn',
  Kal = 'kal',
  Kan = 'kan',
  Kas = 'kas',
  Kat = 'kat',
  Kau = 'kau',
  Kaz = 'kaz',
  Khm = 'khm',
  Kik = 'kik',
  Kin = 'kin',
  Kir = 'kir',
  Kom = 'kom',
  Kon = 'kon',
  Kor = 'kor',
  Kua = 'kua',
  Kur = 'kur',
  Lao = 'lao',
  Lat = 'lat',
  Lav = 'lav',
  Lim = 'lim',
  Lin = 'lin',
  Lit = 'lit',
  Ltz = 'ltz',
  Lub = 'lub',
  Lug = 'lug',
  Mah = 'mah',
  Mal = 'mal',
  Mar = 'mar',
  Mkd = 'mkd',
  Mlg = 'mlg',
  Mlt = 'mlt',
  Mol = 'mol',
  Mon = 'mon',
  Mri = 'mri',
  Msa = 'msa',
  Mya = 'mya',
  Nau = 'nau',
  Nav = 'nav',
  Nbl = 'nbl',
  Nde = 'nde',
  Ndo = 'ndo',
  Nep = 'nep',
  Nld = 'nld',
  Nno = 'nno',
  Nob = 'nob',
  Nor = 'nor',
  Nya = 'nya',
  Oci = 'oci',
  Oji = 'oji',
  Ori = 'ori',
  Orm = 'orm',
  Oss = 'oss',
  Pan = 'pan',
  Pli = 'pli',
  Pol = 'pol',
  Por = 'por',
  Pus = 'pus',
  Que = 'que',
  Roh = 'roh',
  Ron = 'ron',
  Run = 'run',
  Rus = 'rus',
  Sag = 'sag',
  San = 'san',
  Sin = 'sin',
  Slk = 'slk',
  Slv = 'slv',
  Sme = 'sme',
  Smo = 'smo',
  Sna = 'sna',
  Snd = 'snd',
  Som = 'som',
  Sot = 'sot',
  Spa = 'spa',
  Sqi = 'sqi',
  Srd = 'srd',
  Srp = 'srp',
  Ssw = 'ssw',
  Sun = 'sun',
  Swa = 'swa',
  Swe = 'swe',
  Tah = 'tah',
  Tam = 'tam',
  Tat = 'tat',
  Tel = 'tel',
  Tgk = 'tgk',
  Tgl = 'tgl',
  Tha = 'tha',
  Tir = 'tir',
  Ton = 'ton',
  Tsn = 'tsn',
  Tso = 'tso',
  Tuk = 'tuk',
  Tur = 'tur',
  Twi = 'twi',
  Uig = 'uig',
  Ukr = 'ukr',
  Urd = 'urd',
  Uzb = 'uzb',
  Ven = 'ven',
  Vie = 'vie',
  Vol = 'vol',
  Wln = 'wln',
  Wol = 'wol',
  Xho = 'xho',
  Yid = 'yid',
  Yor = 'yor',
  Zha = 'zha',
  Zho = 'zho',
  Zul = 'zul'
}

export enum License {
  Cc0_1_0 = 'CC0_1_0',
  CcBy_4_0 = 'CC_BY_4_0',
  CcByNc_4_0 = 'CC_BY_NC_4_0',
  Unspecified = 'UNSPECIFIED',
  Unsupported = 'UNSUPPORTED'
}

export enum LifeStage {
  Adult = 'ADULT',
  Emryo = 'EMRYO',
  Gamete = 'GAMETE',
  Gametophyte = 'GAMETOPHYTE',
  Juvenile = 'JUVENILE',
  Larva = 'LARVA',
  Pupa = 'PUPA',
  Spore = 'SPORE',
  Sporophyte = 'SPOROPHYTE',
  Zygote = 'ZYGOTE'
}

export type Link = {
  __typename?: 'Link';
  label: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Literature = {
  __typename?: 'Literature';
  abstract?: Maybe<Scalars['String']['output']>;
  authors?: Maybe<Array<Maybe<Author>>>;
  countriesOfCoverage?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  countriesOfResearcher?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  day?: Maybe<Scalars['Int']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  gbifDownloadKey?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  gbifRegion?: Maybe<Array<Maybe<GbifRegion>>>;
  id: Scalars['ID']['output'];
  identifiers?: Maybe<LiteratureIdentifiers>;
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  language?: Maybe<Language>;
  literatureType?: Maybe<Scalars['String']['output']>;
  month?: Maybe<Scalars['Int']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  openAccess?: Maybe<Scalars['Boolean']['output']>;
  peerReview?: Maybe<Scalars['Boolean']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  relevance?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  source?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title: Scalars['String']['output'];
  topics?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  websites?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type LiteratureAutoDateHistogram = {
  __typename?: 'LiteratureAutoDateHistogram';
  createdAt: AutoDateHistogramResult;
};


export type LiteratureAutoDateHistogramCreatedAtArgs = {
  buckets?: InputMaybe<Scalars['Float']['input']>;
  minimum_interval?: InputMaybe<Scalars['String']['input']>;
};

export type LiteratureCardinality = {
  __typename?: 'LiteratureCardinality';
  countriesOfCoverage: Scalars['Int']['output'];
  countriesOfResearcher: Scalars['Int']['output'];
  literatureType: Scalars['Int']['output'];
  openAccess: Scalars['Int']['output'];
  peerReview: Scalars['Int']['output'];
  publisher: Scalars['Int']['output'];
  relevance: Scalars['Int']['output'];
  source: Scalars['Int']['output'];
  topics: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type LiteratureDocuments = {
  __typename?: 'LiteratureDocuments';
  from: Scalars['Int']['output'];
  results: Array<Maybe<Literature>>;
  size: Scalars['Int']['output'];
  total: Scalars['Long']['output'];
};

export type LiteratureFacet = {
  __typename?: 'LiteratureFacet';
  countriesOfCoverage?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  countriesOfResearcher?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  literatureType?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  openAccess?: Maybe<Array<Maybe<GenericFacetResult_Boolean>>>;
  peerReview?: Maybe<Array<Maybe<GenericFacetResult_Boolean>>>;
  publisher?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  relevance?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  source?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  topics?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  year?: Maybe<Array<Maybe<GenericFacetResult_Float>>>;
};


export type LiteratureFacetCountriesOfCoverageArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetCountriesOfResearcherArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetLiteratureTypeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetOpenAccessArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetPeerReviewArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetPublisherArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetRelevanceArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetSourceArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetTopicsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetYearArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type LiteratureHistogram = {
  __typename?: 'LiteratureHistogram';
  year?: Maybe<Scalars['JSON']['output']>;
};


export type LiteratureHistogramYearArgs = {
  interval?: InputMaybe<Scalars['Float']['input']>;
};

export type LiteratureIdentifiers = {
  __typename?: 'LiteratureIdentifiers';
  arxiv?: Maybe<Scalars['String']['output']>;
  doi?: Maybe<Scalars['String']['output']>;
  isbn?: Maybe<Scalars['String']['output']>;
  issn?: Maybe<Scalars['String']['output']>;
  pmid?: Maybe<Scalars['String']['output']>;
};

export enum LiteratureRelevance {
  GbifAcknowledged = 'GBIF_ACKNOWLEDGED',
  GbifAuthor = 'GBIF_AUTHOR',
  GbifCited = 'GBIF_CITED',
  GbifDiscussed = 'GBIF_DISCUSSED',
  GbifFunded = 'GBIF_FUNDED',
  GbifMentioned = 'GBIF_MENTIONED',
  GbifPrimary = 'GBIF_PRIMARY',
  GbifPublished = 'GBIF_PUBLISHED',
  GbifUsed = 'GBIF_USED'
}

export type LiteratureSearchResult = {
  __typename?: 'LiteratureSearchResult';
  _meta?: Maybe<Scalars['JSON']['output']>;
  _predicate?: Maybe<Scalars['JSON']['output']>;
  autoDateHistogram?: Maybe<LiteratureAutoDateHistogram>;
  /** Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set */
  cardinality?: Maybe<LiteratureCardinality>;
  /** The literature that match the filter */
  documents: LiteratureDocuments;
  /** Get number of literature items per distinct values in a field. E.g. how many citations per year. */
  facet?: Maybe<LiteratureFacet>;
  /** Get histogram for a numeric field with the option to specify an interval size */
  histogram?: Maybe<LiteratureHistogram>;
  /** Get statistics for a numeric field. Minimimum value, maximum etc. */
  stats?: Maybe<LiteratureStats>;
};


export type LiteratureSearchResultDocumentsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type LiteratureStats = {
  __typename?: 'LiteratureStats';
  year: Stats;
};

export enum LiteratureTopic {
  Agriculture = 'AGRICULTURE',
  BiodiversityScience = 'BIODIVERSITY_SCIENCE',
  Biogeography = 'BIOGEOGRAPHY',
  CitizenScience = 'CITIZEN_SCIENCE',
  ClimateChange = 'CLIMATE_CHANGE',
  Conservation = 'CONSERVATION',
  DataManagement = 'DATA_MANAGEMENT',
  DataPaper = 'DATA_PAPER',
  Ecology = 'ECOLOGY',
  EcosystemServices = 'ECOSYSTEM_SERVICES',
  Evolution = 'EVOLUTION',
  Freshwater = 'FRESHWATER',
  HumanHealth = 'HUMAN_HEALTH',
  Invasives = 'INVASIVES',
  Marine = 'MARINE',
  Phylogenetics = 'PHYLOGENETICS',
  SpeciesDistributions = 'SPECIES_DISTRIBUTIONS',
  Taxonomy = 'TAXONOMY'
}

export enum LiteratureType {
  Bill = 'BILL',
  Book = 'BOOK',
  BookSection = 'BOOK_SECTION',
  Case = 'CASE',
  ComputerProgram = 'COMPUTER_PROGRAM',
  ConferenceProceedings = 'CONFERENCE_PROCEEDINGS',
  EncyclopediaArticle = 'ENCYCLOPEDIA_ARTICLE',
  Film = 'FILM',
  Generic = 'GENERIC',
  Hearing = 'HEARING',
  Journal = 'JOURNAL',
  MagazineArticle = 'MAGAZINE_ARTICLE',
  NewspaperArticle = 'NEWSPAPER_ARTICLE',
  Patent = 'PATENT',
  Report = 'REPORT',
  Statute = 'STATUTE',
  TelevisionBroadcast = 'TELEVISION_BROADCAST',
  Thesis = 'THESIS',
  WebPage = 'WEB_PAGE',
  WorkingPaper = 'WORKING_PAPER'
}

export type LongitudeHistogram = {
  __typename?: 'LongitudeHistogram';
  bounds?: Maybe<Scalars['JSON']['output']>;
  buckets: Scalars['JSON']['output'];
};

export type MachineTag = {
  __typename?: 'MachineTag';
  created: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  namespace: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export enum MaintenanceUpdateFrequency {
  Annually = 'ANNUALLY',
  AsNeeded = 'AS_NEEDED',
  Biannually = 'BIANNUALLY',
  Continually = 'CONTINUALLY',
  Daily = 'DAILY',
  Irregular = 'IRREGULAR',
  Monthly = 'MONTHLY',
  NotPlanned = 'NOT_PLANNED',
  OtherMaintenancePeriod = 'OTHER_MAINTENANCE_PERIOD',
  Unknown = 'UNKNOWN',
  Unkown = 'UNKOWN',
  Weekly = 'WEEKLY'
}

export type MapCapabilities = {
  __typename?: 'MapCapabilities';
  generated: Scalars['DateTime']['output'];
  maxLat: Scalars['Int']['output'];
  maxLng: Scalars['Int']['output'];
  maxYear?: Maybe<Scalars['Int']['output']>;
  minLat: Scalars['Int']['output'];
  minLng: Scalars['Int']['output'];
  minYear?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type MasterSourceMetadata = {
  __typename?: 'MasterSourceMetadata';
  created: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  key: Scalars['ID']['output'];
  source: Scalars['String']['output'];
  sourceId: Scalars['String']['output'];
};

export enum MasterSourceType {
  GbifRegistry = 'GBIF_REGISTRY',
  Grscicoll = 'GRSCICOLL',
  Ih = 'IH'
}

export type MediaBlock = {
  __typename?: 'MediaBlock';
  backgroundColour?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  callToAction?: Maybe<Array<Link>>;
  contentType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  primaryImage?: Maybe<AssetImage>;
  reverse?: Maybe<Scalars['Boolean']['output']>;
  roundImage?: Maybe<Scalars['Boolean']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type MediaCountBlock = {
  __typename?: 'MediaCountBlock';
  backgroundColour?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  callToAction?: Maybe<Array<Link>>;
  contentType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  primaryImage?: Maybe<AssetImage>;
  reverse?: Maybe<Scalars['Boolean']['output']>;
  roundImage?: Maybe<Scalars['Boolean']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  titleCountPart: Scalars['String']['output'];
};

export type MediaListResult = {
  __typename?: 'MediaListResult';
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<TaxonMedia>>;
};

export enum MediaType {
  InteractiveResource = 'InteractiveResource',
  MovingImage = 'MovingImage',
  Sound = 'Sound',
  StillImage = 'StillImage'
}

export type MenuItem = {
  __typename?: 'MenuItem';
  children?: Maybe<Array<Maybe<MenuItem>>>;
  externalLink?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export enum MetadataType {
  Dc = 'DC',
  Eml = 'EML'
}

export type MultimediaItem = {
  __typename?: 'MultimediaItem';
  created?: Maybe<Scalars['String']['output']>;
  creator?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  license?: Maybe<Scalars['String']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  references?: Maybe<Scalars['String']['output']>;
  rightsHolder?: Maybe<Scalars['String']['output']>;
  thumbor?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};


export type MultimediaItemThumborArgs = {
  fitIn?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export enum NamePart {
  Generic = 'GENERIC',
  Infrageneric = 'INFRAGENERIC',
  Infraspecific = 'INFRASPECIFIC',
  Specific = 'SPECIFIC'
}

export enum NameType {
  Blacklisted = 'BLACKLISTED',
  Candidatus = 'CANDIDATUS',
  Cultivar = 'CULTIVAR',
  Doubtful = 'DOUBTFUL',
  Hybrid = 'HYBRID',
  Informal = 'INFORMAL',
  NoName = 'NO_NAME',
  Otu = 'OTU',
  Placeholder = 'PLACEHOLDER',
  Scientific = 'SCIENTIFIC',
  Virus = 'VIRUS'
}

export enum NameUsageIssue {
  AcceptedNameMissing = 'ACCEPTED_NAME_MISSING',
  AcceptedNameNotUnique = 'ACCEPTED_NAME_NOT_UNIQUE',
  AcceptedNameUsageIdInvalid = 'ACCEPTED_NAME_USAGE_ID_INVALID',
  AltIdentifierInvalid = 'ALT_IDENTIFIER_INVALID',
  BackboneMatchAggregate = 'BACKBONE_MATCH_AGGREGATE',
  BackboneMatchFuzzy = 'BACKBONE_MATCH_FUZZY',
  BackboneMatchNone = 'BACKBONE_MATCH_NONE',
  BasionymAuthorMismatch = 'BASIONYM_AUTHOR_MISMATCH',
  BibReferenceInvalid = 'BIB_REFERENCE_INVALID',
  ChainedSynoym = 'CHAINED_SYNOYM',
  ClassificationNotApplied = 'CLASSIFICATION_NOT_APPLIED',
  ClassificationRankOrderInvalid = 'CLASSIFICATION_RANK_ORDER_INVALID',
  ConflictingBasionymCombination = 'CONFLICTING_BASIONYM_COMBINATION',
  DescriptionInvalid = 'DESCRIPTION_INVALID',
  DistributionInvalid = 'DISTRIBUTION_INVALID',
  Homonym = 'HOMONYM',
  MultimediaInvalid = 'MULTIMEDIA_INVALID',
  NameParentMismatch = 'NAME_PARENT_MISMATCH',
  NomenclaturalStatusInvalid = 'NOMENCLATURAL_STATUS_INVALID',
  NoSpecies = 'NO_SPECIES',
  OriginalNameDerived = 'ORIGINAL_NAME_DERIVED',
  OriginalNameNotUnique = 'ORIGINAL_NAME_NOT_UNIQUE',
  OriginalNameUsageIdInvalid = 'ORIGINAL_NAME_USAGE_ID_INVALID',
  OrthographicVariant = 'ORTHOGRAPHIC_VARIANT',
  ParentCycle = 'PARENT_CYCLE',
  ParentNameNotUnique = 'PARENT_NAME_NOT_UNIQUE',
  ParentNameUsageIdInvalid = 'PARENT_NAME_USAGE_ID_INVALID',
  PartiallyParsable = 'PARTIALLY_PARSABLE',
  PublishedBeforeGenus = 'PUBLISHED_BEFORE_GENUS',
  RankInvalid = 'RANK_INVALID',
  RelationshipMissing = 'RELATIONSHIP_MISSING',
  ScientificNameAssembled = 'SCIENTIFIC_NAME_ASSEMBLED',
  SpeciesProfileInvalid = 'SPECIES_PROFILE_INVALID',
  TaxonomicStatusInvalid = 'TAXONOMIC_STATUS_INVALID',
  TaxonomicStatusMismatch = 'TAXONOMIC_STATUS_MISMATCH',
  Unparsable = 'UNPARSABLE',
  VernacularNameInvalid = 'VERNACULAR_NAME_INVALID'
}

export type Network = {
  __typename?: 'Network';
  address?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  constituents?: Maybe<DatasetListResults>;
  contacts?: Maybe<Array<Maybe<Contact>>>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  endpoints?: Maybe<Array<Maybe<Endpoint>>>;
  homepage?: Maybe<Array<Maybe<Scalars['URL']['output']>>>;
  identifiers?: Maybe<Array<Maybe<Identifier>>>;
  key: Scalars['ID']['output'];
  language?: Maybe<Language>;
  logoUrl?: Maybe<Scalars['URL']['output']>;
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  numConstituents?: Maybe<Scalars['Int']['output']>;
  organizations?: Maybe<OrganizationSearchResult>;
  phone?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  prose?: Maybe<NetworkProse>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  title?: Maybe<Scalars['String']['output']>;
};


export type NetworkConstituentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type NetworkOrganizationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type NetworkProse = {
  __typename?: 'NetworkProse';
  body?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  primaryImage?: Maybe<AssetImage>;
  primaryLink?: Maybe<Link>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type NetworkSearchResults = {
  __typename?: 'NetworkSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Network>>;
};

export type News = {
  __typename?: 'News';
  audiences?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  body?: Maybe<Scalars['String']['output']>;
  citation?: Maybe<Scalars['String']['output']>;
  countriesOfCoverage?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt: Scalars['DateTime']['output'];
  excerpt?: Maybe<Scalars['String']['output']>;
  gbifHref: Scalars['String']['output'];
  gbifRegion?: Maybe<Array<Maybe<GbifRegion>>>;
  homepage: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  meta?: Maybe<Scalars['JSON']['output']>;
  primaryImage?: Maybe<AssetImage>;
  primaryLink?: Maybe<Link>;
  programmeTag?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  projectTag?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  purposes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  searchable: Scalars['Boolean']['output'];
  secondaryLinks?: Maybe<Array<Maybe<Link>>>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  topics?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Node = {
  __typename?: 'Node';
  abbreviation?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  contacts?: Maybe<Array<Maybe<Contact>>>;
  continent?: Maybe<Continent>;
  country?: Maybe<Country>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  dataset: DatasetListResults;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  endpoints?: Maybe<Array<Maybe<Endpoint>>>;
  gbifRegion?: Maybe<GbifRegion>;
  homepage?: Maybe<Array<Maybe<Scalars['URL']['output']>>>;
  identifiers?: Maybe<Array<Maybe<Identifier>>>;
  installation: InstallationSearchResults;
  key: Scalars['ID']['output'];
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  organization: OrganizationSearchResult;
  participant?: Maybe<Participant>;
  participantTitle?: Maybe<Scalars['String']['output']>;
  participationStatus?: Maybe<Scalars['String']['output']>;
  pendingEndorsement: OrganizationSearchResult;
  phone?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<NodeType>;
};

export type NodeSearchResults = {
  __typename?: 'NodeSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Node>>;
};

export enum NodeType {
  Country = 'COUNTRY',
  Other = 'OTHER'
}

export enum NomenclaturalCode {
  Bacterial = 'BACTERIAL',
  Biocode = 'BIOCODE',
  Botanical = 'BOTANICAL',
  Cultivars = 'CULTIVARS',
  Phylocode = 'PHYLOCODE',
  Phytosociology = 'PHYTOSOCIOLOGY',
  Virus = 'VIRUS',
  Zoological = 'ZOOLOGICAL'
}

export enum NomenclaturalStatus {
  Aborted = 'ABORTED',
  Alternative = 'ALTERNATIVE',
  Ambiguous = 'AMBIGUOUS',
  Confused = 'CONFUSED',
  Conserved = 'CONSERVED',
  ConservedProposed = 'CONSERVED_PROPOSED',
  Corrected = 'CORRECTED',
  Denied = 'DENIED',
  Doubtful = 'DOUBTFUL',
  Forgotten = 'FORGOTTEN',
  Illegitimate = 'ILLEGITIMATE',
  Invalid = 'INVALID',
  Legitimate = 'LEGITIMATE',
  NewCombination = 'NEW_COMBINATION',
  NewGenus = 'NEW_GENUS',
  NewSpecies = 'NEW_SPECIES',
  Nudum = 'NUDUM',
  NullName = 'NULL_NAME',
  Obscure = 'OBSCURE',
  OriginalCombination = 'ORIGINAL_COMBINATION',
  OrthographicVariant = 'ORTHOGRAPHIC_VARIANT',
  Protected = 'PROTECTED',
  Provisional = 'PROVISIONAL',
  Rejected = 'REJECTED',
  RejectedOutright = 'REJECTED_OUTRIGHT',
  RejectedOutrightProposed = 'REJECTED_OUTRIGHT_PROPOSED',
  RejectedProposed = 'REJECTED_PROPOSED',
  Replacement = 'REPLACEMENT',
  Subnudum = 'SUBNUDUM',
  Superfluous = 'SUPERFLUOUS',
  Suppressed = 'SUPPRESSED',
  ValidlyPublished = 'VALIDLY_PUBLISHED'
}

export type Notification = {
  __typename?: 'Notification';
  body?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  end?: Maybe<Scalars['DateTime']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  notificationType?: Maybe<Scalars['String']['output']>;
  severity?: Maybe<Scalars['String']['output']>;
  start?: Maybe<Scalars['DateTime']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Occurrence = {
  __typename?: 'Occurrence';
  abstract?: Maybe<Scalars['String']['output']>;
  acceptedNameUsage?: Maybe<Scalars['String']['output']>;
  acceptedNameUsageID?: Maybe<Scalars['String']['output']>;
  acceptedScientificName?: Maybe<Scalars['String']['output']>;
  acceptedTaxonKey?: Maybe<Scalars['ID']['output']>;
  accessRights?: Maybe<Scalars['String']['output']>;
  accrualMethod?: Maybe<Scalars['String']['output']>;
  accrualPeriodicity?: Maybe<Scalars['String']['output']>;
  accrualPolicy?: Maybe<Scalars['String']['output']>;
  alternative?: Maybe<Scalars['String']['output']>;
  associatedMedia?: Maybe<Scalars['String']['output']>;
  associatedOccurrences?: Maybe<Scalars['String']['output']>;
  associatedOrganisms?: Maybe<Scalars['String']['output']>;
  associatedReferences?: Maybe<Scalars['String']['output']>;
  associatedSequences?: Maybe<Scalars['String']['output']>;
  associatedTaxa?: Maybe<Scalars['String']['output']>;
  audience?: Maybe<Scalars['String']['output']>;
  available?: Maybe<Scalars['String']['output']>;
  basisOfRecord?: Maybe<Scalars['String']['output']>;
  bed?: Maybe<Scalars['String']['output']>;
  behavior?: Maybe<Scalars['String']['output']>;
  bibliographicCitation?: Maybe<Scalars['String']['output']>;
  /** Volatile: these values are tightly coupled to the webview and are likely to change frequently */
  bionomia?: Maybe<BionomiaOccurrence>;
  catalogNumber?: Maybe<Scalars['String']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  classKey?: Maybe<Scalars['ID']['output']>;
  collection?: Maybe<Collection>;
  collectionCode?: Maybe<Scalars['String']['output']>;
  collectionID?: Maybe<Scalars['String']['output']>;
  collectionKey?: Maybe<Scalars['ID']['output']>;
  conformsTo?: Maybe<Scalars['String']['output']>;
  continent?: Maybe<Scalars['String']['output']>;
  contributor?: Maybe<Scalars['String']['output']>;
  coordinatePrecision?: Maybe<Scalars['Float']['output']>;
  coordinateUncertaintyInMeters?: Maybe<Scalars['Float']['output']>;
  coordinates?: Maybe<Scalars['JSON']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Country>;
  county?: Maybe<Scalars['String']['output']>;
  coverage?: Maybe<Scalars['String']['output']>;
  crawlId?: Maybe<Scalars['ID']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  creator?: Maybe<Scalars['String']['output']>;
  dataGeneralizations?: Maybe<Scalars['String']['output']>;
  dataset?: Maybe<Dataset>;
  datasetID?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  datasetKey?: Maybe<Scalars['ID']['output']>;
  datasetName?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  datasetTitle?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  dateAccepted?: Maybe<Scalars['String']['output']>;
  dateCopyrighted?: Maybe<Scalars['String']['output']>;
  dateIdentified?: Maybe<Scalars['DateTime']['output']>;
  dateSubmitted?: Maybe<Scalars['String']['output']>;
  day?: Maybe<Scalars['Int']['output']>;
  decimalLatitude?: Maybe<Scalars['Float']['output']>;
  decimalLongitude?: Maybe<Scalars['Float']['output']>;
  degreeOfEstablishment?: Maybe<Scalars['String']['output']>;
  depth?: Maybe<Scalars['Float']['output']>;
  depthAccuracy?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disposition?: Maybe<Scalars['String']['output']>;
  dynamicProperties?: Maybe<Scalars['String']['output']>;
  earliestAgeOrLowestStage?: Maybe<Scalars['String']['output']>;
  earliestEonOrLowestEonothem?: Maybe<Scalars['String']['output']>;
  earliestEpochOrLowestSeries?: Maybe<Scalars['String']['output']>;
  earliestEraOrLowestErathem?: Maybe<Scalars['String']['output']>;
  earliestPeriodOrLowestSystem?: Maybe<Scalars['String']['output']>;
  educationLevel?: Maybe<Scalars['String']['output']>;
  elevation?: Maybe<Scalars['Float']['output']>;
  elevationAccuracy?: Maybe<Scalars['Float']['output']>;
  endDayOfYear?: Maybe<Scalars['Int']['output']>;
  establishmentMeans?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['String']['output']>;
  eventID?: Maybe<Scalars['String']['output']>;
  eventRemarks?: Maybe<Scalars['String']['output']>;
  eventTime?: Maybe<Scalars['String']['output']>;
  extensions?: Maybe<OccurrenceExtensions>;
  extent?: Maybe<Scalars['String']['output']>;
  facts?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  family?: Maybe<Scalars['String']['output']>;
  familyKey?: Maybe<Scalars['ID']['output']>;
  fieldNotes?: Maybe<Scalars['String']['output']>;
  fieldNumber?: Maybe<Scalars['String']['output']>;
  footprintSRS?: Maybe<Scalars['String']['output']>;
  footprintSpatialFit?: Maybe<Scalars['String']['output']>;
  footprintWKT?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  formation?: Maybe<Scalars['String']['output']>;
  formattedCoordinates?: Maybe<Scalars['String']['output']>;
  gadm?: Maybe<Scalars['JSON']['output']>;
  /** Volatile: this is currently an exact mapping of the record in Elastic Search - the format is likely to change over time */
  gbifClassification?: Maybe<GbifClassification>;
  genericName?: Maybe<Scalars['String']['output']>;
  genus?: Maybe<Scalars['String']['output']>;
  genusKey?: Maybe<Scalars['ID']['output']>;
  geodeticDatum?: Maybe<Scalars['String']['output']>;
  geologicalContextID?: Maybe<Scalars['String']['output']>;
  georeferenceProtocol?: Maybe<Scalars['String']['output']>;
  georeferenceRemarks?: Maybe<Scalars['String']['output']>;
  georeferenceSources?: Maybe<Scalars['String']['output']>;
  georeferenceVerificationStatus?: Maybe<Scalars['String']['output']>;
  georeferencedBy?: Maybe<Scalars['String']['output']>;
  georeferencedDate?: Maybe<Scalars['String']['output']>;
  group?: Maybe<Scalars['String']['output']>;
  /** Volatile: these values are tightly coupled to the webview and are likely to change frequently */
  groups?: Maybe<TermGroups>;
  habitat?: Maybe<Scalars['String']['output']>;
  hasFormat?: Maybe<Scalars['String']['output']>;
  hasPart?: Maybe<Scalars['String']['output']>;
  /** Volatile: these values are tightly coupled to the webview and are likely to change frequently */
  hasTaxonIssues?: Maybe<Scalars['Boolean']['output']>;
  hasVersion?: Maybe<Scalars['String']['output']>;
  higherClassification?: Maybe<Scalars['String']['output']>;
  higherGeography?: Maybe<Scalars['String']['output']>;
  higherGeographyID?: Maybe<Scalars['String']['output']>;
  highestBiostratigraphicZone?: Maybe<Scalars['String']['output']>;
  identificationID?: Maybe<Scalars['String']['output']>;
  identificationQualifier?: Maybe<Scalars['String']['output']>;
  identificationReferences?: Maybe<Scalars['String']['output']>;
  identificationRemarks?: Maybe<Scalars['String']['output']>;
  identificationVerificationStatus?: Maybe<Scalars['String']['output']>;
  identifiedBy?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  identifiedByIDs?: Maybe<Array<Maybe<AssociatedId>>>;
  identifier?: Maybe<Scalars['String']['output']>;
  individualCount?: Maybe<Scalars['Int']['output']>;
  informationWithheld?: Maybe<Scalars['String']['output']>;
  infraspecificEpithet?: Maybe<Scalars['String']['output']>;
  installationKey?: Maybe<Scalars['ID']['output']>;
  institution?: Maybe<Institution>;
  institutionCode?: Maybe<Scalars['String']['output']>;
  institutionID?: Maybe<Scalars['String']['output']>;
  institutionKey?: Maybe<Scalars['ID']['output']>;
  instructionalMethod?: Maybe<Scalars['String']['output']>;
  isFormatOf?: Maybe<Scalars['String']['output']>;
  isInCluster?: Maybe<Scalars['Boolean']['output']>;
  isPartOf?: Maybe<Scalars['String']['output']>;
  isReferencedBy?: Maybe<Scalars['String']['output']>;
  isReplacedBy?: Maybe<Scalars['String']['output']>;
  isRequiredBy?: Maybe<Scalars['String']['output']>;
  isVersionOf?: Maybe<Scalars['String']['output']>;
  island?: Maybe<Scalars['String']['output']>;
  islandGroup?: Maybe<Scalars['String']['output']>;
  issued?: Maybe<Scalars['String']['output']>;
  issues?: Maybe<Array<Maybe<OccurrenceIssue>>>;
  key?: Maybe<Scalars['Float']['output']>;
  kingdom?: Maybe<Scalars['String']['output']>;
  kingdomKey?: Maybe<Scalars['ID']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastCrawled?: Maybe<Scalars['DateTime']['output']>;
  lastParsed?: Maybe<Scalars['DateTime']['output']>;
  latestAgeOrHighestStage?: Maybe<Scalars['String']['output']>;
  latestEonOrHighestEonothem?: Maybe<Scalars['String']['output']>;
  latestEpochOrHighestSeries?: Maybe<Scalars['String']['output']>;
  latestEraOrHighestErathem?: Maybe<Scalars['String']['output']>;
  latestPeriodOrHighestSystem?: Maybe<Scalars['String']['output']>;
  license?: Maybe<License>;
  lifeStage?: Maybe<Scalars['String']['output']>;
  lithostratigraphicTerms?: Maybe<Scalars['String']['output']>;
  locality?: Maybe<Scalars['String']['output']>;
  locationAccordingTo?: Maybe<Scalars['String']['output']>;
  locationID?: Maybe<Scalars['String']['output']>;
  locationRemarks?: Maybe<Scalars['String']['output']>;
  lowestBiostratigraphicZone?: Maybe<Scalars['String']['output']>;
  materialSampleID?: Maybe<Scalars['String']['output']>;
  media?: Maybe<Array<Maybe<MultimediaItem>>>;
  mediator?: Maybe<Scalars['String']['output']>;
  medium?: Maybe<Scalars['String']['output']>;
  member?: Maybe<Scalars['String']['output']>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  month?: Maybe<Scalars['Int']['output']>;
  movingImageCount?: Maybe<Scalars['Int']['output']>;
  movingImages?: Maybe<Array<Maybe<MultimediaItem>>>;
  municipality?: Maybe<Scalars['String']['output']>;
  nameAccordingTo?: Maybe<Scalars['String']['output']>;
  nameAccordingToID?: Maybe<Scalars['String']['output']>;
  namePublishedIn?: Maybe<Scalars['String']['output']>;
  namePublishedInID?: Maybe<Scalars['String']['output']>;
  namePublishedInYear?: Maybe<Scalars['String']['output']>;
  networkKey?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  nomenclaturalCode?: Maybe<Scalars['String']['output']>;
  nomenclaturalStatus?: Maybe<Scalars['String']['output']>;
  occurrenceID?: Maybe<Scalars['String']['output']>;
  occurrenceRemarks?: Maybe<Scalars['String']['output']>;
  occurrenceStatus?: Maybe<OccurrenceStatus>;
  order?: Maybe<Scalars['String']['output']>;
  orderKey?: Maybe<Scalars['ID']['output']>;
  organismID?: Maybe<Scalars['String']['output']>;
  organismName?: Maybe<Scalars['String']['output']>;
  organismQuantity?: Maybe<Scalars['String']['output']>;
  organismQuantityType?: Maybe<Scalars['String']['output']>;
  organismRemarks?: Maybe<Scalars['String']['output']>;
  organismScope?: Maybe<Scalars['String']['output']>;
  originalNameUsage?: Maybe<Scalars['String']['output']>;
  originalNameUsageID?: Maybe<Scalars['String']['output']>;
  otherCatalogNumbers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  ownerInstitutionCode?: Maybe<Scalars['String']['output']>;
  parentEventID?: Maybe<Scalars['String']['output']>;
  parentNameUsage?: Maybe<Scalars['String']['output']>;
  parentNameUsageID?: Maybe<Scalars['String']['output']>;
  pathway?: Maybe<Scalars['String']['output']>;
  phylum?: Maybe<Scalars['String']['output']>;
  phylumKey?: Maybe<Scalars['ID']['output']>;
  pointRadiusSpatialFit?: Maybe<Scalars['String']['output']>;
  preparations?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  previousIdentifications?: Maybe<Scalars['String']['output']>;
  /** Currently the primary image is considered the first image retruned from the REST API */
  primaryImage?: Maybe<MultimediaItem>;
  protocol?: Maybe<Scalars['String']['output']>;
  provenance?: Maybe<Scalars['String']['output']>;
  /** as provided on record - this can differ from the GBIF publishing organisation */
  publisher?: Maybe<Scalars['String']['output']>;
  publisherTitle?: Maybe<Scalars['String']['output']>;
  /** The ID of the publisher who published this record to GBIF */
  publishingOrgKey?: Maybe<Scalars['ID']['output']>;
  recordNumber?: Maybe<Scalars['String']['output']>;
  recordedBy?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  recordedByIDs?: Maybe<Array<Maybe<AssociatedId>>>;
  references?: Maybe<Scalars['String']['output']>;
  /** Volatile: this is an experimental feature likely to change */
  related?: Maybe<RelatedOccurrences>;
  relation?: Maybe<Scalars['String']['output']>;
  replaces?: Maybe<Scalars['String']['output']>;
  reproductiveCondition?: Maybe<Scalars['String']['output']>;
  requires?: Maybe<Scalars['String']['output']>;
  rights?: Maybe<Scalars['String']['output']>;
  rightsHolder?: Maybe<Scalars['String']['output']>;
  sampleSizeUnit?: Maybe<Scalars['String']['output']>;
  sampleSizeValue?: Maybe<Scalars['Float']['output']>;
  samplingEffort?: Maybe<Scalars['String']['output']>;
  samplingProtocol?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  scientificName?: Maybe<Scalars['String']['output']>;
  scientificNameAuthorship?: Maybe<Scalars['String']['output']>;
  scientificNameID?: Maybe<Scalars['String']['output']>;
  sex?: Maybe<Scalars['String']['output']>;
  soundCount?: Maybe<Scalars['Int']['output']>;
  sounds?: Maybe<Array<Maybe<MultimediaItem>>>;
  source?: Maybe<Scalars['String']['output']>;
  spatial?: Maybe<Scalars['String']['output']>;
  species?: Maybe<Scalars['String']['output']>;
  speciesKey?: Maybe<Scalars['ID']['output']>;
  specificEpithet?: Maybe<Scalars['String']['output']>;
  startDayOfYear?: Maybe<Scalars['Int']['output']>;
  stateProvince?: Maybe<Scalars['String']['output']>;
  stillImageCount?: Maybe<Scalars['Int']['output']>;
  stillImages?: Maybe<Array<Maybe<MultimediaItem>>>;
  subgenus?: Maybe<Scalars['String']['output']>;
  subgenusKey?: Maybe<Scalars['ID']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  tableOfContents?: Maybe<Scalars['String']['output']>;
  taxonConceptID?: Maybe<Scalars['String']['output']>;
  taxonID?: Maybe<Scalars['String']['output']>;
  taxonKey?: Maybe<Scalars['ID']['output']>;
  taxonRank?: Maybe<Scalars['String']['output']>;
  taxonRemarks?: Maybe<Scalars['String']['output']>;
  taxonomicStatus?: Maybe<Scalars['String']['output']>;
  temporal?: Maybe<Scalars['String']['output']>;
  /** Volatile: these values are tightly coupled to the webview and are likely to change frequently */
  terms?: Maybe<Array<Maybe<Term>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  typeStatus?: Maybe<Array<Maybe<TypeStatus>>>;
  typifiedName?: Maybe<Scalars['String']['output']>;
  valid?: Maybe<Scalars['String']['output']>;
  verbatimCoordinateSystem?: Maybe<Scalars['String']['output']>;
  verbatimCoordinates?: Maybe<Scalars['String']['output']>;
  verbatimDepth?: Maybe<Scalars['String']['output']>;
  verbatimElevation?: Maybe<Scalars['String']['output']>;
  verbatimEventDate?: Maybe<Scalars['String']['output']>;
  verbatimIdentification?: Maybe<Scalars['String']['output']>;
  verbatimLatitude?: Maybe<Scalars['String']['output']>;
  verbatimLocality?: Maybe<Scalars['String']['output']>;
  verbatimLongitude?: Maybe<Scalars['String']['output']>;
  verbatimSRS?: Maybe<Scalars['String']['output']>;
  verbatimScientificName?: Maybe<Scalars['String']['output']>;
  verbatimTaxonRank?: Maybe<Scalars['String']['output']>;
  vernacularName?: Maybe<Scalars['String']['output']>;
  verticalDatum?: Maybe<Scalars['String']['output']>;
  /** Volatile: these values are tightly coupled to the webview and are likely to change frequently */
  volatile?: Maybe<VolatileOccurrenceData>;
  waterBody?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};


export type OccurrenceRelatedArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceAutoDateHistogram = {
  __typename?: 'OccurrenceAutoDateHistogram';
  eventDate: AutoDateHistogramResult;
};


export type OccurrenceAutoDateHistogramEventDateArgs = {
  buckets?: InputMaybe<Scalars['Float']['input']>;
  minimum_interval?: InputMaybe<Scalars['String']['input']>;
};

export type OccurrenceCardinality = {
  __typename?: 'OccurrenceCardinality';
  basisOfRecord: Scalars['Long']['output'];
  catalogNumber: Scalars['Long']['output'];
  classKey: Scalars['Long']['output'];
  collectionCode: Scalars['Long']['output'];
  collectionKey: Scalars['Long']['output'];
  continent: Scalars['Long']['output'];
  countryCode: Scalars['Long']['output'];
  datasetKey: Scalars['Long']['output'];
  dwcaExtension: Scalars['Long']['output'];
  establishmentMeans: Scalars['Long']['output'];
  eventId: Scalars['Long']['output'];
  familyKey: Scalars['Long']['output'];
  gadmGid: Scalars['Long']['output'];
  gbifClassification_usage_key: Scalars['Long']['output'];
  genusKey: Scalars['Long']['output'];
  hostingOrganizationKey: Scalars['Long']['output'];
  identifiedBy: Scalars['Long']['output'];
  institutionCode: Scalars['Long']['output'];
  institutionKey: Scalars['Long']['output'];
  issue: Scalars['Long']['output'];
  iucnRedListCategory: Scalars['Long']['output'];
  kingdomKey: Scalars['Long']['output'];
  license: Scalars['Long']['output'];
  locality: Scalars['Long']['output'];
  mediaType: Scalars['Long']['output'];
  month: Scalars['Long']['output'];
  networkKey: Scalars['Long']['output'];
  orderKey: Scalars['Long']['output'];
  phylumKey: Scalars['Long']['output'];
  preparations: Scalars['Long']['output'];
  programme: Scalars['Long']['output'];
  projectId: Scalars['Long']['output'];
  protocol: Scalars['Long']['output'];
  publishingCountry: Scalars['Long']['output'];
  publishingOrg: Scalars['Long']['output'];
  recordedBy: Scalars['Long']['output'];
  repatriated: Scalars['Long']['output'];
  sampleSizeUnit: Scalars['Long']['output'];
  samplingProtocol: Scalars['Long']['output'];
  speciesKey: Scalars['Long']['output'];
  stateProvince: Scalars['Long']['output'];
  taxonKey: Scalars['Long']['output'];
  typeStatus: Scalars['Long']['output'];
  verbatimScientificName: Scalars['Long']['output'];
  waterBody: Scalars['Long']['output'];
};

export type OccurrenceClusterLink = {
  __typename?: 'OccurrenceClusterLink';
  source: Scalars['ID']['output'];
  target: Scalars['ID']['output'];
};

export type OccurrenceClusterNode = {
  __typename?: 'OccurrenceClusterNode';
  basisOfRecord?: Maybe<BasisOfRecord>;
  catalogueNumber?: Maybe<Scalars['String']['output']>;
  datasetKey: Scalars['ID']['output'];
  datasetTitle: Scalars['String']['output'];
  isEntryNode?: Maybe<Scalars['Boolean']['output']>;
  key: Scalars['ID']['output'];
  publisherKey: Scalars['ID']['output'];
  publisherTitle: Scalars['String']['output'];
};

export type OccurrenceClusterSearchResult = {
  __typename?: 'OccurrenceClusterSearchResult';
  links?: Maybe<Array<Maybe<OccurrenceClusterLink>>>;
  nodes?: Maybe<Array<Maybe<OccurrenceClusterNode>>>;
};

export type OccurrenceDocuments = {
  __typename?: 'OccurrenceDocuments';
  from: Scalars['Int']['output'];
  results: Array<Maybe<Occurrence>>;
  size: Scalars['Int']['output'];
  total: Scalars['Long']['output'];
};

export type OccurrenceExtensions = {
  __typename?: 'OccurrenceExtensions';
  amplification?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  audubon?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  chronometricAge?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  cloning?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  dnaDerivedData?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  extendedMeasurementOrFact?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  gelImage?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  germplasmAccession?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  germplasmMeasurementScore?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  germplasmMeasurementTrait?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  germplasmMeasurementTrial?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  identification?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  identifier?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  image?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  loan?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  materialSample?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  measurementOrFact?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  multimedia?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  permit?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  preparation?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  preservation?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  reference?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  resourceRelationship?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
};

export type OccurrenceFacet = {
  __typename?: 'OccurrenceFacet';
  agentIds_type?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  agentIds_value?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  basisOfRecord?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  catalogNumber?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  classKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  collectionCode?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  collectionKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Collection>>>;
  continent?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  coordinatePrecision?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  coordinateUncertaintyInMeters?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  countryCode?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  crawlId?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  datasetKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Dataset>>>;
  datasetPublishingCountry?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  day?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  decimalLatitude?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  decimalLongitude?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  depth?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  depthAccuracy?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  dwcaExtension?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  elevation?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  elevationAccuracy?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  endDayOfYear?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  endorsingNodeKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Node>>>;
  establishmentMeans?: Maybe<Array<Maybe<OccurrenceFacetResult_EstablishmentMeans>>>;
  eventId?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  familyKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  gadmGid?: Maybe<Array<Maybe<OccurrenceFacetResult_Gadm>>>;
  gbifClassification_acceptedUsage_key?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  gbifClassification_acceptedUsage_rank?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_classificationPath?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_classification_key?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  gbifClassification_classification_rank?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_classification_synonym?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_diagnostics_matchType?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_diagnostics_status?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_synonym?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_taxonID?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_usageParsedName_abbreviated?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_autonym?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_basionymAuthorship_empty?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_basionymAuthorship_year?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_usageParsedName_binomial?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_candidatus?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_combinationAuthorship_empty?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_combinationAuthorship_year?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_usageParsedName_doubtful?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_incomplete?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_indetermined?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_notho?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_usageParsedName_rank?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_usageParsedName_state?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_usageParsedName_trinomial?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  gbifClassification_usageParsedName_type?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_usage_key?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  gbifClassification_usage_name?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  gbifClassification_usage_rank?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  genusKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  hasCoordinate?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  hasGeospatialIssue?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  hostingOrganizationKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Organization>>>;
  id?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  identifiedBy?: Maybe<Array<Maybe<OccurrenceFacetResult_IdentifiedBy>>>;
  individualCount?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  installationKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Installation>>>;
  institutionCode?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  institutionKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Institution>>>;
  issue?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  iucnRedListCategory?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  kingdomKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  license?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  lifeStage?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  locality?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  maximumDepthInMeters?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  maximumDistanceAboveSurfaceInMeters?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  maximumElevationInMeters?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  mediaLicenses?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  mediaType?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  minimumDepthInMeters?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  minimumDistanceAboveSurfaceInMeters?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  minimumElevationInMeters?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  month?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  networkKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Network>>>;
  occurrenceId?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  occurrenceStatus?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  orderKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  organismId?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  organismQuantity?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  organismQuantityType?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  parentEventId?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  phylumKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  preparations?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  programme?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  projectId?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  protocol?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  publishingCountry?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  publishingOrg?: Maybe<Array<Maybe<OccurrenceFacetResult_Organization>>>;
  recordNumber?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  recordedBy?: Maybe<Array<Maybe<OccurrenceFacetResult_RecordedBy>>>;
  relativeOrganismQuantity?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  repatriated?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  sampleSizeUnit?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  sampleSizeValue?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  samplingProtocol?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  sex?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  speciesKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  startDayOfYear?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  stateProvince?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  taxonKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  typeStatus?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  typifiedName?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  verbatimScientificName?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  waterBody?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  year?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
};


export type OccurrenceFacetAgentIds_TypeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetAgentIds_ValueArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetBasisOfRecordArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetCatalogNumberArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetClassKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetCollectionCodeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetCollectionKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetContinentArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetCoordinatePrecisionArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetCoordinateUncertaintyInMetersArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetCountryCodeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetCrawlIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetDatasetKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetDatasetPublishingCountryArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetDayArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetDecimalLatitudeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetDecimalLongitudeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetDepthArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetDepthAccuracyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetDwcaExtensionArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetElevationArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetElevationAccuracyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetEndDayOfYearArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetEndorsingNodeKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetEstablishmentMeansArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetEventIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetFamilyKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGadmGidArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_AcceptedUsage_KeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_AcceptedUsage_RankArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_ClassificationPathArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_Classification_KeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_Classification_RankArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_Classification_SynonymArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_Diagnostics_MatchTypeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_Diagnostics_StatusArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_SynonymArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_TaxonIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_AbbreviatedArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_AutonymArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_BasionymAuthorship_EmptyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_BasionymAuthorship_YearArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_BinomialArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_CandidatusArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_CombinationAuthorship_EmptyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_CombinationAuthorship_YearArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_DoubtfulArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_IncompleteArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_IndeterminedArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_NothoArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_RankArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_StateArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_TrinomialArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_UsageParsedName_TypeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_Usage_KeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_Usage_NameArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGbifClassification_Usage_RankArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetGenusKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetHasCoordinateArgs = {
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetHasGeospatialIssueArgs = {
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetHostingOrganizationKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetIdentifiedByArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetIndividualCountArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetInstallationKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetInstitutionCodeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetInstitutionKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetIssueArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetIucnRedListCategoryArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetKingdomKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetLicenseArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetLifeStageArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetLocalityArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMaximumDepthInMetersArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMaximumDistanceAboveSurfaceInMetersArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMaximumElevationInMetersArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMediaLicensesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMediaTypeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMinimumDepthInMetersArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMinimumDistanceAboveSurfaceInMetersArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMinimumElevationInMetersArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetMonthArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetNetworkKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetOccurrenceIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetOccurrenceStatusArgs = {
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetOrderKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetOrganismIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetOrganismQuantityArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetOrganismQuantityTypeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetParentEventIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetPhylumKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetPreparationsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetProgrammeArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetProjectIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetProtocolArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetPublishingCountryArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetPublishingOrgArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetRecordNumberArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetRecordedByArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetRelativeOrganismQuantityArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetRepatriatedArgs = {
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetSampleSizeUnitArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetSampleSizeValueArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetSamplingProtocolArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetSexArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetSpeciesKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetStartDayOfYearArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetStateProvinceArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetTaxonKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetTypeStatusArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetTypifiedNameArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetVerbatimScientificNameArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetWaterBodyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetYearArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Boolean = {
  __typename?: 'OccurrenceFacetResult_boolean';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['Boolean']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_BooleanOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Collection = {
  __typename?: 'OccurrenceFacetResult_collection';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  collection: Collection;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_CollectionOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Dataset = {
  __typename?: 'OccurrenceFacetResult_dataset';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  dataset: Dataset;
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_DatasetOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_EstablishmentMeans = {
  __typename?: 'OccurrenceFacetResult_establishmentMeans';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  concept: VocabularyConcept;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_EstablishmentMeansOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Float = {
  __typename?: 'OccurrenceFacetResult_float';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['Float']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_FloatOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Gadm = {
  __typename?: 'OccurrenceFacetResult_gadm';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  gadm: Gadm;
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_GadmOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_IdentifiedBy = {
  __typename?: 'OccurrenceFacetResult_identifiedBy';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
  occurrencesRecordedBy: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_IdentifiedByOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetResult_IdentifiedByOccurrencesRecordedByArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Installation = {
  __typename?: 'OccurrenceFacetResult_installation';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  installation: Node;
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_InstallationOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Institution = {
  __typename?: 'OccurrenceFacetResult_institution';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  institution: Institution;
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_InstitutionOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Network = {
  __typename?: 'OccurrenceFacetResult_network';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  network: Network;
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_NetworkOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Node = {
  __typename?: 'OccurrenceFacetResult_node';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  node: Node;
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_NodeOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Organization = {
  __typename?: 'OccurrenceFacetResult_organization';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
  publisher: Organization;
};


export type OccurrenceFacetResult_OrganizationOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_RecordedBy = {
  __typename?: 'OccurrenceFacetResult_recordedBy';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
  occurrencesIdentifiedBy: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_RecordedByOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetResult_RecordedByOccurrencesIdentifiedByArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_String = {
  __typename?: 'OccurrenceFacetResult_string';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_StringOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFacetResult_Taxon = {
  __typename?: 'OccurrenceFacetResult_taxon';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
  taxon: Taxon;
};


export type OccurrenceFacetResult_TaxonOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFeatures = {
  __typename?: 'OccurrenceFeatures';
  /** This occurrence has related records */
  isClustered?: Maybe<Scalars['Boolean']['output']>;
  /** The occurrence has fields that are intended for use by sampling events */
  isSamplingEvent?: Maybe<Scalars['Boolean']['output']>;
  /** Looks like it is sequenced based on extensions and fields */
  isSequenced?: Maybe<Scalars['Boolean']['output']>;
  /** Basis of record is either preserved specimen, living specimen, fossil specimen or material sample. */
  isSpecimen?: Maybe<Scalars['Boolean']['output']>;
  /** We know for sure that this is related to a treatment (based on the publisher) */
  isTreament?: Maybe<Scalars['Boolean']['output']>;
};

export type OccurrenceHistogram = {
  __typename?: 'OccurrenceHistogram';
  decimalLongitude: LongitudeHistogram;
  year?: Maybe<Scalars['JSON']['output']>;
};


export type OccurrenceHistogramDecimalLongitudeArgs = {
  interval?: InputMaybe<Scalars['Float']['input']>;
};


export type OccurrenceHistogramYearArgs = {
  interval?: InputMaybe<Scalars['Float']['input']>;
};

export enum OccurrenceIssue {
  AmbiguousCollection = 'AMBIGUOUS_COLLECTION',
  AmbiguousInstitution = 'AMBIGUOUS_INSTITUTION',
  BasisOfRecordInvalid = 'BASIS_OF_RECORD_INVALID',
  CollectionMatchFuzzy = 'COLLECTION_MATCH_FUZZY',
  CollectionMatchNone = 'COLLECTION_MATCH_NONE',
  ContinentCoordinateMismatch = 'CONTINENT_COORDINATE_MISMATCH',
  ContinentCountryMismatch = 'CONTINENT_COUNTRY_MISMATCH',
  ContinentDerivedFromCoordinates = 'CONTINENT_DERIVED_FROM_COORDINATES',
  ContinentDerivedFromCountry = 'CONTINENT_DERIVED_FROM_COUNTRY',
  ContinentInvalid = 'CONTINENT_INVALID',
  CoordinateAccuracyInvalid = 'COORDINATE_ACCURACY_INVALID',
  CoordinateInvalid = 'COORDINATE_INVALID',
  CoordinateOutOfRange = 'COORDINATE_OUT_OF_RANGE',
  CoordinatePrecisionInvalid = 'COORDINATE_PRECISION_INVALID',
  CoordinatePrecisionUncertaintyMismatch = 'COORDINATE_PRECISION_UNCERTAINTY_MISMATCH',
  CoordinateReprojected = 'COORDINATE_REPROJECTED',
  CoordinateReprojectionFailed = 'COORDINATE_REPROJECTION_FAILED',
  CoordinateReprojectionSuspicious = 'COORDINATE_REPROJECTION_SUSPICIOUS',
  CoordinateRounded = 'COORDINATE_ROUNDED',
  CoordinateUncertaintyMetersInvalid = 'COORDINATE_UNCERTAINTY_METERS_INVALID',
  CountryCoordinateMismatch = 'COUNTRY_COORDINATE_MISMATCH',
  CountryDerivedFromCoordinates = 'COUNTRY_DERIVED_FROM_COORDINATES',
  CountryInvalid = 'COUNTRY_INVALID',
  CountryMismatch = 'COUNTRY_MISMATCH',
  DepthMinMaxSwapped = 'DEPTH_MIN_MAX_SWAPPED',
  DepthNonNumeric = 'DEPTH_NON_NUMERIC',
  DepthNotMetric = 'DEPTH_NOT_METRIC',
  DepthUnlikely = 'DEPTH_UNLIKELY',
  DifferentOwnerInstitution = 'DIFFERENT_OWNER_INSTITUTION',
  ElevationMinMaxSwapped = 'ELEVATION_MIN_MAX_SWAPPED',
  ElevationNonNumeric = 'ELEVATION_NON_NUMERIC',
  ElevationNotMetric = 'ELEVATION_NOT_METRIC',
  ElevationUnlikely = 'ELEVATION_UNLIKELY',
  FootprintSrsInvalid = 'FOOTPRINT_SRS_INVALID',
  FootprintWktInvalid = 'FOOTPRINT_WKT_INVALID',
  FootprintWktMismatch = 'FOOTPRINT_WKT_MISMATCH',
  GeodeticDatumAssumedWgs84 = 'GEODETIC_DATUM_ASSUMED_WGS84',
  GeodeticDatumInvalid = 'GEODETIC_DATUM_INVALID',
  GeoreferencedDateInvalid = 'GEOREFERENCED_DATE_INVALID',
  GeoreferencedDateUnlikely = 'GEOREFERENCED_DATE_UNLIKELY',
  IdentifiedDateInvalid = 'IDENTIFIED_DATE_INVALID',
  IdentifiedDateUnlikely = 'IDENTIFIED_DATE_UNLIKELY',
  IndividualCountConflictsWithOccurrenceStatus = 'INDIVIDUAL_COUNT_CONFLICTS_WITH_OCCURRENCE_STATUS',
  IndividualCountInvalid = 'INDIVIDUAL_COUNT_INVALID',
  InstitutionCollectionMismatch = 'INSTITUTION_COLLECTION_MISMATCH',
  InstitutionMatchFuzzy = 'INSTITUTION_MATCH_FUZZY',
  InstitutionMatchNone = 'INSTITUTION_MATCH_NONE',
  InterpretationError = 'INTERPRETATION_ERROR',
  ModifiedDateInvalid = 'MODIFIED_DATE_INVALID',
  ModifiedDateUnlikely = 'MODIFIED_DATE_UNLIKELY',
  MultimediaDateInvalid = 'MULTIMEDIA_DATE_INVALID',
  MultimediaUriInvalid = 'MULTIMEDIA_URI_INVALID',
  OccurrenceStatusInferredFromBasisOfRecord = 'OCCURRENCE_STATUS_INFERRED_FROM_BASIS_OF_RECORD',
  OccurrenceStatusInferredFromIndividualCount = 'OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT',
  OccurrenceStatusUnparsable = 'OCCURRENCE_STATUS_UNPARSABLE',
  PossiblyOnLoan = 'POSSIBLY_ON_LOAN',
  PresumedNegatedLatitude = 'PRESUMED_NEGATED_LATITUDE',
  PresumedNegatedLongitude = 'PRESUMED_NEGATED_LONGITUDE',
  PresumedSwappedCoordinate = 'PRESUMED_SWAPPED_COORDINATE',
  RecordedDateInvalid = 'RECORDED_DATE_INVALID',
  RecordedDateMismatch = 'RECORDED_DATE_MISMATCH',
  RecordedDateUnlikely = 'RECORDED_DATE_UNLIKELY',
  ReferencesUriInvalid = 'REFERENCES_URI_INVALID',
  ScientificNameAndIdInconsistent = 'SCIENTIFIC_NAME_AND_ID_INCONSISTENT',
  ScientificNameIdNotFound = 'SCIENTIFIC_NAME_ID_NOT_FOUND',
  TaxonConceptIdNotFound = 'TAXON_CONCEPT_ID_NOT_FOUND',
  TaxonIdNotFound = 'TAXON_ID_NOT_FOUND',
  TaxonMatchAggregate = 'TAXON_MATCH_AGGREGATE',
  TaxonMatchFuzzy = 'TAXON_MATCH_FUZZY',
  TaxonMatchHigherrank = 'TAXON_MATCH_HIGHERRANK',
  TaxonMatchNameAndIdAmbiguous = 'TAXON_MATCH_NAME_AND_ID_AMBIGUOUS',
  TaxonMatchNone = 'TAXON_MATCH_NONE',
  TaxonMatchScientificNameIdIgnored = 'TAXON_MATCH_SCIENTIFIC_NAME_ID_IGNORED',
  TaxonMatchTaxonConceptIdIgnored = 'TAXON_MATCH_TAXON_CONCEPT_ID_IGNORED',
  TaxonMatchTaxonIdIgnored = 'TAXON_MATCH_TAXON_ID_IGNORED',
  TypeStatusInvalid = 'TYPE_STATUS_INVALID',
  ZeroCoordinate = 'ZERO_COORDINATE'
}

export type OccurrenceNameUsage = {
  __typename?: 'OccurrenceNameUsage';
  formattedName: Scalars['String']['output'];
  key: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['String']['output'];
};

export enum OccurrencePersistenceStatus {
  Deleted = 'DELETED',
  New = 'NEW',
  Unchanged = 'UNCHANGED',
  Updated = 'UPDATED'
}

export enum OccurrenceSchemaType {
  Abcd_1_2 = 'ABCD_1_2',
  Abcd_2_0_6 = 'ABCD_2_0_6',
  Dwca = 'DWCA',
  Dwc_1_0 = 'DWC_1_0',
  Dwc_1_4 = 'DWC_1_4',
  Dwc_2009 = 'DWC_2009',
  DwcManis = 'DWC_MANIS'
}

export type OccurrenceSearchResult = {
  __typename?: 'OccurrenceSearchResult';
  _downloadPredicate?: Maybe<Scalars['JSON']['output']>;
  _meta?: Maybe<Scalars['JSON']['output']>;
  _predicate?: Maybe<Scalars['JSON']['output']>;
  /** Register the search predicate with the v1 endpoints and get a hash back. This can be used to query e.g. the tile API. */
  _v1PredicateHash?: Maybe<Scalars['String']['output']>;
  autoDateHistogram?: Maybe<OccurrenceAutoDateHistogram>;
  /** Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set */
  cardinality?: Maybe<OccurrenceCardinality>;
  /** The occurrences that match the filter */
  documents: OccurrenceDocuments;
  /** Get number of occurrences per distinct values in a field. E.g. how many occurrences per year. */
  facet?: Maybe<OccurrenceFacet>;
  /** Get histogram for a numeric field with the option to specify an interval size */
  histogram?: Maybe<OccurrenceHistogram>;
  /** Get statistics for a numeric field. Minimimum value, maximum etc. */
  stats?: Maybe<OccurrenceStats>;
};


export type OccurrenceSearchResultDocumentsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceStats = {
  __typename?: 'OccurrenceStats';
  decimalLatitude: Stats;
  decimalLongitude: Stats;
  eventDate: Stats;
  year: Stats;
};

export enum OccurrenceStatus {
  Absent = 'ABSENT',
  Present = 'PRESENT'
}

export type OrcId = {
  __typename?: 'OrcID';
  key: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  wikidata?: Maybe<Scalars['JSON']['output']>;
};

export type Organization = {
  __typename?: 'Organization';
  abbreviation?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  city?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  contacts?: Maybe<Array<Contact>>;
  country?: Maybe<Country>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  endorsementApproved?: Maybe<Scalars['Boolean']['output']>;
  endorsingNode?: Maybe<Node>;
  endorsingNodeKey?: Maybe<Scalars['ID']['output']>;
  endpoints?: Maybe<Array<Maybe<Endpoint>>>;
  excerpt?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  hostedDataset: DatasetListResults;
  identifiers?: Maybe<Array<Maybe<Identifier>>>;
  installation: InstallationSearchResults;
  key: Scalars['ID']['output'];
  language?: Maybe<Language>;
  latitude?: Maybe<Scalars['Float']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  numPublishedDatasets?: Maybe<Scalars['Int']['output']>;
  phone?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  postalCode?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  publishedDataset: DatasetListResults;
  tags?: Maybe<Array<Maybe<Tag>>>;
  title?: Maybe<Scalars['String']['output']>;
};


export type OrganizationHostedDatasetArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type OrganizationInstallationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type OrganizationPublishedDatasetArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type OrganizationBreakdown = {
  __typename?: 'OrganizationBreakdown';
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
};

export type OrganizationSearchResult = {
  __typename?: 'OrganizationSearchResult';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Organization>;
};

export enum OrganizationUsageSortField {
  CountryCode = 'COUNTRY_CODE',
  OrganizationTitle = 'ORGANIZATION_TITLE',
  RecordCount = 'RECORD_COUNT'
}

export enum Origin {
  Autonym = 'AUTONYM',
  BasionymPlaceholder = 'BASIONYM_PLACEHOLDER',
  DenormedClassification = 'DENORMED_CLASSIFICATION',
  ExAuthorSynonym = 'EX_AUTHOR_SYNONYM',
  ImplicitName = 'IMPLICIT_NAME',
  MissingAccepted = 'MISSING_ACCEPTED',
  Other = 'OTHER',
  Proparte = 'PROPARTE',
  Source = 'SOURCE',
  VerbatimAccepted = 'VERBATIM_ACCEPTED',
  VerbatimBasionym = 'VERBATIM_BASIONYM',
  VerbatimParent = 'VERBATIM_PARENT'
}

export type PaginatedSearchResult = {
  __typename?: 'PaginatedSearchResult';
  count?: Maybe<Scalars['Int']['output']>;
  endOfRecords?: Maybe<Scalars['Boolean']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  offset?: Maybe<Scalars['Int']['output']>;
  results?: Maybe<Array<Maybe<SingleSearchResult>>>;
};

export type Participant = {
  __typename?: 'Participant';
  abbreviatedName?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Country>;
  gbifRegion?: Maybe<GbifRegion>;
  id: Scalars['ID']['output'];
  linksToSocialMedia?: Maybe<Array<Maybe<Link>>>;
  membershipStart?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  newsletters?: Maybe<Array<Maybe<Link>>>;
  nodeEstablishmentDate?: Maybe<Scalars['DateTime']['output']>;
  nodeFunding?: Maybe<Scalars['String']['output']>;
  nodeHasMandate?: Maybe<Scalars['Boolean']['output']>;
  nodeHistory?: Maybe<Scalars['String']['output']>;
  nodeMission?: Maybe<Scalars['String']['output']>;
  nodeStructure?: Maybe<Scalars['String']['output']>;
  participationStatus?: Maybe<ParticipationStatus>;
  primaryLink?: Maybe<Link>;
  progressAndPlans?: Maybe<Scalars['String']['output']>;
  rssFeeds?: Maybe<Array<Maybe<Link>>>;
  secondaryLinks?: Maybe<Array<Maybe<Link>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<NodeType>;
};

export type ParticipantOrFundingOrganisation = FundingOrganisation | Participant;

export type ParticipantSearchResults = {
  __typename?: 'ParticipantSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Participant>>;
};

export enum ParticipationStatus {
  Affiliate = 'AFFILIATE',
  Associate = 'ASSOCIATE',
  Former = 'FORMER',
  Observer = 'OBSERVER',
  Voting = 'VOTING'
}

export type Person = {
  __typename?: 'Person';
  birthDate?: Maybe<Scalars['JSON']['output']>;
  deathDate?: Maybe<Scalars['JSON']['output']>;
  image?: Maybe<Scalars['JSON']['output']>;
  name?: Maybe<Scalars['JSON']['output']>;
};

export enum PipelineStep_Status {
  Aborted = 'ABORTED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Queued = 'QUEUED',
  Running = 'RUNNING',
  Submitted = 'SUBMITTED'
}

export type Predicate = {
  distance?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['JSON']['input']>;
  longitude?: InputMaybe<Scalars['JSON']['input']>;
  predicate?: InputMaybe<Predicate>;
  predicates?: InputMaybe<Array<InputMaybe<Predicate>>>;
  type?: InputMaybe<PredicateType>;
  value?: InputMaybe<Scalars['JSON']['input']>;
  values?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
};

export enum PredicateType {
  And = 'and',
  Equals = 'equals',
  Fuzzy = 'fuzzy',
  GeoDistance = 'geoDistance',
  In = 'in',
  IsNotNull = 'isNotNull',
  Like = 'like',
  Nested = 'nested',
  Not = 'not',
  Or = 'or',
  Range = 'range',
  Within = 'within'
}

export enum PreservationMethodType {
  Alcohol = 'ALCOHOL',
  DeepFrozen = 'DEEP_FROZEN',
  Dried = 'DRIED',
  DriedAndPressed = 'DRIED_AND_PRESSED',
  Formalin = 'FORMALIN',
  FreezeDried = 'FREEZE_DRIED',
  Glycerin = 'GLYCERIN',
  GumArabic = 'GUM_ARABIC',
  MicroscopicPreparation = 'MICROSCOPIC_PREPARATION',
  Mounted = 'MOUNTED',
  NoTreatment = 'NO_TREATMENT',
  Other = 'OTHER',
  Pinned = 'PINNED',
  Refrigerated = 'REFRIGERATED'
}

export enum PreservationType {
  SampleCryopreserved = 'SAMPLE_CRYOPRESERVED',
  SampleDried = 'SAMPLE_DRIED',
  SampleEmbedded = 'SAMPLE_EMBEDDED',
  SampleFluidPreserved = 'SAMPLE_FLUID_PRESERVED',
  SampleFreezeDrying = 'SAMPLE_FREEZE_DRYING',
  SampleOther = 'SAMPLE_OTHER',
  SamplePinned = 'SAMPLE_PINNED',
  SamplePressed = 'SAMPLE_PRESSED',
  SampleSkeletonized = 'SAMPLE_SKELETONIZED',
  SampleSlideMount = 'SAMPLE_SLIDE_MOUNT',
  SampleSurfaceCoating = 'SAMPLE_SURFACE_COATING',
  SampleTanned = 'SAMPLE_TANNED',
  SampleWaxBlock = 'SAMPLE_WAX_BLOCK',
  StorageControlledAtmosphere = 'STORAGE_CONTROLLED_ATMOSPHERE',
  StorageFrozenBetweenMinus_132AndMinus_196 = 'STORAGE_FROZEN_BETWEEN_MINUS_132_AND_MINUS_196',
  StorageFrozenMinus_20 = 'STORAGE_FROZEN_MINUS_20',
  StorageFrozenMinus_80 = 'STORAGE_FROZEN_MINUS_80',
  StorageIndoors = 'STORAGE_INDOORS',
  StorageOther = 'STORAGE_OTHER',
  StorageOutdoors = 'STORAGE_OUTDOORS',
  StorageRecorded = 'STORAGE_RECORDED',
  StorageRefrigerated = 'STORAGE_REFRIGERATED',
  StorageVacuum = 'STORAGE_VACUUM'
}

export enum ProcessingErrorType {
  MissingBasisOfRecord = 'MISSING_BASIS_OF_RECORD',
  NegatedCoordinates = 'NEGATED_COORDINATES',
  NotParseableCountryName = 'NOT_PARSEABLE_COUNTRY_NAME'
}

export type ProfileDescription = {
  __typename?: 'ProfileDescription';
  created?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['Int']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  modified?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
};

export type Programme = {
  __typename?: 'Programme';
  acronym: Scalars['String']['output'];
  blocks?: Maybe<Array<BlockItem>>;
  body?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Array<DocumentAsset>>;
  events?: Maybe<Array<Event>>;
  excerpt?: Maybe<Scalars['String']['output']>;
  fundingOrganisations?: Maybe<Array<FundingOrganisation>>;
  homepage: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  meta?: Maybe<Scalars['JSON']['output']>;
  news?: Maybe<Array<News>>;
  primaryImage?: Maybe<AssetImage>;
  primaryLink?: Maybe<Link>;
  searchable: Scalars['Boolean']['output'];
  secondaryLinks?: Maybe<Array<Link>>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type Project = {
  __typename?: 'Project';
  abstract?: Maybe<Scalars['String']['output']>;
  contacts?: Maybe<Array<Maybe<Contact>>>;
  designDescription?: Maybe<Scalars['String']['output']>;
  funding?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['ID']['output']>;
  studyAreaDescription?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** _empty is nonsense, and only here as we are not allowed to extend an empty type. */
  _empty?: Maybe<Scalars['String']['output']>;
  article?: Maybe<Article>;
  backboneSearch: TaxonSearchResult;
  call?: Maybe<Call>;
  checklistRoots?: Maybe<TaxonListResult>;
  collection?: Maybe<Collection>;
  collectionSearch?: Maybe<CollectionSearchResults>;
  composition?: Maybe<Composition>;
  dataUse?: Maybe<DataUse>;
  dataset?: Maybe<Dataset>;
  datasetDownloads?: Maybe<DatasetDownloadListResults>;
  datasetSearch: DatasetSearchResults;
  directoryAmbasadors?: Maybe<DirectoryPersonRoleSearchResults>;
  directoryAwardWinners: Array<Maybe<DirectoryPerson>>;
  directoryMentors?: Maybe<DirectoryPersonRoleSearchResults>;
  directoryTranslators?: Maybe<DirectoryPersonRoleSearchResults>;
  download?: Maybe<Download>;
  event?: Maybe<Event>;
  fundingOrganisation?: Maybe<FundingOrganisation>;
  gadm?: Maybe<Gadm>;
  gbifDocument?: Maybe<Document>;
  gbifHome?: Maybe<Home>;
  gbifProject?: Maybe<GbifProject>;
  globe?: Maybe<Globe>;
  help?: Maybe<Help>;
  installation?: Maybe<Installation>;
  installationSearch?: Maybe<InstallationSearchResults>;
  institution?: Maybe<Institution>;
  institutionSearch?: Maybe<InstitutionSearchResults>;
  literature?: Maybe<Literature>;
  literatureSearch?: Maybe<LiteratureSearchResult>;
  network?: Maybe<Network>;
  networkSearch?: Maybe<NetworkSearchResults>;
  news?: Maybe<News>;
  node?: Maybe<Node>;
  nodeSearch?: Maybe<NodeSearchResults>;
  notification?: Maybe<Notification>;
  occurrence?: Maybe<Occurrence>;
  occurrenceClusterSearch?: Maybe<OccurrenceClusterSearchResult>;
  occurrenceSearch?: Maybe<OccurrenceSearchResult>;
  orcid?: Maybe<OrcId>;
  organization?: Maybe<Organization>;
  organizationSearch?: Maybe<OrganizationSearchResult>;
  participant?: Maybe<Participant>;
  participantSearch?: Maybe<ParticipantSearchResults>;
  person?: Maybe<Person>;
  programme?: Maybe<Programme>;
  resource?: Maybe<Resource>;
  resourceSearch?: Maybe<PaginatedSearchResult>;
  staffMember?: Maybe<StaffMember>;
  staffMemberSearch?: Maybe<StaffMemberSearchResults>;
  taxon?: Maybe<Taxon>;
  taxonMedia: Array<Image>;
  taxonSearch: TaxonSearchResult;
  /** Unstable endpoint! Will return a list of taxon suggestions based on the provided query string. The returned taxonKeys are for the backbone. The datasetKey parameter can be used to restrict the suggestions to a specific checklist, but the results will be matched to the backbone and discarded if there is no match. The limit parameter is indicative only, as the number of results returned may be less than the limit if there are no matches in the backbone or if there is duplicate matches. */
  taxonSuggestions: Array<Maybe<TaxonSuggestion>>;
  tool?: Maybe<Tool>;
  viaf?: Maybe<Viaf>;
  vocabulary?: Maybe<Vocabulary>;
  vocabularyConceptSearch?: Maybe<VocabularySearchResult>;
};


export type QueryArticleArgs = {
  id: Scalars['String']['input'];
};


export type QueryBackboneSearchArgs = {
  habitat?: InputMaybe<Array<InputMaybe<Habitat>>>;
  highertaxonKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hl?: InputMaybe<Scalars['Boolean']['input']>;
  isExtinct?: InputMaybe<Scalars['Boolean']['input']>;
  issue?: InputMaybe<Array<InputMaybe<NameUsageIssue>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nameType?: InputMaybe<Array<InputMaybe<NameType>>>;
  nomenclaturalStatus?: InputMaybe<Array<InputMaybe<NomenclaturalStatus>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  qField?: InputMaybe<Array<InputMaybe<TaxonSearchQField>>>;
  rank?: InputMaybe<Array<InputMaybe<Rank>>>;
  status?: InputMaybe<Array<InputMaybe<TaxonomicStatus>>>;
};


export type QueryCallArgs = {
  id: Scalars['String']['input'];
};


export type QueryChecklistRootsArgs = {
  datasetKey: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCollectionArgs = {
  key: Scalars['ID']['input'];
};


export type QueryCollectionSearchArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  alternativeCode?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<Scalars['ID']['input']>;
  contentType?: InputMaybe<Array<InputMaybe<CollectionContentType>>>;
  country?: InputMaybe<Array<InputMaybe<Country>>>;
  displayOnNHCPortal?: InputMaybe<Scalars['Boolean']['input']>;
  fuzzyName?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<Array<InputMaybe<Scalars['GUID']['input']>>>;
  institutionKey?: InputMaybe<Array<InputMaybe<Scalars['GUID']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  numberSpecimens?: InputMaybe<Scalars['String']['input']>;
  occurrenceCount?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  personalCollection?: InputMaybe<Scalars['Boolean']['input']>;
  preservationType?: InputMaybe<Array<InputMaybe<PreservationType>>>;
  q?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<CollectionsSortField>;
  sortOrder?: InputMaybe<SortOrder>;
};


export type QueryCompositionArgs = {
  id: Scalars['String']['input'];
};


export type QueryDataUseArgs = {
  id: Scalars['String']['input'];
};


export type QueryDatasetArgs = {
  key: Scalars['ID']['input'];
};


export type QueryDatasetDownloadsArgs = {
  datasetKey: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDatasetSearchArgs = {
  continent?: InputMaybe<Array<InputMaybe<Continent>>>;
  country?: InputMaybe<Array<InputMaybe<Country>>>;
  decade?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  endorsingNodeKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hl?: InputMaybe<Scalars['Boolean']['input']>;
  hostingOrg?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  keyword?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  license?: InputMaybe<Array<InputMaybe<License>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  networkKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  publishingCountry?: InputMaybe<Array<InputMaybe<Country>>>;
  publishingOrg?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  q?: InputMaybe<Scalars['String']['input']>;
  subtype?: InputMaybe<Array<InputMaybe<DatasetSubtype>>>;
  type?: InputMaybe<Array<InputMaybe<DatasetType>>>;
};


export type QueryDirectoryAmbasadorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDirectoryAwardWinnersArgs = {
  award?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryDirectoryMentorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDirectoryTranslatorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDownloadArgs = {
  key: Scalars['String']['input'];
};


export type QueryEventArgs = {
  id: Scalars['String']['input'];
};


export type QueryFundingOrganisationArgs = {
  id: Scalars['String']['input'];
};


export type QueryGadmArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGbifDocumentArgs = {
  id: Scalars['String']['input'];
};


export type QueryGbifProjectArgs = {
  id: Scalars['String']['input'];
};


export type QueryGlobeArgs = {
  cLat?: InputMaybe<Scalars['Float']['input']>;
  cLon?: InputMaybe<Scalars['Float']['input']>;
  graticule?: InputMaybe<Scalars['Boolean']['input']>;
  land?: InputMaybe<Scalars['Boolean']['input']>;
  pLat?: InputMaybe<Scalars['Float']['input']>;
  pLon?: InputMaybe<Scalars['Float']['input']>;
  sphere?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryHelpArgs = {
  identifier: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInstallationArgs = {
  key: Scalars['ID']['input'];
};


export type QueryInstallationSearchArgs = {
  identifier?: InputMaybe<Scalars['String']['input']>;
  identifierType?: InputMaybe<IdentifierType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineTagName?: InputMaybe<Scalars['String']['input']>;
  machineTagNamespace?: InputMaybe<Scalars['String']['input']>;
  machineTagValue?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInstitutionArgs = {
  key: Scalars['ID']['input'];
};


export type QueryInstitutionSearchArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  alternativeCode?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<Scalars['ID']['input']>;
  country?: InputMaybe<Array<InputMaybe<Country>>>;
  discipline?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  displayOnNHCPortal?: InputMaybe<Scalars['Boolean']['input']>;
  fuzzyName?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  institutionKey?: InputMaybe<Array<InputMaybe<Scalars['GUID']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  numberSpecimens?: InputMaybe<Scalars['String']['input']>;
  occurrenceCount?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<CollectionsSortField>;
  sortOrder?: InputMaybe<SortOrder>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLiteratureArgs = {
  key: Scalars['ID']['input'];
};


export type QueryLiteratureSearchArgs = {
  countriesOfCoverage?: InputMaybe<Array<InputMaybe<Country>>>;
  countriesOfResearcher?: InputMaybe<Array<InputMaybe<Country>>>;
  doi?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from?: InputMaybe<Scalars['Int']['input']>;
  gbifDatasetKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  gbifDownloadKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  gbifNetworkKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  literatureType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  openAccess?: InputMaybe<Scalars['Boolean']['input']>;
  peerReview?: InputMaybe<Scalars['Boolean']['input']>;
  predicate?: InputMaybe<Predicate>;
  publisher?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  publishingOrganizationKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  q?: InputMaybe<Scalars['String']['input']>;
  relevance?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  size?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  topics?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  year?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryNetworkArgs = {
  key: Scalars['ID']['input'];
};


export type QueryNetworkSearchArgs = {
  identifier?: InputMaybe<Scalars['String']['input']>;
  identifierType?: InputMaybe<IdentifierType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineTagName?: InputMaybe<Scalars['String']['input']>;
  machineTagNamespace?: InputMaybe<Scalars['String']['input']>;
  machineTagValue?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNewsArgs = {
  id: Scalars['String']['input'];
};


export type QueryNodeArgs = {
  key: Scalars['String']['input'];
};


export type QueryNodeSearchArgs = {
  identifier?: InputMaybe<Scalars['String']['input']>;
  identifierType?: InputMaybe<IdentifierType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineTagName?: InputMaybe<Scalars['String']['input']>;
  machineTagNamespace?: InputMaybe<Scalars['String']['input']>;
  machineTagValue?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNotificationArgs = {
  id: Scalars['String']['input'];
};


export type QueryOccurrenceArgs = {
  key: Scalars['ID']['input'];
};


export type QueryOccurrenceClusterSearchArgs = {
  apiKey?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOccurrenceSearchArgs = {
  apiKey?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrcidArgs = {
  key: Scalars['ID']['input'];
};


export type QueryOrganizationArgs = {
  key: Scalars['ID']['input'];
};


export type QueryOrganizationSearchArgs = {
  country?: InputMaybe<Country>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  identifierType?: InputMaybe<IdentifierType>;
  isEndorsed?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineTagName?: InputMaybe<Scalars['String']['input']>;
  machineTagNamespace?: InputMaybe<Scalars['String']['input']>;
  machineTagValue?: InputMaybe<Scalars['String']['input']>;
  networkKey?: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};


export type QueryParticipantArgs = {
  key: Scalars['String']['input'];
};


export type QueryParticipantSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPersonArgs = {
  expand?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProgrammeArgs = {
  id: Scalars['String']['input'];
};


export type QueryResourceArgs = {
  alias?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryResourceSearchArgs = {
  input?: InputMaybe<ResourceSearchInput>;
};


export type QueryStaffMemberArgs = {
  key: Scalars['String']['input'];
};


export type QueryStaffMemberSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  primaryCollection?: InputMaybe<Scalars['GUID']['input']>;
  primaryInstitution?: InputMaybe<Scalars['GUID']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTaxonArgs = {
  key: Scalars['ID']['input'];
};


export type QueryTaxonMediaArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  params?: InputMaybe<Scalars['JSON']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTaxonSearchArgs = {
  datasetKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  habitat?: InputMaybe<Array<InputMaybe<Habitat>>>;
  highertaxonKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hl?: InputMaybe<Scalars['Boolean']['input']>;
  isExtinct?: InputMaybe<Scalars['Boolean']['input']>;
  issue?: InputMaybe<Array<InputMaybe<NameUsageIssue>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nameType?: InputMaybe<Array<InputMaybe<NameType>>>;
  nomenclaturalStatus?: InputMaybe<Array<InputMaybe<NomenclaturalStatus>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  origin?: InputMaybe<Array<InputMaybe<Origin>>>;
  q?: InputMaybe<Scalars['String']['input']>;
  qField?: InputMaybe<Array<InputMaybe<TaxonSearchQField>>>;
  rank?: InputMaybe<Array<InputMaybe<Rank>>>;
  status?: InputMaybe<Array<InputMaybe<TaxonomicStatus>>>;
};


export type QueryTaxonSuggestionsArgs = {
  datasetKey?: InputMaybe<Scalars['ID']['input']>;
  language?: InputMaybe<Language>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  preferAccepted?: InputMaybe<Scalars['Boolean']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  strictMatching?: InputMaybe<Scalars['Boolean']['input']>;
  vernacularNamesOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryToolArgs = {
  id: Scalars['String']['input'];
};


export type QueryViafArgs = {
  key: Scalars['ID']['input'];
};


export type QueryVocabularyArgs = {
  key: Scalars['ID']['input'];
};


export type QueryVocabularyConceptSearchArgs = {
  deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  hasParent?: InputMaybe<Scalars['Boolean']['input']>;
  hasReplacement?: InputMaybe<Scalars['Boolean']['input']>;
  includeChildren?: InputMaybe<Scalars['Boolean']['input']>;
  includeChildrenCount?: InputMaybe<Scalars['Boolean']['input']>;
  includeParents?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parent?: InputMaybe<Scalars['String']['input']>;
  parentKey?: InputMaybe<Scalars['ID']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  replacedByKey?: InputMaybe<Scalars['ID']['input']>;
  vocabulary: Scalars['ID']['input'];
};

export enum Rank {
  Aberration = 'ABERRATION',
  Biovar = 'BIOVAR',
  Chemoform = 'CHEMOFORM',
  Chemovar = 'CHEMOVAR',
  Class = 'CLASS',
  Cohort = 'COHORT',
  Convariety = 'CONVARIETY',
  Cultivar = 'CULTIVAR',
  CultivarGroup = 'CULTIVAR_GROUP',
  Domain = 'DOMAIN',
  Family = 'FAMILY',
  Form = 'FORM',
  FormaSpecialis = 'FORMA_SPECIALIS',
  Genus = 'GENUS',
  Grandorder = 'GRANDORDER',
  Grex = 'GREX',
  Infraclass = 'INFRACLASS',
  Infracohort = 'INFRACOHORT',
  Infrafamily = 'INFRAFAMILY',
  InfragenericName = 'INFRAGENERIC_NAME',
  Infragenus = 'INFRAGENUS',
  Infrakingdom = 'INFRAKINGDOM',
  Infralegion = 'INFRALEGION',
  Infraorder = 'INFRAORDER',
  Infraphylum = 'INFRAPHYLUM',
  InfraspecificName = 'INFRASPECIFIC_NAME',
  InfrasubspecificName = 'INFRASUBSPECIFIC_NAME',
  Infratribe = 'INFRATRIBE',
  Kingdom = 'KINGDOM',
  Legion = 'LEGION',
  Magnorder = 'MAGNORDER',
  Morph = 'MORPH',
  Morphovar = 'MORPHOVAR',
  Natio = 'NATIO',
  Order = 'ORDER',
  Other = 'OTHER',
  Parvclass = 'PARVCLASS',
  Parvorder = 'PARVORDER',
  Pathovar = 'PATHOVAR',
  Phagovar = 'PHAGOVAR',
  Phylum = 'PHYLUM',
  Proles = 'PROLES',
  Race = 'RACE',
  Section = 'SECTION',
  Series = 'SERIES',
  Serovar = 'SEROVAR',
  Species = 'SPECIES',
  SpeciesAggregate = 'SPECIES_AGGREGATE',
  Strain = 'STRAIN',
  Subclass = 'SUBCLASS',
  Subcohort = 'SUBCOHORT',
  Subfamily = 'SUBFAMILY',
  Subform = 'SUBFORM',
  Subgenus = 'SUBGENUS',
  Subkingdom = 'SUBKINGDOM',
  Sublegion = 'SUBLEGION',
  Suborder = 'SUBORDER',
  Subphylum = 'SUBPHYLUM',
  Subsection = 'SUBSECTION',
  Subseries = 'SUBSERIES',
  Subspecies = 'SUBSPECIES',
  Subtribe = 'SUBTRIBE',
  Subvariety = 'SUBVARIETY',
  Superclass = 'SUPERCLASS',
  Supercohort = 'SUPERCOHORT',
  Superfamily = 'SUPERFAMILY',
  Superkingdom = 'SUPERKINGDOM',
  Superlegion = 'SUPERLEGION',
  Superorder = 'SUPERORDER',
  Superphylum = 'SUPERPHYLUM',
  Supertribe = 'SUPERTRIBE',
  SupragenericName = 'SUPRAGENERIC_NAME',
  Tribe = 'TRIBE',
  Unranked = 'UNRANKED',
  Variety = 'VARIETY'
}

export type RelatedCurrentOccurrence = {
  __typename?: 'RelatedCurrentOccurrence';
  occurrence?: Maybe<Occurrence>;
  /** The occurrence as provided by the cluster API. It only has relev */
  stub?: Maybe<RelatedOccurrenceStub>;
};

export type RelatedOccurrence = {
  __typename?: 'RelatedOccurrence';
  occurrence?: Maybe<Occurrence>;
  reasons: Array<Maybe<Scalars['String']['output']>>;
  /** The occurrence as provided by the cluster API. It only has relev */
  stub?: Maybe<RelatedOccurrenceStub>;
};

export type RelatedOccurrenceStub = {
  __typename?: 'RelatedOccurrenceStub';
  catalogNumber?: Maybe<Scalars['String']['output']>;
  datasetKey?: Maybe<Scalars['ID']['output']>;
  datasetName?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  gbifId?: Maybe<Scalars['ID']['output']>;
  occurrenceID?: Maybe<Scalars['String']['output']>;
  publishingOrgKey?: Maybe<Scalars['ID']['output']>;
  publishingOrgName?: Maybe<Scalars['String']['output']>;
  scientificName?: Maybe<Scalars['String']['output']>;
};

export type RelatedOccurrences = {
  __typename?: 'RelatedOccurrences';
  count?: Maybe<Scalars['Int']['output']>;
  currentOccurrence: RelatedCurrentOccurrence;
  from?: Maybe<Scalars['Int']['output']>;
  relatedOccurrences?: Maybe<Array<Maybe<RelatedOccurrence>>>;
  size?: Maybe<Scalars['Int']['output']>;
};

export enum RelationType {
  Endorses = 'ENDORSES',
  HasConstituent = 'HAS_CONSTITUENT',
  HasInstallation = 'HAS_INSTALLATION',
  Owns = 'OWNS',
  Serves = 'SERVES'
}

export type Resource = Article | Composition | DataUse | Document | Event | GbifProject | Help | Literature | News | Notification | Programme | Tool;

export type ResourceSearchInput = {
  contentType?: InputMaybe<Array<ContentType>>;
  countriesOfCoverage?: InputMaybe<Array<Scalars['String']['input']>>;
  countriesOfResearcher?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Array<Scalars['String']['input']>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<ResourceSortBy>;
  sortOrder?: InputMaybe<ResourceSortOrder>;
  start?: InputMaybe<Scalars['String']['input']>;
  topics?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum ResourceSortBy {
  CreatedAt = 'createdAt',
  End = 'end',
  Start = 'start'
}

export enum ResourceSortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export enum RunPipelineResponse_ResponseStatus {
  Error = 'ERROR',
  Ok = 'OK',
  PipelineInSubmitted = 'PIPELINE_IN_SUBMITTED',
  UnsupportedStep = 'UNSUPPORTED_STEP'
}

export type SamplingDescription = {
  __typename?: 'SamplingDescription';
  methodSteps?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  qualityControl?: Maybe<Scalars['String']['output']>;
  sampling?: Maybe<Scalars['String']['output']>;
  studyExtent?: Maybe<Scalars['String']['output']>;
};

export enum Sex {
  Female = 'FEMALE',
  Hermaphrodite = 'HERMAPHRODITE',
  Male = 'MALE',
  None = 'NONE'
}

export type SingleSearchResult = Article | Composition | DataUse | Document | Event | GbifProject | Help | Literature | News | Notification | Tool;

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum Source {
  Dataset = 'DATASET',
  IhIrn = 'IH_IRN',
  Organization = 'ORGANIZATION'
}

export type StaffMember = {
  __typename?: 'StaffMember';
  areaResponsibility?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['EmailAddress']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  identifiers?: Maybe<Array<Maybe<Identifier>>>;
  key: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  machineTags?: Maybe<Array<Maybe<MachineTag>>>;
  mailingAddress?: Maybe<Address>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  primaryCollection?: Maybe<Collection>;
  primaryCollectionKey?: Maybe<Scalars['GUID']['output']>;
  primaryInstitution?: Maybe<Institution>;
  primaryInstitutionKey?: Maybe<Scalars['GUID']['output']>;
  researchPursuits?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type StaffMemberSearchResults = {
  __typename?: 'StaffMemberSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<StaffMember>>;
};

export type Stats = {
  __typename?: 'Stats';
  avg?: Maybe<Scalars['Float']['output']>;
  count: Scalars['Float']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  sum?: Maybe<Scalars['Float']['output']>;
};

export enum StepRunner {
  Distributed = 'DISTRIBUTED',
  Standalone = 'STANDALONE',
  Unknown = 'UNKNOWN'
}

export enum StepType {
  AbcdToVerbatim = 'ABCD_TO_VERBATIM',
  DwcaToVerbatim = 'DWCA_TO_VERBATIM',
  EventsHdfsView = 'EVENTS_HDFS_VIEW',
  EventsInterpretedToIndex = 'EVENTS_INTERPRETED_TO_INDEX',
  EventsVerbatimToInterpreted = 'EVENTS_VERBATIM_TO_INTERPRETED',
  Fragmenter = 'FRAGMENTER',
  HdfsView = 'HDFS_VIEW',
  InterpretedToIndex = 'INTERPRETED_TO_INDEX',
  ToVerbatim = 'TO_VERBATIM',
  ValidatorAbcdToVerbatim = 'VALIDATOR_ABCD_TO_VERBATIM',
  ValidatorCollectMetrics = 'VALIDATOR_COLLECT_METRICS',
  ValidatorDwcaToVerbatim = 'VALIDATOR_DWCA_TO_VERBATIM',
  ValidatorInterpretedToIndex = 'VALIDATOR_INTERPRETED_TO_INDEX',
  ValidatorTabularToVerbatim = 'VALIDATOR_TABULAR_TO_VERBATIM',
  ValidatorUploadArchive = 'VALIDATOR_UPLOAD_ARCHIVE',
  ValidatorValidateArchive = 'VALIDATOR_VALIDATE_ARCHIVE',
  ValidatorVerbatimToInterpreted = 'VALIDATOR_VERBATIM_TO_INTERPRETED',
  ValidatorXmlToVerbatim = 'VALIDATOR_XML_TO_VERBATIM',
  VerbatimToIdentifier = 'VERBATIM_TO_IDENTIFIER',
  VerbatimToInterpreted = 'VERBATIM_TO_INTERPRETED',
  XmlToVerbatim = 'XML_TO_VERBATIM'
}

export type Tag = {
  __typename?: 'Tag';
  created: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  key: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export enum TagName {
  ArchiveOrigin = 'ARCHIVE_ORIGIN',
  ConceptualSchema = 'CONCEPTUAL_SCHEMA',
  CrawlAttempt = 'CRAWL_ATTEMPT',
  DatasetId = 'DATASET_ID',
  DatasetTitle = 'DATASET_TITLE',
  DateLastUpdated = 'DATE_LAST_UPDATED',
  DeclaredCount = 'DECLARED_COUNT',
  DigirCode = 'DIGIR_CODE',
  LocalId = 'LOCAL_ID',
  MaxSearchResponseRecords = 'MAX_SEARCH_RESPONSE_RECORDS',
  OmitFromScheduledCrawl = 'OMIT_FROM_SCHEDULED_CRAWL',
  OrphanedEndpoint = 'ORPHANED_ENDPOINT',
  OrphanDownload = 'ORPHAN_DOWNLOAD',
  OrphanDwcaCacheTime = 'ORPHAN_DWCA_CACHE_TIME',
  OrphanStatus = 'ORPHAN_STATUS'
}

export enum TagNamespace {
  Ala = 'ALA',
  Col = 'COL',
  Eol = 'EOL',
  GbifCrawler = 'GBIF_CRAWLER',
  GbifDefaultTerm = 'GBIF_DEFAULT_TERM',
  GbifHarvesting = 'GBIF_HARVESTING',
  GbifMetasync = 'GBIF_METASYNC',
  GbifOrphans = 'GBIF_ORPHANS',
  GbifValidator = 'GBIF_VALIDATOR',
  Public = 'PUBLIC'
}

export type Taxon = {
  __typename?: 'Taxon';
  accepted?: Maybe<Scalars['String']['output']>;
  acceptedKey?: Maybe<Scalars['Int']['output']>;
  authorship?: Maybe<Scalars['String']['output']>;
  backboneTaxon?: Maybe<Taxon>;
  canonicalName?: Maybe<Scalars['String']['output']>;
  /** Lists all direct child usages for a name usage */
  children?: Maybe<TaxonListResult>;
  class?: Maybe<Scalars['String']['output']>;
  classKey?: Maybe<Scalars['Int']['output']>;
  constituent?: Maybe<Dataset>;
  constituentKey?: Maybe<Scalars['ID']['output']>;
  constituentTitle?: Maybe<Scalars['String']['output']>;
  dataset?: Maybe<Dataset>;
  datasetKey?: Maybe<Scalars['ID']['output']>;
  datasetTitle: Scalars['String']['output'];
  /** Lists all descriptions for a name usage */
  descriptions?: Maybe<TaxonDescriptionResult>;
  /** Lists all distributions for a name usage */
  distributions?: Maybe<TaxonDistributionResult>;
  family?: Maybe<Scalars['String']['output']>;
  familyKey?: Maybe<Scalars['Int']['output']>;
  formattedName?: Maybe<Scalars['String']['output']>;
  genus?: Maybe<Scalars['String']['output']>;
  genusKey?: Maybe<Scalars['Int']['output']>;
  issues?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Lists all type specimens for a name usage, see also lmitations: https://github.com/gbif/portal-feedback/issues/1146#issuecomment-366260607 */
  iucnRedListCategory?: Maybe<IucnRedListCategoryResult>;
  key: Scalars['Int']['output'];
  kingdom?: Maybe<Scalars['String']['output']>;
  kingdomKey?: Maybe<Scalars['Int']['output']>;
  lastCrawled?: Maybe<Scalars['String']['output']>;
  lastInterpreted?: Maybe<Scalars['String']['output']>;
  /** Lists all media items for a name usage */
  media?: Maybe<MediaListResult>;
  /** Gets the parsed name for a name usage */
  name?: Maybe<TaxonName>;
  nameKey?: Maybe<Scalars['Int']['output']>;
  nameType?: Maybe<NameType>;
  nomenclaturalStatus?: Maybe<Array<Maybe<NomenclaturalStatus>>>;
  nubKey?: Maybe<Scalars['Int']['output']>;
  numDescendants?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['String']['output']>;
  orderKey?: Maybe<Scalars['Int']['output']>;
  origin?: Maybe<Origin>;
  parent?: Maybe<Scalars['String']['output']>;
  parentKey?: Maybe<Scalars['Int']['output']>;
  /** Lists all parent usages for a name usage */
  parents?: Maybe<Array<Maybe<Taxon>>>;
  phylum?: Maybe<Scalars['String']['output']>;
  phylumKey?: Maybe<Scalars['Int']['output']>;
  rank?: Maybe<Rank>;
  /** Lists all references for a name usage */
  references?: Maybe<TaxonReferenceResult>;
  /** Lists all related name usages in other checklists */
  related?: Maybe<TaxonListResult>;
  remarks?: Maybe<Scalars['String']['output']>;
  scientificName?: Maybe<Scalars['String']['output']>;
  sourceTaxonKey?: Maybe<Scalars['Int']['output']>;
  species?: Maybe<Scalars['String']['output']>;
  speciesKey?: Maybe<Scalars['Int']['output']>;
  /** Lists all species profiles for a name usage */
  speciesProfiles?: Maybe<TaxonProfileResult>;
  synonym?: Maybe<Scalars['Boolean']['output']>;
  /** Lists all synonyms for a name usage */
  synonyms?: Maybe<TaxonListResult>;
  taxonID?: Maybe<Scalars['String']['output']>;
  /** This is an experiment that might be stopped at any time. It is not part of the stable API. It will attempt ti find a nice image to represent the taxon. */
  taxonImages_volatile: Array<Maybe<Image>>;
  taxonomicStatus?: Maybe<Scalars['String']['output']>;
  /** Lists all type specimens for a name usage, see also lmitations: https://github.com/gbif/portal-feedback/issues/1146#issuecomment-366260607 */
  typeSpecimens?: Maybe<TaxonTypeSpecimenResult>;
  /** Gets the verbatim name usage */
  verbatim?: Maybe<Scalars['JSON']['output']>;
  vernacularName?: Maybe<Scalars['String']['output']>;
  /** Lists all vernacular names for a name usage */
  vernacularNames?: Maybe<TaxonVernacularNameResult>;
  wikiData?: Maybe<WikiDataTaxonData>;
};


export type TaxonChildrenArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonDescriptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonDistributionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonReferencesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonRelatedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonSpeciesProfilesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonSynonymsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonTaxonImages_VolatileArgs = {
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonTypeSpecimensArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonVernacularNamesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type TaxonBreakdown = {
  __typename?: 'TaxonBreakdown';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  taxon?: Maybe<Taxon>;
  taxonSearch: TaxonSearchResult;
};


export type TaxonBreakdownTaxonSearchArgs = {
  datasetKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  habitat?: InputMaybe<Array<InputMaybe<Habitat>>>;
  highertaxonKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hl?: InputMaybe<Scalars['String']['input']>;
  isExtinct?: InputMaybe<Scalars['Boolean']['input']>;
  issue?: InputMaybe<Array<InputMaybe<NameUsageIssue>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nameType?: InputMaybe<Array<InputMaybe<NameType>>>;
  nomenclaturalStatus?: InputMaybe<Array<InputMaybe<NomenclaturalStatus>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  rank?: InputMaybe<Array<InputMaybe<Rank>>>;
  status?: InputMaybe<Array<InputMaybe<TaxonomicStatus>>>;
};

export type TaxonCoverage = {
  __typename?: 'TaxonCoverage';
  commonName?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<TaxonCoverageRank>;
  scientificName?: Maybe<Scalars['String']['output']>;
};

export type TaxonCoverageRank = {
  __typename?: 'TaxonCoverageRank';
  interpreted?: Maybe<Scalars['String']['output']>;
  verbatim?: Maybe<Scalars['String']['output']>;
};

export type TaxonDescription = {
  __typename?: 'TaxonDescription';
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['Int']['output'];
  language?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  sourceTaxonKey: Scalars['Int']['output'];
  taxonKey: Scalars['Int']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type TaxonDescriptionResult = {
  __typename?: 'TaxonDescriptionResult';
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<TaxonDescription>>;
};

export type TaxonDistribution = {
  __typename?: 'TaxonDistribution';
  country?: Maybe<Country>;
  establishmentMeans?: Maybe<EstablishmentMeans>;
  locality?: Maybe<Scalars['String']['output']>;
  locationId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  sourceTaxonKey: Scalars['Int']['output'];
  status?: Maybe<OccurrenceStatus>;
  taxonKey: Scalars['Int']['output'];
  threatStatus?: Maybe<Scalars['String']['output']>;
};

export type TaxonDistributionResult = {
  __typename?: 'TaxonDistributionResult';
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<TaxonDistribution>>;
};

export type TaxonFacet = {
  __typename?: 'TaxonFacet';
  higherTaxon?: Maybe<Array<Maybe<TaxonBreakdown>>>;
  issue?: Maybe<Array<Maybe<TaxonFacetResult>>>;
  rank?: Maybe<Array<Maybe<TaxonFacetResult>>>;
  status?: Maybe<Array<Maybe<TaxonFacetResult>>>;
};


export type TaxonFacetHigherTaxonArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonFacetIssueArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonFacetRankArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonFacetStatusArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type TaxonFacetResult = {
  __typename?: 'TaxonFacetResult';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  taxonSearch: TaxonSearchResult;
};


export type TaxonFacetResultTaxonSearchArgs = {
  datasetKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  habitat?: InputMaybe<Array<InputMaybe<Habitat>>>;
  highertaxonKey?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  hl?: InputMaybe<Scalars['String']['input']>;
  isExtinct?: InputMaybe<Scalars['Boolean']['input']>;
  issue?: InputMaybe<Array<InputMaybe<NameUsageIssue>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nameType?: InputMaybe<Array<InputMaybe<NameType>>>;
  nomenclaturalStatus?: InputMaybe<Array<InputMaybe<NomenclaturalStatus>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  rank?: InputMaybe<Array<InputMaybe<Rank>>>;
  status?: InputMaybe<Array<InputMaybe<TaxonomicStatus>>>;
};

export type TaxonListResult = {
  __typename?: 'TaxonListResult';
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Taxon>>;
};

export type TaxonMedia = {
  __typename?: 'TaxonMedia';
  audience?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  creator?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['URL']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  references?: Maybe<Scalars['URL']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  taxonKey?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<MediaType>;
};

export type TaxonName = {
  __typename?: 'TaxonName';
  bracketAuthorship?: Maybe<Scalars['String']['output']>;
  bracketYear?: Maybe<Scalars['String']['output']>;
  canonicalName?: Maybe<Scalars['String']['output']>;
  canonicalNameComplete?: Maybe<Scalars['String']['output']>;
  canonicalNameWithMarker?: Maybe<Scalars['String']['output']>;
  genusOrAbove?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  parsed?: Maybe<Scalars['Boolean']['output']>;
  parsedPartially?: Maybe<Scalars['Boolean']['output']>;
  rankMarker?: Maybe<Scalars['String']['output']>;
  scientificName?: Maybe<Scalars['String']['output']>;
  specificEpithet?: Maybe<Scalars['String']['output']>;
  type?: Maybe<NameType>;
};

export type TaxonProfile = {
  __typename?: 'TaxonProfile';
  extinct?: Maybe<Scalars['Boolean']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  sourceTaxonKey: Scalars['Int']['output'];
  taxonKey: Scalars['Int']['output'];
};

export type TaxonProfileResult = {
  __typename?: 'TaxonProfileResult';
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<TaxonReference>>;
};

export type TaxonReference = {
  __typename?: 'TaxonReference';
  citation?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  sourceTaxonKey: Scalars['Int']['output'];
  taxonKey: Scalars['Int']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type TaxonReferenceResult = {
  __typename?: 'TaxonReferenceResult';
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<TaxonReference>>;
};

export enum TaxonSearchQField {
  Description = 'DESCRIPTION',
  Scientific = 'SCIENTIFIC',
  Vernacular = 'VERNACULAR'
}

export type TaxonSearchResult = {
  __typename?: 'TaxonSearchResult';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  facet?: Maybe<TaxonFacet>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Taxon>>;
};

export type TaxonSuggestion = {
  __typename?: 'TaxonSuggestion';
  acceptedNameOf?: Maybe<Scalars['String']['output']>;
  canonicalName?: Maybe<Scalars['String']['output']>;
  classification?: Maybe<Array<Maybe<Classification>>>;
  key: Scalars['Int']['output'];
  rank?: Maybe<Rank>;
  scientificName?: Maybe<Scalars['String']['output']>;
  taxonomicStatus?: Maybe<TaxonomicStatus>;
  vernacularName?: Maybe<Scalars['String']['output']>;
};

export type TaxonTypeSpecimen = {
  __typename?: 'TaxonTypeSpecimen';
  scientificName?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  sourceTaxonKey?: Maybe<Scalars['Int']['output']>;
  taxonKey: Scalars['Int']['output'];
  typeDesignatedBy?: Maybe<Scalars['String']['output']>;
};

export type TaxonTypeSpecimenResult = {
  __typename?: 'TaxonTypeSpecimenResult';
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<TaxonTypeSpecimen>>;
};

export type TaxonVernacularName = {
  __typename?: 'TaxonVernacularName';
  country?: Maybe<Country>;
  language?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  sourceTaxonKey: Scalars['Int']['output'];
  taxonKey: Scalars['Int']['output'];
  vernacularName: Scalars['String']['output'];
};

export type TaxonVernacularNameResult = {
  __typename?: 'TaxonVernacularNameResult';
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<TaxonVernacularName>>;
};

export type TaxonomicCoverage = {
  __typename?: 'TaxonomicCoverage';
  coverages?: Maybe<Array<Maybe<TaxonCoverage>>>;
  description?: Maybe<Scalars['String']['output']>;
};

export enum TaxonomicStatus {
  Accepted = 'ACCEPTED',
  Doubtful = 'DOUBTFUL',
  HeterotypicSynonym = 'HETEROTYPIC_SYNONYM',
  HomotypicSynonym = 'HOMOTYPIC_SYNONYM',
  Misapplied = 'MISAPPLIED',
  ProparteSynonym = 'PROPARTE_SYNONYM',
  Synonym = 'SYNONYM'
}

export enum TechnicalInstallationType {
  BiocaseInstallation = 'BIOCASE_INSTALLATION',
  DiGirInstallation = 'DiGIR_INSTALLATION',
  HttpInstallation = 'HTTP_INSTALLATION',
  IptInstallation = 'IPT_INSTALLATION',
  TapirInstallation = 'TAPIR_INSTALLATION'
}

export type Term = {
  __typename?: 'Term';
  group?: Maybe<Scalars['String']['output']>;
  htmlValue?: Maybe<Scalars['JSON']['output']>;
  issues?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  qualifiedName?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  simpleName?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['JSON']['output']>;
  verbatim?: Maybe<Scalars['JSON']['output']>;
};

export type TermGroups = {
  __typename?: 'TermGroups';
  event: Scalars['JSON']['output'];
  geologicalContext: Scalars['JSON']['output'];
  identification: Scalars['JSON']['output'];
  location: Scalars['JSON']['output'];
  materialSample: Scalars['JSON']['output'];
  occurrence: Scalars['JSON']['output'];
  organism: Scalars['JSON']['output'];
  other: Scalars['JSON']['output'];
  record: Scalars['JSON']['output'];
  taxon: Scalars['JSON']['output'];
};

export type TextBlock = {
  __typename?: 'TextBlock';
  backgroundColour?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  hideTitle?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export enum ThreatStatus {
  CriticallyEndangered = 'CRITICALLY_ENDANGERED',
  DataDeficient = 'DATA_DEFICIENT',
  Endangered = 'ENDANGERED',
  Extinct = 'EXTINCT',
  ExtinctInTheWild = 'EXTINCT_IN_THE_WILD',
  LeastConcern = 'LEAST_CONCERN',
  NearThreatened = 'NEAR_THREATENED',
  NotApplicable = 'NOT_APPLICABLE',
  NotEvaluated = 'NOT_EVALUATED',
  RegionallyExtinct = 'REGIONALLY_EXTINCT',
  Vulnerable = 'VULNERABLE'
}

export type Tool = {
  __typename?: 'Tool';
  author?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  citation?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  gbifHref: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  machineIdentifier?: Maybe<Scalars['String']['output']>;
  primaryImage?: Maybe<AssetImage>;
  primaryLink?: Maybe<Link>;
  publicationDate?: Maybe<Scalars['DateTime']['output']>;
  rights?: Maybe<Scalars['String']['output']>;
  rightsHolder?: Maybe<Scalars['String']['output']>;
  secondaryLinks?: Maybe<Array<Maybe<Link>>>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum TypeDesignationType {
  AbsoluteTautonymy = 'ABSOLUTE_TAUTONYMY',
  LinnaeanTautonymy = 'LINNAEAN_TAUTONYMY',
  Monotypy = 'MONOTYPY',
  OriginalDesignation = 'ORIGINAL_DESIGNATION',
  PresentDesignation = 'PRESENT_DESIGNATION',
  RulingByCommission = 'RULING_BY_COMMISSION',
  SubsequentDesignation = 'SUBSEQUENT_DESIGNATION',
  SubsequentMonotypy = 'SUBSEQUENT_MONOTYPY',
  Tautonymy = 'TAUTONYMY'
}

export enum TypeStatus {
  Allolectotype = 'ALLOLECTOTYPE',
  Alloneotype = 'ALLONEOTYPE',
  Allotype = 'ALLOTYPE',
  Cotype = 'COTYPE',
  Epitype = 'EPITYPE',
  Exepitype = 'EXEPITYPE',
  Exholotype = 'EXHOLOTYPE',
  Exisotype = 'EXISOTYPE',
  Exlectotype = 'EXLECTOTYPE',
  Exneotype = 'EXNEOTYPE',
  Exparatype = 'EXPARATYPE',
  Exsyntype = 'EXSYNTYPE',
  Extype = 'EXTYPE',
  Hapantotype = 'HAPANTOTYPE',
  Holotype = 'HOLOTYPE',
  Hypotype = 'HYPOTYPE',
  Iconotype = 'ICONOTYPE',
  Isolectotype = 'ISOLECTOTYPE',
  Isoneotype = 'ISONEOTYPE',
  Isoparatype = 'ISOPARATYPE',
  Isosyntype = 'ISOSYNTYPE',
  Isotype = 'ISOTYPE',
  Lectotype = 'LECTOTYPE',
  Neotype = 'NEOTYPE',
  Notatype = 'NOTATYPE',
  Originalmaterial = 'ORIGINALMATERIAL',
  Paralectotype = 'PARALECTOTYPE',
  Paraneotype = 'PARANEOTYPE',
  Paratype = 'PARATYPE',
  Plastoholotype = 'PLASTOHOLOTYPE',
  Plastoisotype = 'PLASTOISOTYPE',
  Plastolectotype = 'PLASTOLECTOTYPE',
  Plastoneotype = 'PLASTONEOTYPE',
  Plastoparatype = 'PLASTOPARATYPE',
  Plastosyntype = 'PLASTOSYNTYPE',
  Plastotype = 'PLASTOTYPE',
  Plesiotype = 'PLESIOTYPE',
  Secondarytype = 'SECONDARYTYPE',
  Supplementarytype = 'SUPPLEMENTARYTYPE',
  Syntype = 'SYNTYPE',
  Topotype = 'TOPOTYPE',
  Type = 'TYPE',
  TypeGenus = 'TYPE_GENUS',
  TypeSpecies = 'TYPE_SPECIES'
}

export type UsageParsedName = {
  __typename?: 'UsageParsedName';
  abbreviated?: Maybe<Scalars['Boolean']['output']>;
  autonym?: Maybe<Scalars['Boolean']['output']>;
  basionymAuthorship?: Maybe<BasionymAuthorship>;
  binomial?: Maybe<Scalars['Boolean']['output']>;
  candidatus?: Maybe<Scalars['Boolean']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  combinationAuthorship?: Maybe<CombinationAuthorship>;
  doubtful?: Maybe<Scalars['Boolean']['output']>;
  genericName?: Maybe<Scalars['String']['output']>;
  genus?: Maybe<Scalars['String']['output']>;
  incomplete?: Maybe<Scalars['Boolean']['output']>;
  indetermined?: Maybe<Scalars['Boolean']['output']>;
  infraspecificEpithet?: Maybe<Scalars['String']['output']>;
  notho?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['String']['output']>;
  specificEpithet?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  terminalEpithet?: Maybe<Scalars['String']['output']>;
  trinomial?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  uninomial?: Maybe<Scalars['String']['output']>;
  unparsed?: Maybe<Scalars['String']['output']>;
};

export type UserId = {
  __typename?: 'UserId';
  id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export enum UserRole {
  Admin = 'ADMIN',
  ColAdmin = 'COL_ADMIN',
  ColEditor = 'COL_EDITOR',
  DataRepoUser = 'DATA_REPO_USER',
  Editor = 'EDITOR',
  GrscicollAdmin = 'GRSCICOLL_ADMIN',
  GrscicollEditor = 'GRSCICOLL_EDITOR',
  GrscicollMediator = 'GRSCICOLL_MEDIATOR',
  IdigbioGrscicollEditor = 'IDIGBIO_GRSCICOLL_EDITOR',
  RegistryAdmin = 'REGISTRY_ADMIN',
  RegistryEditor = 'REGISTRY_EDITOR',
  User = 'USER',
  VocabularyAdmin = 'VOCABULARY_ADMIN',
  VocabularyEditor = 'VOCABULARY_EDITOR'
}

export type Viaf = {
  __typename?: 'Viaf';
  birthDate?: Maybe<Scalars['String']['output']>;
  deathDate?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  wikidata?: Maybe<Scalars['JSON']['output']>;
};

export type Vocabulary = {
  __typename?: 'Vocabulary';
  concepts: ConceptSearchResult;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  definition: Array<Maybe<VocabularyDefinition>>;
  deprecated?: Maybe<Scalars['DateTime']['output']>;
  deprecatedBy?: Maybe<Scalars['String']['output']>;
  editorialNotes: Array<Maybe<Scalars['String']['output']>>;
  externalDefinitions: Array<Maybe<Scalars['String']['output']>>;
  key: Scalars['ID']['output'];
  label: Array<Maybe<VocabularyLabel>>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  namespace?: Maybe<Scalars['String']['output']>;
  replacedByKey?: Maybe<Scalars['ID']['output']>;
  uiDefinition?: Maybe<Scalars['String']['output']>;
  uiLabel?: Maybe<Scalars['String']['output']>;
};


export type VocabularyConceptsArgs = {
  deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  hasParent?: InputMaybe<Scalars['Boolean']['input']>;
  hasReplacement?: InputMaybe<Scalars['Boolean']['input']>;
  includeChildren?: InputMaybe<Scalars['Boolean']['input']>;
  includeChildrenCount?: InputMaybe<Scalars['Boolean']['input']>;
  includeParents?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parent?: InputMaybe<Scalars['String']['input']>;
  parentKey?: InputMaybe<Scalars['ID']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  replacedByKey?: InputMaybe<Scalars['ID']['input']>;
};


export type VocabularyUiDefinitionArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};


export type VocabularyUiLabelArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};

export type VocabularyConcept = {
  __typename?: 'VocabularyConcept';
  alternativeLabelsLink?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  childrenCount?: Maybe<Scalars['Int']['output']>;
  created?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  definition: Array<Maybe<VocabularyDefinition>>;
  deprecated?: Maybe<Scalars['String']['output']>;
  deprecatedBy?: Maybe<Scalars['String']['output']>;
  editorialNotes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  externalDefinitions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  hiddenLabelsLink?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  label?: Maybe<Array<Maybe<VocabularyLabel>>>;
  modified?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parentKey?: Maybe<Scalars['ID']['output']>;
  parents?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  replacedByKey?: Maybe<Scalars['ID']['output']>;
  sameAsUris?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags: Array<Maybe<VocabularyTag>>;
  uiDefinition?: Maybe<Scalars['String']['output']>;
  uiLabel?: Maybe<Scalars['String']['output']>;
  vocabularyKey?: Maybe<Scalars['ID']['output']>;
};


export type VocabularyConceptUiDefinitionArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};


export type VocabularyConceptUiLabelArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};

export type VocabularyDefinition = {
  __typename?: 'VocabularyDefinition';
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type VocabularyLabel = {
  __typename?: 'VocabularyLabel';
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type VocabularySearchResult = {
  __typename?: 'VocabularySearchResult';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<Vocabulary>>;
};

export type VocabularyTag = {
  __typename?: 'VocabularyTag';
  color?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['Int']['output'];
  modified?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type VolatileOccurrenceData = {
  __typename?: 'VolatileOccurrenceData';
  /** Duck typing various features that is worth highlighting */
  features?: Maybe<OccurrenceFeatures>;
  globe?: Maybe<Globe>;
};


export type VolatileOccurrenceDataGlobeArgs = {
  graticule?: InputMaybe<Scalars['Boolean']['input']>;
  land?: InputMaybe<Scalars['Boolean']['input']>;
  sphere?: InputMaybe<Scalars['Boolean']['input']>;
};

export type WikiDataIdentifier = {
  __typename?: 'WikiDataIdentifier';
  description?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['String']['output'];
  label?: Maybe<Scalars['JSON']['output']>;
  url: Scalars['String']['output'];
};

export type WikiDataTaxonData = {
  __typename?: 'WikiDataTaxonData';
  identifiers?: Maybe<Array<Maybe<WikiDataIdentifier>>>;
  iucn?: Maybe<WikiDataTaxonIucnData>;
  source?: Maybe<WikiDataTaxonSourceItem>;
};

export type WikiDataTaxonIucnData = {
  __typename?: 'WikiDataTaxonIUCNData';
  identifier: WikiDataIdentifier;
  threatStatus: Scalars['JSON']['output'];
};

export type WikiDataTaxonSourceItem = {
  __typename?: 'WikiDataTaxonSourceItem';
  id: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type GlobeQueryVariables = Exact<{
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
}>;


export type GlobeQuery = { __typename?: 'Query', globe?: { __typename?: 'Globe', svg: string } | null };

export type HeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type HeaderQuery = { __typename?: 'Query', gbifHome?: { __typename?: 'Home', title: string, summary?: string | null, children?: Array<{ __typename?: 'MenuItem', externalLink?: boolean | null, link?: string | null, title?: string | null, children?: Array<{ __typename?: 'MenuItem', externalLink?: boolean | null, link?: string | null, title?: string | null, children?: Array<{ __typename?: 'MenuItem', externalLink?: boolean | null, link?: string | null, title?: string | null } | null> | null } | null> | null } | null> | null } | null };

export type HelpTextQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
}>;


export type HelpTextQuery = { __typename?: 'Query', help?: { __typename?: 'Help', id: string, identifier?: string | null, title: string, body?: string | null } | null };

export type HelpTitleQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
}>;


export type HelpTitleQuery = { __typename?: 'Query', help?: { __typename?: 'Help', id: string, identifier?: string | null, title: string } | null };

export type CollectionQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', key: string, active?: boolean | null, code?: string | null, name?: string | null, description?: string | null, taxonomicCoverage?: string | null, geography?: string | null, notes?: string | null, homepage?: any | null, numberSpecimens?: number | null, incorporatedCollections?: Array<string | null> | null, importantCollectors?: Array<string | null> | null, contentTypes?: Array<CollectionContentType | null> | null, personalCollection?: boolean | null, email?: Array<string | null> | null, phone?: Array<string | null> | null, catalogUrl?: any | null, apiUrl?: any | null, preservationTypes?: Array<PreservationType | null> | null, accessionStatus?: AccessionStatus | null, created?: string | null, deleted?: string | null, modified?: string | null, modifiedBy?: string | null, institutionKey?: string | null, collectionSummary?: any | null, replacedByCollection?: { __typename?: 'Collection', name?: string | null, key: string } | null, identifiers?: Array<{ __typename?: 'Identifier', key: string, type: IdentifierType, identifier: string } | null> | null, contactPersons: Array<{ __typename?: 'ContactPerson', key?: string | null, firstName?: string | null, lastName?: string | null, phone: Array<string | null>, email: Array<string | null>, taxonomicExpertise: Array<string | null>, primary?: boolean | null, position: Array<string | null>, userIds: Array<{ __typename?: 'UserId', type?: string | null, id?: string | null } | null> } | null>, alternativeCodes?: Array<{ __typename?: 'AlternativeCode', code: string, description?: string | null } | null> | null, institution?: { __typename?: 'Institution', code?: string | null, name?: string | null, key: string } | null, mailingAddress?: { __typename?: 'Address', address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: Country | null } | null, address?: { __typename?: 'Address', address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: Country | null } | null } | null };

export type CollectionSummaryMetricsQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
  imagePredicate?: InputMaybe<Predicate>;
  coordinatePredicate?: InputMaybe<Predicate>;
  clusterPredicate?: InputMaybe<Predicate>;
}>;


export type CollectionSummaryMetricsQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any }, cardinality?: { __typename?: 'OccurrenceCardinality', recordedBy: any } | null } | null, withImages?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withCoordinates?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withClusters?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null };

export type DatasetStubResultFragment = { __typename?: 'DatasetSearchStub', key: string, title?: string | null, excerpt?: string | null, type?: DatasetType | null, publishingOrganizationTitle?: string | null };

export type DatasetResultFragment = { __typename?: 'Dataset', key: string, title?: string | null, excerpt?: string | null, type?: DatasetType | null, publishingOrganizationTitle?: string | null };

export type DatasetQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type DatasetQuery = { __typename?: 'Query', dataset?: { __typename?: 'Dataset', title?: string | null, type?: DatasetType | null, deleted?: string | null, created?: string | null, publishingOrganizationKey: string, publishingOrganizationTitle?: string | null, contactsCitation?: Array<{ __typename?: 'ContactsCitation', key: number, abbreviatedName?: string | null, firstName?: string | null, lastName?: string | null, userId?: Array<any | null> | null, roles?: Array<string | null> | null }> | null } | null };

export type InstallationDatasetsQueryVariables = Exact<{
  installation: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type InstallationDatasetsQuery = { __typename?: 'Query', installation?: { __typename?: 'Installation', dataset: { __typename?: 'DatasetListResults', limit: number, offset: number, count: number, endOfRecords: boolean, results: Array<{ __typename?: 'Dataset', key: string, title?: string | null, excerpt?: string | null, type?: DatasetType | null, publishingOrganizationTitle?: string | null }> } } | null };

export type InstallationQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type InstallationQuery = { __typename?: 'Query', installation?: { __typename?: 'Installation', key: string, title?: string | null, description?: string | null, deleted?: string | null, created?: string | null, homepage?: string | null, type?: string | null, endpoints?: Array<{ __typename?: 'Endpoint', type: EndpointType, url?: any | null } | null> | null, organization?: { __typename?: 'Organization', key: string, title?: string | null } | null, contacts?: Array<{ __typename?: 'Contact', key?: string | null, type?: string | null, firstName?: string | null, lastName?: string | null, email?: Array<string | null> | null, phone?: Array<string | null> | null, homepage?: Array<any | null> | null, organization?: string | null, roles?: Array<string | null> | null, userId?: Array<string | null> | null }> | null, dataset: { __typename?: 'DatasetListResults', count: number } } | null };

export type InstitutionQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type InstitutionQuery = { __typename?: 'Query', institution?: { __typename?: 'Institution', key: string, code?: string | null, name?: string | null, description?: string | null, active?: boolean | null, email?: Array<string | null> | null, phone?: Array<string | null> | null, homepage?: any | null, catalogUrl?: any | null, type?: InstitutionType | null, apiUrl?: any | null, institutionalGovernance?: InstitutionGovernance | null, disciplines?: Array<Discipline | null> | null, latitude?: number | null, longitude?: number | null, additionalNames?: Array<string | null> | null, foundingDate?: number | null, geographicDescription?: string | null, taxonomicDescription?: string | null, numberSpecimens?: number | null, indexHerbariorumRecord?: boolean | null, logoUrl?: any | null, citesPermitNumber?: string | null, created?: string | null, deleted?: string | null, modified?: string | null, modifiedBy?: string | null, alternativeCodes?: Array<{ __typename?: 'AlternativeCode', code: string, description?: string | null } | null> | null, masterSourceMetadata?: { __typename?: 'MasterSourceMetadata', key: string, source: string, sourceId: string } | null, replacedByInstitution?: { __typename?: 'Institution', name?: string | null, key: string } | null, identifiers?: Array<{ __typename?: 'Identifier', identifier: string, type: IdentifierType } | null> | null, contactPersons: Array<{ __typename?: 'ContactPerson', key?: string | null, firstName?: string | null, lastName?: string | null, phone: Array<string | null>, email: Array<string | null>, taxonomicExpertise: Array<string | null>, primary?: boolean | null, position: Array<string | null>, userIds: Array<{ __typename?: 'UserId', type?: string | null, id?: string | null } | null> } | null>, mailingAddress?: { __typename?: 'Address', address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: Country | null } | null, address?: { __typename?: 'Address', address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: Country | null } | null, collections?: Array<{ __typename?: 'Collection', key: string, excerpt?: string | null, code?: string | null, name?: string | null, active?: boolean | null, numberSpecimens?: number | null, richness?: number | null } | null> | null } | null };

export type InstitutionSummaryMetricsQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  predicate?: InputMaybe<Predicate>;
  imagePredicate?: InputMaybe<Predicate>;
  coordinatePredicate?: InputMaybe<Predicate>;
  clusterPredicate?: InputMaybe<Predicate>;
}>;


export type InstitutionSummaryMetricsQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, institution?: { __typename?: 'Institution', key: string, collections?: Array<{ __typename?: 'Collection', key: string, occurrenceCount?: number | null, richness?: number | null } | null> | null } | null, withImages?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withCoordinates?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withClusters?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null };

export type NetworkAboutTabFragment = { __typename?: 'NetworkProse', title: string, summary?: string | null, excerpt?: string | null, body?: string | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null };

export type NetworkDatasetsQueryVariables = Exact<{
  network: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type NetworkDatasetsQuery = { __typename?: 'Query', network?: { __typename?: 'Network', constituents?: { __typename?: 'DatasetListResults', limit: number, offset: number, count: number, endOfRecords: boolean, results: Array<{ __typename?: 'Dataset', key: string, title?: string | null, excerpt?: string | null, type?: DatasetType | null, publishingOrganizationTitle?: string | null }> } | null } | null };

export type NetworkQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  predicate?: InputMaybe<Predicate>;
}>;


export type NetworkQuery = { __typename?: 'Query', network?: { __typename?: 'Network', title?: string | null, deleted?: string | null, created?: string | null, homepage?: Array<any | null> | null, numConstituents?: number | null, prose?: { __typename?: 'NetworkProse', title: string, summary?: string | null, excerpt?: string | null, body?: string | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null } | null } | null, occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', total: any } } | null };

export type NetworkPublishersQueryVariables = Exact<{
  network: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type NetworkPublishersQuery = { __typename?: 'Query', network?: { __typename?: 'Network', organizations?: { __typename?: 'OrganizationSearchResult', limit: number, count: number, offset: number, results: Array<{ __typename?: 'Organization', key: string, title?: string | null, created?: string | null, country?: Country | null, logoUrl?: string | null, excerpt?: string | null }> } | null } | null };

export type OccurrenceQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type OccurrenceQuery = { __typename?: 'Query', occurrence?: { __typename?: 'Occurrence', key?: number | null, coordinates?: any | null, countryCode?: Country | null, eventDate?: string | null, typeStatus?: Array<TypeStatus | null> | null, issues?: Array<OccurrenceIssue | null> | null, datasetKey?: string | null, datasetTitle?: string | null, publishingOrgKey?: string | null, publisherTitle?: string | null, institutionCode?: string | null, gadm?: any | null, stillImageCount?: number | null, movingImageCount?: number | null, soundCount?: number | null, scientificName?: string | null, institution?: { __typename?: 'Institution', name?: string | null, key: string } | null, collection?: { __typename?: 'Collection', name?: string | null, key: string } | null, volatile?: { __typename?: 'VolatileOccurrenceData', globe?: { __typename?: 'Globe', svg: string, lat: number, lon: number } | null, features?: { __typename?: 'OccurrenceFeatures', isSpecimen?: boolean | null, isTreament?: boolean | null, isSequenced?: boolean | null, isClustered?: boolean | null, isSamplingEvent?: boolean | null } | null } | null, dataset?: { __typename?: 'Dataset', key: string, title?: string | null, citation?: { __typename?: 'Citation', text: string } | null } | null, recordedByIDs?: Array<{ __typename?: 'AssociatedID', value?: string | null, person?: { __typename?: 'Person', name?: any | null, birthDate?: any | null, deathDate?: any | null, image?: any | null } | null } | null> | null, identifiedByIDs?: Array<{ __typename?: 'AssociatedID', value?: string | null, person?: { __typename?: 'Person', name?: any | null, birthDate?: any | null, deathDate?: any | null, image?: any | null } | null } | null> | null, extensions?: { __typename?: 'OccurrenceExtensions', audubon?: Array<any | null> | null, amplification?: Array<any | null> | null, germplasmAccession?: Array<any | null> | null, germplasmMeasurementScore?: Array<any | null> | null, germplasmMeasurementTrait?: Array<any | null> | null, germplasmMeasurementTrial?: Array<any | null> | null, identification?: Array<any | null> | null, identifier?: Array<any | null> | null, image?: Array<any | null> | null, measurementOrFact?: Array<any | null> | null, multimedia?: Array<any | null> | null, reference?: Array<any | null> | null, resourceRelationship?: Array<any | null> | null, cloning?: Array<any | null> | null, gelImage?: Array<any | null> | null, loan?: Array<any | null> | null, materialSample?: Array<any | null> | null, permit?: Array<any | null> | null, preparation?: Array<any | null> | null, preservation?: Array<any | null> | null, extendedMeasurementOrFact?: Array<any | null> | null, chronometricAge?: Array<any | null> | null, dnaDerivedData?: Array<any | null> | null } | null, stillImages?: Array<{ __typename?: 'MultimediaItem', type?: string | null, format?: string | null, identifier?: string | null, created?: string | null, creator?: string | null, license?: string | null, publisher?: string | null, references?: string | null, rightsHolder?: string | null, description?: string | null } | null> | null, sounds?: Array<{ __typename?: 'MultimediaItem', type?: string | null, format?: string | null, identifier?: string | null, created?: string | null, creator?: string | null, license?: string | null, publisher?: string | null, references?: string | null, rightsHolder?: string | null, description?: string | null } | null> | null, movingImages?: Array<{ __typename?: 'MultimediaItem', type?: string | null, format?: string | null, identifier?: string | null, created?: string | null, creator?: string | null, license?: string | null, publisher?: string | null, references?: string | null, rightsHolder?: string | null, description?: string | null } | null> | null, gbifClassification?: { __typename?: 'GbifClassification', kingdom?: string | null, kingdomKey?: number | null, phylum?: string | null, phylumKey?: number | null, class?: string | null, classKey?: number | null, order?: string | null, orderKey?: number | null, family?: string | null, familyKey?: number | null, genus?: string | null, genusKey?: number | null, species?: string | null, speciesKey?: number | null, synonym?: boolean | null, classification?: Array<{ __typename?: 'Classification', key?: number | null, rank?: string | null, name?: string | null } | null> | null, usage?: { __typename?: 'OccurrenceNameUsage', rank: string, formattedName: string, key: number } | null, acceptedUsage?: { __typename?: 'OccurrenceNameUsage', formattedName: string, key: number } | null } | null, primaryImage?: { __typename?: 'MultimediaItem', identifier?: string | null } | null, terms?: Array<{ __typename?: 'Term', simpleName?: string | null, verbatim?: any | null, value?: any | null, htmlValue?: any | null, remarks?: string | null, issues?: Array<any | null> | null } | null> | null } | null };

export type OccurrenceMediaDetailsFragment = { __typename?: 'MultimediaItem', type?: string | null, format?: string | null, identifier?: string | null, created?: string | null, creator?: string | null, license?: string | null, publisher?: string | null, references?: string | null, rightsHolder?: string | null, description?: string | null };

export type OccurrenceSearchQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceSearchQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', from: number, size: number, total: any, results: Array<{ __typename?: 'Occurrence', key?: number | null, scientificName?: string | null, eventDate?: string | null, coordinates?: any | null, county?: string | null, basisOfRecord?: string | null, datasetName?: Array<string | null> | null, publisherTitle?: string | null } | null> } } | null };

export type PublisherQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type PublisherQuery = { __typename?: 'Query', publisher?: { __typename?: 'Organization', title?: string | null, description?: string | null, deleted?: string | null, created?: string | null, homepage?: Array<string | null> | null, numPublishedDatasets?: number | null, contacts?: Array<{ __typename?: 'Contact', key?: string | null, type?: string | null, firstName?: string | null, lastName?: string | null, email?: Array<string | null> | null, phone?: Array<string | null> | null, homepage?: Array<any | null> | null, organization?: string | null, roles?: Array<string | null> | null, userId?: Array<string | null> | null }> | null } | null, occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, hostedDatasets: { __typename?: 'DatasetSearchResults', count: number }, literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', total: any } } | null };

export type PublisherResultFragment = { __typename?: 'Organization', key: string, title?: string | null, created?: string | null, country?: Country | null, logoUrl?: string | null, excerpt?: string | null };

export type AliasHandlingQueryVariables = Exact<{
  alias: Scalars['String']['input'];
}>;


export type AliasHandlingQuery = { __typename?: 'Query', resource?: { __typename: 'Article', id: string, title: string, urlAlias?: string | null } | { __typename: 'Composition', id: string, urlAlias?: string | null, maybeTitle?: string | null } | { __typename: 'DataUse', id: string, title: string } | { __typename: 'Document', id: string, title: string } | { __typename: 'Event', id: string, title: string } | { __typename: 'GbifProject', id: string, title: string } | { __typename: 'Help' } | { __typename: 'Literature' } | { __typename: 'News', id: string, title: string } | { __typename: 'Notification' } | { __typename: 'Programme', id: string, title: string } | { __typename: 'Tool', id: string, title: string } | null };

export type ArticlePageFragment = { __typename?: 'Article', id: string, title: string, summary?: string | null, excerpt?: string | null, body?: string | null, topics?: Array<string | null> | null, purposes?: Array<string | null> | null, audiences?: Array<string | null> | null, citation?: string | null, createdAt?: string | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null } | null> | null };

export type ArticleBannerFragment = { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } };

export type DocumentPreviewFragment = { __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null };

export type FundingOrganisationDetailsFragment = { __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null };

export type ProgrammeFundingBannerFragment = { __typename: 'Programme', fundingOrganisations?: Array<{ __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null };

export type ProjectFundingBannerFragment = { __typename: 'GbifProject', fundsAllocated?: number | null, programme?: { __typename: 'Programme', fundingOrganisations?: Array<{ __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null } | null, overrideProgrammeFunding?: Array<{ __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null } | null> | null };

type BlockItemDetails_CarouselBlock_Fragment = { __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null };

type BlockItemDetails_CustomComponentBlock_Fragment = { __typename: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null };

type BlockItemDetails_FeatureBlock_Fragment = { __typename: 'FeatureBlock', id: string, maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Event', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null };

type BlockItemDetails_FeaturedTextBlock_Fragment = { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null };

type BlockItemDetails_HeaderBlock_Fragment = { __typename: 'HeaderBlock', id: string, title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null };

type BlockItemDetails_MediaBlock_Fragment = { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null };

type BlockItemDetails_MediaCountBlock_Fragment = { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null };

type BlockItemDetails_TextBlock_Fragment = { __typename: 'TextBlock', id: string, title?: string | null, body?: string | null, hideTitle?: boolean | null, backgroundColour?: string | null };

export type BlockItemDetailsFragment = BlockItemDetails_CarouselBlock_Fragment | BlockItemDetails_CustomComponentBlock_Fragment | BlockItemDetails_FeatureBlock_Fragment | BlockItemDetails_FeaturedTextBlock_Fragment | BlockItemDetails_HeaderBlock_Fragment | BlockItemDetails_MediaBlock_Fragment | BlockItemDetails_MediaCountBlock_Fragment | BlockItemDetails_TextBlock_Fragment;

export type CarouselBlockDetailsFragment = { __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null };

export type CustomComponentBlockDetailsFragment = { __typename?: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null };

export type FeatureBlockDetailsFragment = { __typename: 'FeatureBlock', maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Event', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null };

export type FeaturedTextBlockDetailsFragment = { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null };

export type HeaderBlockDetailsFragment = { __typename: 'HeaderBlock', title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null };

export type MediaBlockDetailsFragment = { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null };

export type MediaCountBlockDetailsFragment = { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null };

export type TextBlockDetailsFragment = { __typename?: 'TextBlock', title?: string | null, body?: string | null, hideTitle?: boolean | null, id: string, backgroundColour?: string | null };

export type CompositionPageFragment = { __typename?: 'Composition', id: string, summary?: string | null, excerpt?: string | null, maybeTitle?: string | null, blocks?: Array<{ __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null } | { __typename: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null } | { __typename: 'FeatureBlock', id: string, maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Event', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null } | { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null } | { __typename: 'HeaderBlock', id: string, title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null } | { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'TextBlock', id: string, title?: string | null, body?: string | null, hideTitle?: boolean | null, backgroundColour?: string | null }> | null };

export type ProseCardImgFragment = { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } };

type ResourceRedirectDetails_Article_Fragment = { __typename: 'Article', id: string, title: string, urlAlias?: string | null };

type ResourceRedirectDetails_Composition_Fragment = { __typename: 'Composition', id: string, urlAlias?: string | null, maybeTitle?: string | null };

type ResourceRedirectDetails_DataUse_Fragment = { __typename: 'DataUse', id: string, title: string };

type ResourceRedirectDetails_Document_Fragment = { __typename: 'Document', id: string, title: string };

type ResourceRedirectDetails_Event_Fragment = { __typename: 'Event', id: string, title: string };

type ResourceRedirectDetails_GbifProject_Fragment = { __typename: 'GbifProject', id: string, title: string };

type ResourceRedirectDetails_Help_Fragment = { __typename: 'Help' };

type ResourceRedirectDetails_Literature_Fragment = { __typename: 'Literature' };

type ResourceRedirectDetails_News_Fragment = { __typename: 'News', id: string, title: string };

type ResourceRedirectDetails_Notification_Fragment = { __typename: 'Notification' };

type ResourceRedirectDetails_Programme_Fragment = { __typename: 'Programme', id: string, title: string };

type ResourceRedirectDetails_Tool_Fragment = { __typename: 'Tool', id: string, title: string };

export type ResourceRedirectDetailsFragment = ResourceRedirectDetails_Article_Fragment | ResourceRedirectDetails_Composition_Fragment | ResourceRedirectDetails_DataUse_Fragment | ResourceRedirectDetails_Document_Fragment | ResourceRedirectDetails_Event_Fragment | ResourceRedirectDetails_GbifProject_Fragment | ResourceRedirectDetails_Help_Fragment | ResourceRedirectDetails_Literature_Fragment | ResourceRedirectDetails_News_Fragment | ResourceRedirectDetails_Notification_Fragment | ResourceRedirectDetails_Programme_Fragment | ResourceRedirectDetails_Tool_Fragment;

export type DataUsePageFragment = { __typename?: 'DataUse', id: string, title: string, summary?: string | null, resourceUsed?: string | null, excerpt?: string | null, body?: string | null, countriesOfCoverage?: Array<string | null> | null, topics?: Array<string | null> | null, purposes?: Array<string | null> | null, audiences?: Array<string | null> | null, citation?: string | null, createdAt?: string | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null };

export type DocumentPageFragment = { __typename?: 'Document', id: string, title: string, createdAt?: string | null, excerpt?: string | null, summary?: string | null, body?: string | null, citation?: string | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, document?: { __typename?: 'DocumentAsset', title?: string | null, description?: string | null, file?: { __typename?: 'DocumentAssetFile', fileName?: string | null, url?: string | null } | null } | null };

export type EventPageFragment = { __typename?: 'Event', id: string, title: string, summary?: string | null, excerpt?: string | null, body?: string | null, location?: string | null, country?: string | null, start: string, end?: string | null, eventLanguage?: string | null, venue?: string | null, allDayEvent?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null } | null> | null };

export type EventResultFragment = { __typename?: 'Event', id: string, title: string, excerpt?: string | null, country?: string | null, location?: string | null, venue?: string | null, start: string, end?: string | null, gbifsAttendee?: string | null, allDayEvent?: boolean | null, primaryLink?: { __typename?: 'Link', url: string } | null };

export type NewsPageFragment = { __typename?: 'News', id: string, title: string, summary?: string | null, excerpt?: string | null, body?: string | null, countriesOfCoverage?: Array<string | null> | null, topics?: Array<string | null> | null, purposes?: Array<string | null> | null, audiences?: Array<string | null> | null, citation?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null };

export type NewsResultFragment = { __typename?: 'News', id: string, title: string, excerpt?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null };

export type ProgrammePageFragment = { __typename: 'Programme', title: string, excerpt?: string | null, blocks?: Array<{ __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null } | { __typename: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null } | { __typename: 'FeatureBlock', id: string, maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Event', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null } | { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null } | { __typename: 'HeaderBlock', id: string, title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null } | { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'TextBlock', id: string, title?: string | null, body?: string | null, hideTitle?: boolean | null, backgroundColour?: string | null }> | null, fundingOrganisations?: Array<{ __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null };

export type ProjectPageFragment = { __typename: 'GbifProject', title: string, excerpt?: string | null, status?: string | null, start?: string | null, end?: string | null, fundsAllocated?: number | null, projectId?: string | null, id: string, body?: string | null, matchingFunds?: number | null, grantType?: string | null, purposes?: Array<string> | null, leadContact?: string | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, programme?: { __typename: 'Programme', id: string, title: string, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null } | null, overrideProgrammeFunding?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null } | null> | null, leadPartner?: { __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null, additionalPartners?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string }> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null }> | null };

export type ProjectQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type ProjectQuery = { __typename?: 'Query', resource?: { __typename: 'Article', id: string, title: string, urlAlias?: string | null } | { __typename: 'Composition', id: string, urlAlias?: string | null, maybeTitle?: string | null } | { __typename: 'DataUse', id: string, title: string } | { __typename: 'Document', id: string, title: string } | { __typename: 'Event', id: string, title: string } | { __typename: 'GbifProject', title: string, excerpt?: string | null, status?: string | null, start?: string | null, end?: string | null, fundsAllocated?: number | null, id: string, projectId?: string | null, body?: string | null, matchingFunds?: number | null, grantType?: string | null, purposes?: Array<string> | null, leadContact?: string | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, programme?: { __typename: 'Programme', id: string, title: string, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null } | null, overrideProgrammeFunding?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null } | null> | null, leadPartner?: { __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null, additionalPartners?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string }> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null }> | null } | { __typename: 'Help' } | { __typename: 'Literature' } | { __typename: 'News', id: string, title: string } | { __typename: 'Notification' } | { __typename: 'Programme', id: string, title: string } | { __typename: 'Tool', id: string, title: string } | null, gbifProject?: { __typename?: 'GbifProject', projectId?: string | null } | null, datasetsHelp?: { __typename?: 'Help', title: string } | null };

export type ProjectAboutTabFragment = { __typename?: 'GbifProject', projectId?: string | null, id: string, body?: string | null, start?: string | null, end?: string | null, status?: string | null, fundsAllocated?: number | null, matchingFunds?: number | null, grantType?: string | null, purposes?: Array<string> | null, leadContact?: string | null, leadPartner?: { __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null, additionalPartners?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, programme?: { __typename?: 'Programme', id: string, title: string, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null }> | null } | null, overrideProgrammeFunding?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | null> | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string }> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null }> | null };

type ParticipantOrFundingOrganisationDetails_FundingOrganisation_Fragment = { __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null };

type ParticipantOrFundingOrganisationDetails_Participant_Fragment = { __typename: 'Participant', id: string, title?: string | null };

export type ParticipantOrFundingOrganisationDetailsFragment = ParticipantOrFundingOrganisationDetails_FundingOrganisation_Fragment | ParticipantOrFundingOrganisationDetails_Participant_Fragment;

export type ProjectDatasetsTabFragment = { __typename?: 'Query', gbifProject?: { __typename?: 'GbifProject', projectId?: string | null } | null, datasetsHelp?: { __typename?: 'Help', title: string } | null };

export type ProjectDatasetsQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type ProjectDatasetsQuery = { __typename?: 'Query', datasetSearch: { __typename?: 'DatasetSearchResults', count: number, limit: number, offset: number, results: Array<{ __typename?: 'DatasetSearchStub', key: string, title?: string | null, excerpt?: string | null, type?: DatasetType | null, publishingOrganizationTitle?: string | null }> } };

export type ProjectNewsAndEventsQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type ProjectNewsAndEventsQuery = { __typename?: 'Query', gbifProject?: { __typename?: 'GbifProject', news?: Array<{ __typename: 'News', createdAt: string, id: string, title: string, excerpt?: string | null, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null }> | null, events?: Array<{ __typename: 'Event', start: string, id: string, title: string, excerpt?: string | null, country?: string | null, location?: string | null, venue?: string | null, end?: string | null, gbifsAttendee?: string | null, allDayEvent?: boolean | null, primaryLink?: { __typename?: 'Link', url: string } | null }> | null } | null, help?: { __typename?: 'Help', title: string } | null };

export type ToolPageFragment = { __typename?: 'Tool', id: string, title: string, summary?: string | null, body?: string | null, citation?: string | null, createdAt?: string | null, author?: string | null, rights?: string | null, rightsHolder?: string | null, publicationDate?: string | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null };

export const DatasetStubResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetStubResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchStub"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<DatasetStubResultFragment, unknown>;
export const DatasetResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dataset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<DatasetResultFragment, unknown>;
export const ArticleBannerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<ArticleBannerFragment, unknown>;
export const NetworkAboutTabFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NetworkAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NetworkProse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<NetworkAboutTabFragment, unknown>;
export const OccurrenceMediaDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OccurrenceMediaDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MultimediaItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"license"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"}},{"kind":"Field","name":{"kind":"Name","value":"references"}},{"kind":"Field","name":{"kind":"Name","value":"rightsHolder"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<OccurrenceMediaDetailsFragment, unknown>;
export const PublisherResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PublisherResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]} as unknown as DocumentNode<PublisherResultFragment, unknown>;
export const DocumentPreviewFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<DocumentPreviewFragment, unknown>;
export const ArticlePageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticlePage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"audiences"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<ArticlePageFragment, unknown>;
export const HeaderBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<HeaderBlockDetailsFragment, unknown>;
export const ProseCardImgFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<ProseCardImgFragment, unknown>;
export const FeatureBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<FeatureBlockDetailsFragment, unknown>;
export const FeaturedTextBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}}]} as unknown as DocumentNode<FeaturedTextBlockDetailsFragment, unknown>;
export const MediaBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<MediaBlockDetailsFragment, unknown>;
export const MediaCountBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<MediaCountBlockDetailsFragment, unknown>;
export const CarouselBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<CarouselBlockDetailsFragment, unknown>;
export const CustomComponentBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}}]} as unknown as DocumentNode<CustomComponentBlockDetailsFragment, unknown>;
export const TextBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}}]} as unknown as DocumentNode<TextBlockDetailsFragment, unknown>;
export const BlockItemDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlockItemDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlockItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"HeaderBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeatureBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeaturedTextBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CarouselBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomComponentBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextBlockDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}}]} as unknown as DocumentNode<BlockItemDetailsFragment, unknown>;
export const CompositionPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompositionPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"maybeTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BlockItemDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlockItemDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlockItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"HeaderBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeatureBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeaturedTextBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CarouselBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomComponentBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextBlockDetails"}}]}}]}}]} as unknown as DocumentNode<CompositionPageFragment, unknown>;
export const ResourceRedirectDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceRedirectDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"maybeTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ResourceRedirectDetailsFragment, unknown>;
export const DataUsePageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataUsePage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"resourceUsed"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countriesOfCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"audiences"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<DataUsePageFragment, unknown>;
export const DocumentPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}}]}}]} as unknown as DocumentNode<DocumentPageFragment, unknown>;
export const EventPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"eventLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"venue"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<EventPageFragment, unknown>;
export const EventResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"venue"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifsAttendee"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}}]}}]} as unknown as DocumentNode<EventResultFragment, unknown>;
export const NewsPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countriesOfCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"audiences"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<NewsPageFragment, unknown>;
export const NewsResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"300"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"150"}}]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<NewsResultFragment, unknown>;
export const FundingOrganisationDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<FundingOrganisationDetailsFragment, unknown>;
export const ProgrammeFundingBannerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<ProgrammeFundingBannerFragment, unknown>;
export const ProgrammePageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammePage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BlockItemDetails"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeFundingBanner"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlockItemDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlockItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"HeaderBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeatureBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeaturedTextBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CarouselBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomComponentBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextBlockDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}}]} as unknown as DocumentNode<ProgrammePageFragment, unknown>;
export const ProjectFundingBannerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeFundingBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}}]} as unknown as DocumentNode<ProjectFundingBannerFragment, unknown>;
export const ParticipantOrFundingOrganisationDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipantOrFundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Participant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ParticipantOrFundingOrganisationDetailsFragment, unknown>;
export const ProjectAboutTabFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"matchingFunds"}},{"kind":"Field","name":{"kind":"Name","value":"grantType"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"leadPartner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"additionalPartners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leadContact"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipantOrFundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Participant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectAboutTabFragment, unknown>;
export const ProjectPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFundingBanner"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectAboutTab"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipantOrFundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Participant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeFundingBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"matchingFunds"}},{"kind":"Field","name":{"kind":"Name","value":"grantType"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"leadPartner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"additionalPartners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leadContact"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}}]}}]} as unknown as DocumentNode<ProjectPageFragment, unknown>;
export const ProjectDatasetsTabFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectDatasetsTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"datasetsHelp"},"name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"StringValue","value":"how-to-link-datasets-to-my-project-page","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ProjectDatasetsTabFragment, unknown>;
export const ToolPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ToolPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"rights"}},{"kind":"Field","name":{"kind":"Name","value":"rightsHolder"}},{"kind":"Field","name":{"kind":"Name","value":"publicationDate"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<ToolPageFragment, unknown>;
export const GlobeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"globe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cLat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"cLon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lon"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"svg"}}]}}]}}]} as unknown as DocumentNode<GlobeQuery, GlobeQueryVariables>;
export const HeaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Header"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifHome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"externalLink"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"externalLink"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"externalLink"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<HeaderQuery, HeaderQueryVariables>;
export const HelpTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HelpText"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}}]}}]}}]} as unknown as DocumentNode<HelpTextQuery, HelpTextQueryVariables>;
export const HelpTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HelpTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<HelpTitleQuery, HelpTitleQueryVariables>;
export const CollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Collection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"geography"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"incorporatedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"importantCollectors"}},{"kind":"Field","name":{"kind":"Name","value":"contentTypes"}},{"kind":"Field","name":{"kind":"Name","value":"personalCollection"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"catalogUrl"}},{"kind":"Field","name":{"kind":"Name","value":"apiUrl"}},{"kind":"Field","name":{"kind":"Name","value":"preservationTypes"}},{"kind":"Field","name":{"kind":"Name","value":"accessionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"replacedByCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"institutionKey"}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactPersons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicExpertise"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"userIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collectionSummary"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mailingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionQuery, CollectionQueryVariables>;
export const CollectionSummaryMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionSummaryMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardinality"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withImages"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withCoordinates"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withClusters"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionSummaryMetricsQuery, CollectionSummaryMetricsQueryVariables>;
export const DatasetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dataset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationKey"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}},{"kind":"Field","name":{"kind":"Name","value":"contactsCitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviatedName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetQuery, DatasetQueryVariables>;
export const InstallationDatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstallationDatasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"installation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"installation"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DatasetResult"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dataset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<InstallationDatasetsQuery, InstallationDatasetsQueryVariables>;
export const InstallationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Installation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"endpoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<InstallationQuery, InstallationQueryVariables>;
export const InstitutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Institution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"catalogUrl"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"apiUrl"}},{"kind":"Field","name":{"kind":"Name","value":"institutionalGovernance"}},{"kind":"Field","name":{"kind":"Name","value":"disciplines"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"additionalNames"}},{"kind":"Field","name":{"kind":"Name","value":"foundingDate"}},{"kind":"Field","name":{"kind":"Name","value":"geographicDescription"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicDescription"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"indexHerbariorumRecord"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"citesPermitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"masterSourceMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"replacedByInstitution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactPersons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicExpertise"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"userIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"mailingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"200"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"richness"}}]}}]}}]}}]} as unknown as DocumentNode<InstitutionQuery, InstitutionQueryVariables>;
export const InstitutionSummaryMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstitutionSummaryMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"institution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"200"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"richness"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withImages"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withCoordinates"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withClusters"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<InstitutionSummaryMetricsQuery, InstitutionSummaryMetricsQueryVariables>;
export const NetworkDatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NetworkDatasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"network"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"network"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"constituents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DatasetResult"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dataset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<NetworkDatasetsQuery, NetworkDatasetsQueryVariables>;
export const NetworkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Network"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"prose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NetworkAboutTab"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numConstituents"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gbifNetworkKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NetworkAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NetworkProse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<NetworkQuery, NetworkQueryVariables>;
export const NetworkPublishersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NetworkPublishers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"network"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"network"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<NetworkPublishersQuery, NetworkPublishersQueryVariables>;
export const OccurrenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Occurrence"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"issues"}},{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volatile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sphere"},"value":{"kind":"BooleanValue","value":false}},{"kind":"Argument","name":{"kind":"Name","value":"land"},"value":{"kind":"BooleanValue","value":false}},{"kind":"Argument","name":{"kind":"Name","value":"graticule"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"svg"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSpecimen"}},{"kind":"Field","name":{"kind":"Name","value":"isTreament"}},{"kind":"Field","name":{"kind":"Name","value":"isSequenced"}},{"kind":"Field","name":{"kind":"Name","value":"isClustered"}},{"kind":"Field","name":{"kind":"Name","value":"isSamplingEvent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"datasetTitle"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrgKey"}},{"kind":"Field","name":{"kind":"Name","value":"publisherTitle"}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"citation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"institutionCode"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByIDs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"expand"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"deathDate"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identifiedByIDs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"expand"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"deathDate"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"audubon"}},{"kind":"Field","name":{"kind":"Name","value":"amplification"}},{"kind":"Field","name":{"kind":"Name","value":"germplasmAccession"}},{"kind":"Field","name":{"kind":"Name","value":"germplasmMeasurementScore"}},{"kind":"Field","name":{"kind":"Name","value":"germplasmMeasurementTrait"}},{"kind":"Field","name":{"kind":"Name","value":"germplasmMeasurementTrial"}},{"kind":"Field","name":{"kind":"Name","value":"identification"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"measurementOrFact"}},{"kind":"Field","name":{"kind":"Name","value":"multimedia"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"resourceRelationship"}},{"kind":"Field","name":{"kind":"Name","value":"cloning"}},{"kind":"Field","name":{"kind":"Name","value":"gelImage"}},{"kind":"Field","name":{"kind":"Name","value":"loan"}},{"kind":"Field","name":{"kind":"Name","value":"materialSample"}},{"kind":"Field","name":{"kind":"Name","value":"permit"}},{"kind":"Field","name":{"kind":"Name","value":"preparation"}},{"kind":"Field","name":{"kind":"Name","value":"preservation"}},{"kind":"Field","name":{"kind":"Name","value":"extendedMeasurementOrFact"}},{"kind":"Field","name":{"kind":"Name","value":"chronometricAge"}},{"kind":"Field","name":{"kind":"Name","value":"dnaDerivedData"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gadm"}},{"kind":"Field","name":{"kind":"Name","value":"stillImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"movingImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"soundCount"}},{"kind":"Field","name":{"kind":"Name","value":"stillImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OccurrenceMediaDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OccurrenceMediaDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"movingImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OccurrenceMediaDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifClassification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kingdom"}},{"kind":"Field","name":{"kind":"Name","value":"kingdomKey"}},{"kind":"Field","name":{"kind":"Name","value":"phylum"}},{"kind":"Field","name":{"kind":"Name","value":"phylumKey"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"classKey"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"orderKey"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"familyKey"}},{"kind":"Field","name":{"kind":"Name","value":"genus"}},{"kind":"Field","name":{"kind":"Name","value":"genusKey"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"speciesKey"}},{"kind":"Field","name":{"kind":"Name","value":"synonym"}},{"kind":"Field","name":{"kind":"Name","value":"classification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"acceptedUsage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formattedName"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"terms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"simpleName"}},{"kind":"Field","name":{"kind":"Name","value":"verbatim"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"htmlValue"}},{"kind":"Field","name":{"kind":"Name","value":"remarks"}},{"kind":"Field","name":{"kind":"Name","value":"issues"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OccurrenceMediaDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MultimediaItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"license"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"}},{"kind":"Field","name":{"kind":"Name","value":"references"}},{"kind":"Field","name":{"kind":"Name","value":"rightsHolder"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<OccurrenceQuery, OccurrenceQueryVariables>;
export const OccurrenceSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"county"}},{"kind":"Field","name":{"kind":"Name","value":"basisOfRecord"}},{"kind":"Field","name":{"kind":"Name","value":"datasetName"}},{"kind":"Field","name":{"kind":"Name","value":"publisherTitle"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceSearchQuery, OccurrenceSearchQueryVariables>;
export const PublisherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Publisher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"publisher"},"name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"numPublishedDatasets"}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"hostedDatasets"},"name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hostingOrg"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"publishingOrganizationKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<PublisherQuery, PublisherQueryVariables>;
export const AliasHandlingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AliasHandling"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"alias"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"alias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"alias"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResourceRedirectDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceRedirectDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"maybeTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<AliasHandlingQuery, AliasHandlingQueryVariables>;
export const ProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Project"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResourceRedirectDetails"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectPage"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectDatasetsTab"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeFundingBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipantOrFundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Participant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"matchingFunds"}},{"kind":"Field","name":{"kind":"Name","value":"grantType"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"leadPartner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"additionalPartners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leadContact"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceRedirectDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"maybeTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFundingBanner"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectAboutTab"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectDatasetsTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"datasetsHelp"},"name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"StringValue","value":"how-to-link-datasets-to-my-project-page","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ProjectQuery, ProjectQueryVariables>;
export const ProjectDatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectDatasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"500"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DatasetStubResult"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetStubResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchStub"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<ProjectDatasetsQuery, ProjectDatasetsQueryVariables>;
export const ProjectNewsAndEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectNewsAndEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"news"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"NewsResult"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventResult"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"StringValue","value":"how-to-add-events-to-my-project-page","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"300"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"150"}}]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"venue"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifsAttendee"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}}]}}]} as unknown as DocumentNode<ProjectNewsAndEventsQuery, ProjectNewsAndEventsQueryVariables>;