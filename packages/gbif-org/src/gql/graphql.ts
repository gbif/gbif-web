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
  createdAt: Scalars['DateTime']['output'];
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
  createdAt: Scalars['DateTime']['output'];
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
  accessionStatus?: Maybe<Scalars['String']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  address?: Maybe<Address>;
  alternativeCodes: Array<AlternativeCode>;
  apiUrls: Array<Scalars['String']['output']>;
  catalogUrls: Array<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  /** Deprecated */
  collectionSummary?: Maybe<Scalars['JSON']['output']>;
  comments?: Maybe<Comment>;
  contactPersons: Array<ContactPerson>;
  /** The contacts type is deprecated and will no longer be updated */
  contacts: Array<Maybe<StaffMember>>;
  contentTypes: Array<Scalars['String']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  descriptorGroups?: Maybe<CollectionDescriptorGroupResults>;
  doi?: Maybe<Scalars['String']['output']>;
  email: Array<Scalars['String']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  featuredImageLicense?: Maybe<License>;
  featuredImageUrl?: Maybe<Scalars['String']['output']>;
  geographicCoverage?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['URL']['output']>;
  /** This can be used as a backup, but since it works by fetching the homepage url and extracting the open graph tags it can be slow. Use with caution. */
  homepageOGImageUrl_volatile?: Maybe<Scalars['String']['output']>;
  identifiers: Array<Identifier>;
  /** Deprecated */
  importantCollectors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  incorporatedCollections: Array<Maybe<Scalars['String']['output']>>;
  institution?: Maybe<Institution>;
  institutionKey?: Maybe<Scalars['ID']['output']>;
  key: Scalars['ID']['output'];
  machineTags: Array<Maybe<MachineTag>>;
  mailingAddress?: Maybe<Address>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  numberSpecimens?: Maybe<Scalars['Int']['output']>;
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  personalCollection?: Maybe<Scalars['Boolean']['output']>;
  phone: Array<Scalars['String']['output']>;
  preservationTypes: Array<Scalars['String']['output']>;
  replacedBy?: Maybe<Scalars['ID']['output']>;
  replacedByCollection?: Maybe<Collection>;
  richness?: Maybe<Scalars['Float']['output']>;
  tags: Array<Maybe<Tag>>;
  taxonomicCoverage?: Maybe<Scalars['String']['output']>;
  temporalCoverage?: Maybe<Scalars['String']['output']>;
  thumbor?: Maybe<Scalars['String']['output']>;
};


export type CollectionDescriptorGroupsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionHomepageOgImageUrl_VolatileArgs = {
  onlyIfNoImageUrl?: InputMaybe<Scalars['Boolean']['input']>;
  timeoutMs?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionThumborArgs = {
  fitIn?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type CollectionCardinality = {
  __typename?: 'CollectionCardinality';
  accessionStatus: Scalars['Int']['output'];
  city: Scalars['Int']['output'];
  classKey: Scalars['Int']['output'];
  contentType: Scalars['Int']['output'];
  country: Scalars['Int']['output'];
  descriptorCountry: Scalars['Int']['output'];
  familyKey: Scalars['Int']['output'];
  genusKey: Scalars['Int']['output'];
  institutionKey: Scalars['Int']['output'];
  kingdomKey: Scalars['Int']['output'];
  orderKey: Scalars['Int']['output'];
  phylumKey: Scalars['Int']['output'];
  preservationType: Scalars['Int']['output'];
  recordedBy: Scalars['Int']['output'];
  speciesKey: Scalars['Int']['output'];
  typeStatus: Scalars['Int']['output'];
};


export type CollectionCardinalityAccessionStatusArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityCityArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityClassKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityContentTypeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityCountryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityDescriptorCountryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityFamilyKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityGenusKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityInstitutionKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityKingdomKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityOrderKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityPhylumKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityPreservationTypeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityRecordedByArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalitySpeciesKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionCardinalityTypeStatusArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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

export type CollectionDescriptor = {
  __typename?: 'CollectionDescriptor';
  identifiedBy?: Maybe<Array<Scalars['String']['output']>>;
  individualCount?: Maybe<Scalars['Int']['output']>;
  issues?: Maybe<Array<OccurrenceIssue>>;
  key: Scalars['ID']['output'];
  recordedBy?: Maybe<Array<Scalars['String']['output']>>;
  taxonClassification?: Maybe<Array<Classification>>;
  typeStatus?: Maybe<Array<Scalars['String']['output']>>;
  usageKey?: Maybe<Scalars['Long']['output']>;
  usageName?: Maybe<Scalars['String']['output']>;
  usageRank?: Maybe<Rank>;
  verbatim?: Maybe<Scalars['JSON']['output']>;
};

export type CollectionDescriptorGroup = {
  __typename?: 'CollectionDescriptorGroup';
  collectionKey: Scalars['ID']['output'];
  created: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  descriptors?: Maybe<CollectionDescriptorResults>;
  key: Scalars['ID']['output'];
  modified?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type CollectionDescriptorGroupDescriptorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type CollectionDescriptorGroupResults = {
  __typename?: 'CollectionDescriptorGroupResults';
  count?: Maybe<Scalars['Int']['output']>;
  endOfRecords?: Maybe<Scalars['Boolean']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  offset?: Maybe<Scalars['Int']['output']>;
  results: Array<Maybe<CollectionDescriptorGroup>>;
};

export type CollectionDescriptorResults = {
  __typename?: 'CollectionDescriptorResults';
  count?: Maybe<Scalars['Int']['output']>;
  endOfRecords?: Maybe<Scalars['Boolean']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  offset?: Maybe<Scalars['Int']['output']>;
  results?: Maybe<Array<CollectionDescriptor>>;
};

export type CollectionFacet = {
  __typename?: 'CollectionFacet';
  accessionStatus?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  city?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  classKey?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  contentType?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  country?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  descriptorCountry?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  familyKey?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  genusKey?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  institutionKey?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  kingdomKey?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  orderKey?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  phylumKey?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  preservationType?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  recordedBy?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  speciesKey?: Maybe<Array<Maybe<CollectionFacetResult>>>;
  typeStatus?: Maybe<Array<Maybe<CollectionFacetResult>>>;
};


export type CollectionFacetAccessionStatusArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetCityArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetClassKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetContentTypeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetCountryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetDescriptorCountryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetFamilyKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetGenusKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetInstitutionKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetKingdomKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetOrderKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetPhylumKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetPreservationTypeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetRecordedByArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetSpeciesKeyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CollectionFacetTypeStatusArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export enum CollectionFacetParameter {
  AccessionStatus = 'ACCESSION_STATUS',
  City = 'CITY',
  ClassKey = 'CLASS_KEY',
  ContentType = 'CONTENT_TYPE',
  Country = 'COUNTRY',
  DescriptorCountry = 'DESCRIPTOR_COUNTRY',
  FamilyKey = 'FAMILY_KEY',
  GenusKey = 'GENUS_KEY',
  InstitutionKey = 'INSTITUTION_KEY',
  KingdomKey = 'KINGDOM_KEY',
  ObjectClassification = 'OBJECT_CLASSIFICATION',
  OrderKey = 'ORDER_KEY',
  PhylumKey = 'PHYLUM_KEY',
  PreservationType = 'PRESERVATION_TYPE',
  RecordedBy = 'RECORDED_BY',
  SpeciesKey = 'SPECIES_KEY',
  TypeStatus = 'TYPE_STATUS'
}

export type CollectionFacetResult = {
  __typename?: 'CollectionFacetResult';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CollectionInstitutionFacet = {
  __typename?: 'CollectionInstitutionFacet';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  institution?: Maybe<Institution>;
  name: Scalars['String']['output'];
};

export type CollectionSearchEntity = {
  __typename?: 'CollectionSearchEntity';
  accessionStatus?: Maybe<Scalars['String']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  alternativeCodes: Array<AlternativeCode>;
  city?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  contentTypes: Array<Scalars['String']['output']>;
  country?: Maybe<Country>;
  description?: Maybe<Scalars['String']['output']>;
  descriptorMatches: Array<DescriptorMatches>;
  excerpt?: Maybe<Scalars['String']['output']>;
  featuredImageLicense?: Maybe<License>;
  featuredImageUrl?: Maybe<Scalars['String']['output']>;
  geographicCoverage?: Maybe<Scalars['String']['output']>;
  institutionCode?: Maybe<Scalars['String']['output']>;
  institutionKey?: Maybe<Scalars['ID']['output']>;
  institutionName?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  numberSpecimens?: Maybe<Scalars['Long']['output']>;
  occurrenceCount?: Maybe<Scalars['Long']['output']>;
  personalCollection?: Maybe<Scalars['Boolean']['output']>;
  preservationTypes: Array<Scalars['String']['output']>;
  taxonomicCoverage?: Maybe<Scalars['String']['output']>;
  temporalCoverage?: Maybe<Scalars['String']['output']>;
  thumbor?: Maybe<Scalars['String']['output']>;
  typeSpecimenCount?: Maybe<Scalars['Long']['output']>;
};


export type CollectionSearchEntityThumborArgs = {
  fitIn?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type CollectionSearchInput = {
  active?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  alternativeCode?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Array<Scalars['String']['input']>>;
  code?: InputMaybe<Array<Scalars['String']['input']>>;
  contact?: InputMaybe<Array<Scalars['ID']['input']>>;
  contentType?: InputMaybe<Array<Scalars['String']['input']>>;
  country?: InputMaybe<Array<Country>>;
  descriptorCountry?: InputMaybe<Array<Country>>;
  displayOnNHCPortal?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  fuzzyName?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Array<Scalars['String']['input']>>;
  institutionKey?: InputMaybe<Array<Scalars['GUID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Array<Scalars['String']['input']>>;
  numberSpecimens?: InputMaybe<Array<Scalars['String']['input']>>;
  occurrenceCount?: InputMaybe<Array<Scalars['String']['input']>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  personalCollection?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  preservationType?: InputMaybe<Array<Scalars['String']['input']>>;
  q?: InputMaybe<Scalars['String']['input']>;
  recordedBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortBy?: InputMaybe<CollectionsSortField>;
  sortOrder?: InputMaybe<SortOrder>;
  taxonKey?: InputMaybe<Array<Scalars['ID']['input']>>;
  typeStatus?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CollectionSearchResults = {
  __typename?: 'CollectionSearchResults';
  _query?: Maybe<Scalars['JSON']['output']>;
  cardinality?: Maybe<CollectionCardinality>;
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  facet?: Maybe<CollectionFacet>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<CollectionSearchEntity>>;
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
  createdAt: Scalars['DateTime']['output'];
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
  Programme = 'PROGRAMME',
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

export type DataArchive = {
  __typename?: 'DataArchive';
  fileSizeInMB?: Maybe<Scalars['Float']['output']>;
  modified?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
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
  createdAt: Scalars['DateTime']['output'];
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
  endpoints?: Maybe<Array<Endpoint>>;
  /** volatile shortened version of the description */
  excerpt?: Maybe<Scalars['String']['output']>;
  external?: Maybe<Scalars['Boolean']['output']>;
  firstOccurrence?: Maybe<Occurrence>;
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
  literatureCount?: Maybe<Scalars['Int']['output']>;
  lockedForAutoUpdate?: Maybe<Scalars['Boolean']['output']>;
  /** Link to homepage with crawling logs. */
  logInterfaceUrl?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['URL']['output']>;
  machineTags?: Maybe<Array<MachineTag>>;
  maintenanceDescription?: Maybe<Scalars['String']['output']>;
  maintenanceUpdateFrequency?: Maybe<MaintenanceUpdateFrequency>;
  mapCapabilities?: Maybe<MapCapabilities>;
  metrics?: Maybe<DatasetChecklistMetrics>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  networks: Array<Maybe<Network>>;
  numConstituents?: Maybe<Scalars['Int']['output']>;
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
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


export type DatasetIdentifiersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type DatasetMachineTagsArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
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
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  dataset?: Maybe<Dataset>;
  decade?: Maybe<Array<Maybe<DatasetFacetResult>>>;
  hostingOrg?: Maybe<Array<Maybe<DatasetOrganizationFacet>>>;
  key: Scalars['String']['output'];
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

export type DatasetSearchInput = {
  /** Not implemented yet */
  continent?: InputMaybe<Array<InputMaybe<Continent>>>;
  /** Not implemented yet */
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
  /** Not implemented yet */
  subtype?: InputMaybe<Array<InputMaybe<DatasetSubtype>>>;
  type?: InputMaybe<Array<InputMaybe<DatasetType>>>;
};

export enum DatasetSearchParameter {
  CollectionKey = 'COLLECTION_KEY',
  Continent = 'CONTINENT',
  Country = 'COUNTRY',
  DatasetTitle = 'DATASET_TITLE',
  Decade = 'DECADE',
  Doi = 'DOI',
  EndorsingNodeKey = 'ENDORSING_NODE_KEY',
  EndpointType = 'ENDPOINT_TYPE',
  HostingCountry = 'HOSTING_COUNTRY',
  HostingOrg = 'HOSTING_ORG',
  InstallationKey = 'INSTALLATION_KEY',
  InstitutionKey = 'INSTITUTION_KEY',
  Keyword = 'KEYWORD',
  License = 'LICENSE',
  ModifiedDate = 'MODIFIED_DATE',
  NetworkKey = 'NETWORK_KEY',
  ProjectId = 'PROJECT_ID',
  PublishingCountry = 'PUBLISHING_COUNTRY',
  PublishingOrg = 'PUBLISHING_ORG',
  RecordCount = 'RECORD_COUNT',
  Subtype = 'SUBTYPE',
  TaxonKey = 'TAXON_KEY',
  Type = 'TYPE',
  Year = 'YEAR'
}

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

export type DescriptorMatches = {
  __typename?: 'DescriptorMatches';
  country?: Maybe<Country>;
  descriptorSetKey?: Maybe<Scalars['ID']['output']>;
  identifiedBy: Array<Scalars['String']['output']>;
  individualCount?: Maybe<Scalars['Long']['output']>;
  issues: Array<OccurrenceIssue>;
  key?: Maybe<Scalars['ID']['output']>;
  recordedBy: Array<Scalars['String']['output']>;
  taxon?: Maybe<Taxon>;
  typeStatus: Array<Scalars['String']['output']>;
  usageKey?: Maybe<Scalars['Long']['output']>;
  usageName?: Maybe<Scalars['String']['output']>;
  usageRank?: Maybe<Rank>;
};

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

export type DirectoryContactRole = {
  __typename?: 'DirectoryContactRole';
  Person?: Maybe<DirectoryContact>;
  award?: Maybe<Scalars['String']['output']>;
  personId?: Maybe<Scalars['Int']['output']>;
  programme?: Maybe<Scalars['String']['output']>;
  relationshipId?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  term?: Maybe<DirectoryTerm>;
};

export type DirectoryContactRoleSearchResults = {
  __typename?: 'DirectoryContactRoleSearchResults';
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<DirectoryContactRole>>;
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

export enum DistanceUnit {
  Centimeters = 'CENTIMETERS',
  Feet = 'FEET',
  Inch = 'INCH',
  Kilometers = 'KILOMETERS',
  Meters = 'METERS',
  Miles = 'MILES',
  Millimeters = 'MILLIMETERS',
  Nauticalmiles = 'NAUTICALMILES',
  Yard = 'YARD'
}

export type DistinctTaxon = {
  __typename?: 'DistinctTaxon';
  class?: Maybe<Scalars['String']['output']>;
  classKey?: Maybe<Scalars['String']['output']>;
  count?: Maybe<Scalars['Int']['output']>;
  family?: Maybe<Scalars['String']['output']>;
  familyKey?: Maybe<Scalars['String']['output']>;
  genus?: Maybe<Scalars['String']['output']>;
  genusKey?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  kingdom?: Maybe<Scalars['String']['output']>;
  kingdomKey?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['String']['output']>;
  orderKey?: Maybe<Scalars['String']['output']>;
  phylum?: Maybe<Scalars['String']['output']>;
  phylumKey?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['String']['output']>;
  scientificName?: Maybe<Scalars['String']['output']>;
  species?: Maybe<Scalars['String']['output']>;
  speciesKey?: Maybe<Scalars['String']['output']>;
};

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
  createdAt: Scalars['DateTime']['output'];
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
  created: Scalars['DateTime']['output'];
  doi?: Maybe<Scalars['String']['output']>;
  downloadLink?: Maybe<Scalars['String']['output']>;
  eraseAfter?: Maybe<Scalars['String']['output']>;
  key: Scalars['ID']['output'];
  license?: Maybe<Scalars['String']['output']>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  numberDatasets?: Maybe<Scalars['Int']['output']>;
  numberOrganizations?: Maybe<Scalars['Int']['output']>;
  numberPublishingCountries?: Maybe<Scalars['Int']['output']>;
  request?: Maybe<DownloadRequest>;
  size?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Download_Status>;
  totalRecords?: Maybe<Scalars['Int']['output']>;
};

export enum DownloadFormat {
  Bionomia = 'BIONOMIA',
  Dwca = 'DWCA',
  MapOfLife = 'MAP_OF_LIFE',
  SimpleAvro = 'SIMPLE_AVRO',
  SimpleCsv = 'SIMPLE_CSV',
  SimpleParquet = 'SIMPLE_PARQUET',
  SimpleWithVerbatimAvro = 'SIMPLE_WITH_VERBATIM_AVRO',
  SpeciesList = 'SPECIES_LIST',
  SqlTsvZip = 'SQL_TSV_ZIP'
}

export type DownloadRequest = {
  __typename?: 'DownloadRequest';
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  gbifMachineDescription?: Maybe<Scalars['JSON']['output']>;
  machineDescription?: Maybe<Scalars['JSON']['output']>;
  predicate?: Maybe<Scalars['JSON']['output']>;
  sendNotification?: Maybe<Scalars['Boolean']['output']>;
  sql?: Maybe<Scalars['String']['output']>;
  sqlFormatted?: Maybe<Scalars['String']['output']>;
};

export enum DownloadType {
  Event = 'EVENT',
  Occurrence = 'OCCURRENCE'
}

export enum Download_Status {
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  FileErased = 'FILE_ERASED',
  Killed = 'KILLED',
  Preparing = 'PREPARING',
  Running = 'RUNNING',
  Succeeded = 'SUCCEEDED',
  Suspended = 'SUSPENDED'
}

export enum EndorsementStatus {
  Endorsed = 'ENDORSED',
  OnHold = 'ON_HOLD',
  Rejected = 'REJECTED',
  WaitingForEndorsement = 'WAITING_FOR_ENDORSEMENT'
}

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
  Acef = 'ACEF',
  Biocase = 'BIOCASE',
  BiocaseXmlArchive = 'BIOCASE_XML_ARCHIVE',
  Biom_1_0 = 'BIOM_1_0',
  Biom_2_1 = 'BIOM_2_1',
  CamtrapDp = 'CAMTRAP_DP',
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
  TextTree = 'TEXT_TREE',
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
  childEventCount?: Maybe<Scalars['Int']['output']>;
  coordinates?: Maybe<Scalars['JSON']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  /** get dataset information via EML */
  dataset: Scalars['JSON']['output'];
  datasetKey?: Maybe<Scalars['String']['output']>;
  datasetTitle?: Maybe<Scalars['String']['output']>;
  day?: Maybe<Scalars['Int']['output']>;
  decimalLatitude?: Maybe<Scalars['Float']['output']>;
  decimalLongitude?: Maybe<Scalars['Float']['output']>;
  distinctTaxa: Array<Maybe<DistinctTaxon>>;
  eventDate?: Maybe<Scalars['String']['output']>;
  eventHierarchy?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  eventHierarchyJoined?: Maybe<Scalars['String']['output']>;
  eventHierarchyLevels?: Maybe<Scalars['Int']['output']>;
  eventID?: Maybe<Scalars['String']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  eventRemarks?: Maybe<Scalars['String']['output']>;
  eventType?: Maybe<EventType>;
  eventTypeHierarchy?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  eventTypeHierarchyJoined?: Maybe<Scalars['String']['output']>;
  extensions?: Maybe<EventExtensions>;
  formattedCoordinates?: Maybe<Scalars['String']['output']>;
  locality?: Maybe<Scalars['String']['output']>;
  locationID?: Maybe<Scalars['String']['output']>;
  measurementOrFactCount?: Maybe<Scalars['Int']['output']>;
  measurementOrFactTypes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  measurementOrFacts?: Maybe<Array<Maybe<Measurement>>>;
  month?: Maybe<Scalars['Int']['output']>;
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  parentEvent?: Maybe<Event>;
  parentEventID?: Maybe<Scalars['String']['output']>;
  sampleSizeUnit?: Maybe<Scalars['String']['output']>;
  sampleSizeValue?: Maybe<Scalars['Float']['output']>;
  samplingProtocol?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Get number of distinct species for this event and its children */
  speciesCount: Scalars['Int']['output'];
  stateProvince?: Maybe<Scalars['String']['output']>;
  surveyID?: Maybe<Scalars['String']['output']>;
  temporalCoverage?: Maybe<TemporalCoverage>;
  type?: Maybe<Scalars['String']['output']>;
  wktConvexHull?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type EventCardinality = {
  __typename?: 'EventCardinality';
  datasetKey: Scalars['Int']['output'];
  locationID: Scalars['Int']['output'];
  parentEventID: Scalars['Int']['output'];
  speciesKey: Scalars['Int']['output'];
  surveyID: Scalars['Int']['output'];
};

export type EventDocuments = {
  __typename?: 'EventDocuments';
  from: Scalars['Int']['output'];
  results: Array<Maybe<Event>>;
  size: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type EventExtensions = {
  __typename?: 'EventExtensions';
  test?: Maybe<Scalars['String']['output']>;
};

export type EventFacet = {
  __typename?: 'EventFacet';
  classKey?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  datasetKey?: Maybe<Array<Maybe<EventFacetResult_Dataset>>>;
  eventHierarchy?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  eventHierarchyJoined?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  eventType?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  eventTypeHierarchy?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  eventTypeHierarchyJoined?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  familyKey?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  genusKey?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  kingdomKey?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  locality?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  locationID?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  measurementOfFactTypes?: Maybe<Array<Maybe<EventFacetResult_Dataset>>>;
  measurementOrFactTypes?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  month?: Maybe<Array<Maybe<EventFacetResult_Float>>>;
  orderKey?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  phylumKey?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  samplingProtocol?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  scientificNames?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  speciesKey?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  stateProvince?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  surveyID?: Maybe<Array<Maybe<EventFacetResult_String>>>;
  year?: Maybe<Array<Maybe<EventFacetResult_Float>>>;
};


export type EventFacetClassKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetDatasetKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetEventHierarchyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetEventHierarchyJoinedArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetEventTypeArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetEventTypeHierarchyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetEventTypeHierarchyJoinedArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetFamilyKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetGenusKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetKingdomKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetLocalityArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetLocationIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetMeasurementOfFactTypesArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetMeasurementOrFactTypesArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetMonthArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetOrderKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetPhylumKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetSamplingProtocolArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetScientificNamesArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetSpeciesKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetStateProvinceArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetSurveyIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventFacetYearArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventFacetResult_Dataset = {
  __typename?: 'EventFacetResult_dataset';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  archive?: Maybe<DataArchive>;
  count: Scalars['Int']['output'];
  datasetTitle: Scalars['String']['output'];
  events: EventSearchResult;
  extensions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  key: Scalars['String']['output'];
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
};


export type EventFacetResult_DatasetEventsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventFacetResult_Float = {
  __typename?: 'EventFacetResult_float';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  events: EventSearchResult;
  key: Scalars['Float']['output'];
};


export type EventFacetResult_FloatEventsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventFacetResult_String = {
  __typename?: 'EventFacetResult_string';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  events: EventSearchResult;
  key: Scalars['String']['output'];
};


export type EventFacetResult_StringEventsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventMultiFacet = {
  __typename?: 'EventMultiFacet';
  locationIDStateProvince?: Maybe<Array<Maybe<EventMultiFacetResult_String>>>;
};


export type EventMultiFacetLocationIdStateProvinceArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventMultiFacetResult_String = {
  __typename?: 'EventMultiFacetResult_string';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  events: EventSearchResult;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};


export type EventMultiFacetResult_StringEventsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventOccurrenceFacet = {
  __typename?: 'EventOccurrenceFacet';
  basisOfRecord?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  classKey?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  datasetKey?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  eventHierarchy?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  eventHierarchyJoined?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  eventTypeHierarchy?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  eventTypeHierarchyJoined?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  familyKey?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  genusKey?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  identifiedBy?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  identifiedById?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  kingdomKey?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  locationID?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  month?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  occurrenceStatus?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  orderKey?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  phylumKey?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  recordedBy?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  recordedById?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  samplingProtocol?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  scientificNames?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  speciesKey?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  stateProvince?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
  year?: Maybe<Array<Maybe<EventOccurrenceFacetResult_String>>>;
};


export type EventOccurrenceFacetBasisOfRecordArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetClassKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetDatasetKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetEventHierarchyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetEventHierarchyJoinedArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetEventTypeHierarchyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetEventTypeHierarchyJoinedArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetFamilyKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetGenusKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetIdentifiedByArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetIdentifiedByIdArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetKingdomKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetLocationIdArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetMonthArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetOccurrenceStatusArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetOrderKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetPhylumKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetRecordedByArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetRecordedByIdArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetSamplingProtocolArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetScientificNamesArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetSpeciesKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetStateProvinceArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventOccurrenceFacetYearArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventOccurrenceFacetResult_String = {
  __typename?: 'EventOccurrenceFacetResult_string';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  key: Scalars['String']['output'];
};

export type EventSearchResult = {
  __typename?: 'EventSearchResult';
  _meta?: Maybe<Scalars['JSON']['output']>;
  _predicate?: Maybe<Scalars['JSON']['output']>;
  /** Register the search predicate with the ES tile server */
  _tileServerToken?: Maybe<Scalars['String']['output']>;
  /** Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set */
  cardinality?: Maybe<EventCardinality>;
  /** The events that match the filter */
  documents: EventDocuments;
  /** Get number of events per distinct values in a field. E.g. how many events per year. */
  facet?: Maybe<EventFacet>;
  /** Get number of events per distinct values in two or more fields. E.g. how many events per year. */
  multifacet?: Maybe<EventMultiFacet>;
  /** Get number of occurrences matching this search */
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  /** Get number of occurrences per distinct values in a field. E.g. how many occurrence per year. */
  occurrenceFacet?: Maybe<EventOccurrenceFacet>;
  /** Get statistics for a numeric field. Minimimum value etc. */
  stats?: Maybe<EventStats>;
  /** Get number of events per distinct values in a field. E.g. how many events per year. */
  temporal?: Maybe<EventTemporal>;
};


export type EventSearchResultDocumentsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  randomize?: InputMaybe<Scalars['Boolean']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventSearchResultFacetArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventSearchResultMultifacetArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventStats = {
  __typename?: 'EventStats';
  occurrenceCount: Stats;
  year: Stats;
};

export type EventTemporal = {
  __typename?: 'EventTemporal';
  datasetKey?: Maybe<EventTemporalCardinalityResult>;
  locationID?: Maybe<EventTemporalCardinalityResult>;
};


export type EventTemporalDatasetKeyArgs = {
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type EventTemporalLocationIdArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  include?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventTemporalCardinalityResult = {
  __typename?: 'EventTemporalCardinalityResult';
  cardinality: Scalars['Int']['output'];
  results?: Maybe<Array<Maybe<EventTemporalResult_String>>>;
};

export type EventTemporalResult_String = {
  __typename?: 'EventTemporalResult_string';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  breakdown?: Maybe<Array<Maybe<YearBreakdown>>>;
  count: Scalars['Int']['output'];
  events: EventSearchResult;
  key: Scalars['String']['output'];
  temporal?: Maybe<EventTemporal>;
};


export type EventTemporalResult_StringEventsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type EventType = {
  __typename?: 'EventType';
  concept?: Maybe<Scalars['String']['output']>;
  lineage?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
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

export type FeatureItem = DataUse | Feature | MeetingEvent | News;

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

export enum Format {
  Default = 'DEFAULT',
  LatimerCore = 'LATIMER_CORE'
}

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
  createdAt: Scalars['DateTime']['output'];
  documents?: Maybe<Array<DocumentAsset>>;
  end?: Maybe<Scalars['DateTime']['output']>;
  events?: Maybe<Array<MeetingEvent>>;
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
  createdAt: Scalars['DateTime']['output'];
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
  blocks?: Maybe<Array<BlockItem>>;
  children?: Maybe<Array<MenuItem>>;
  datasetIcon?: Maybe<AssetImage>;
  id: Scalars['ID']['output'];
  literatureIcon?: Maybe<AssetImage>;
  occurrenceIcon?: Maybe<AssetImage>;
  primaryImage?: Maybe<Array<AssetImage>>;
  publisherIcon?: Maybe<AssetImage>;
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
  ClbDatasetKey = 'CLB_DATASET_KEY',
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
  Isil = 'ISIL',
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
  results: Array<Installation>;
};

export enum InstallationType {
  BiocaseInstallation = 'BIOCASE_INSTALLATION',
  DigirInstallation = 'DIGIR_INSTALLATION',
  EarthcapeInstallation = 'EARTHCAPE_INSTALLATION',
  HttpInstallation = 'HTTP_INSTALLATION',
  IptInstallation = 'IPT_INSTALLATION',
  MdtInstallation = 'MDT_INSTALLATION',
  SymbiotaInstallation = 'SYMBIOTA_INSTALLATION',
  TapirInstallation = 'TAPIR_INSTALLATION'
}

export type Institution = {
  __typename?: 'Institution';
  active?: Maybe<Scalars['Boolean']['output']>;
  additionalNames?: Maybe<Array<Scalars['String']['output']>>;
  address?: Maybe<Address>;
  alternativeCodes?: Maybe<Array<AlternativeCode>>;
  apiUrls?: Maybe<Array<Scalars['String']['output']>>;
  catalogUrls?: Maybe<Array<Scalars['String']['output']>>;
  code?: Maybe<Scalars['String']['output']>;
  /** collection count will count up to a 1000. After that results will be capped to 1000. This is unlikely to be an issue, but you should worry if you see 1000 results exactly. */
  collectionCount?: Maybe<Scalars['Int']['output']>;
  collections?: Maybe<Array<Collection>>;
  comments?: Maybe<Array<Comment>>;
  contactPersons: Array<Maybe<ContactPerson>>;
  /** The contacts type is deprecated and will no longer be updated */
  contacts?: Maybe<Array<StaffMember>>;
  convertedToCollection?: Maybe<Scalars['ID']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disciplines?: Maybe<Array<Scalars['String']['output']>>;
  email?: Maybe<Array<Scalars['String']['output']>>;
  excerpt?: Maybe<Scalars['String']['output']>;
  featuredImageLicense?: Maybe<License>;
  featuredImageUrl?: Maybe<Scalars['String']['output']>;
  foundingDate?: Maybe<Scalars['Int']['output']>;
  homepage?: Maybe<Scalars['URL']['output']>;
  /** This can be used as a backup, but since it works by fetching the homepage url and extracting the open graph tags it can be slow. Use with caution. */
  homepageOGImageUrl_volatile?: Maybe<Scalars['String']['output']>;
  identifiers?: Maybe<Array<Identifier>>;
  institutionalGovernances?: Maybe<Array<Scalars['String']['output']>>;
  key: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  logoUrl?: Maybe<Scalars['URL']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  machineTags?: Maybe<Array<MachineTag>>;
  mailingAddress?: Maybe<Address>;
  masterSource?: Maybe<Scalars['String']['output']>;
  masterSourceMetadata?: Maybe<MasterSourceMetadata>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  numberSpecimens?: Maybe<Scalars['Int']['output']>;
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  phone?: Maybe<Array<Scalars['String']['output']>>;
  replacedBy?: Maybe<Scalars['ID']['output']>;
  replacedByCollection?: Maybe<Collection>;
  replacedByInstitution?: Maybe<Institution>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  thumbor?: Maybe<Scalars['String']['output']>;
  types?: Maybe<Array<Scalars['String']['output']>>;
};


export type InstitutionCollectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionHomepageOgImageUrl_VolatileArgs = {
  onlyIfNoImageUrl?: InputMaybe<Scalars['Boolean']['input']>;
  timeoutMs?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionThumborArgs = {
  fitIn?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type InstitutionCardinality = {
  __typename?: 'InstitutionCardinality';
  city: Scalars['Int']['output'];
  country: Scalars['Int']['output'];
  discipline: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
};


export type InstitutionCardinalityCityArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionCardinalityCountryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionCardinalityDisciplineArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionCardinalityTypeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type InstitutionFacet = {
  __typename?: 'InstitutionFacet';
  city?: Maybe<Array<Maybe<InstitutionFacetResult>>>;
  country?: Maybe<Array<Maybe<InstitutionFacetResult>>>;
  discipline?: Maybe<Array<Maybe<InstitutionFacetResult>>>;
  type?: Maybe<Array<Maybe<InstitutionFacetResult>>>;
};


export type InstitutionFacetCityArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionFacetCountryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionFacetDisciplineArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstitutionFacetTypeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export enum InstitutionFacetParameter {
  City = 'CITY',
  Country = 'COUNTRY',
  Discipline = 'DISCIPLINE',
  Type = 'TYPE'
}

export type InstitutionFacetResult = {
  __typename?: 'InstitutionFacetResult';
  _query?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
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

export type InstitutionSearchEntity = {
  __typename?: 'InstitutionSearchEntity';
  active?: Maybe<Scalars['Boolean']['output']>;
  alternativeCodes?: Maybe<Array<AlternativeCode>>;
  city?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  collectionCount?: Maybe<Scalars['Int']['output']>;
  country?: Maybe<Country>;
  description?: Maybe<Scalars['String']['output']>;
  disciplines?: Maybe<Array<Scalars['String']['output']>>;
  displayOnNHCPortal?: Maybe<Scalars['Boolean']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  featuredImageLicense?: Maybe<License>;
  featuredImageUrl?: Maybe<Scalars['String']['output']>;
  foundingDate?: Maybe<Scalars['Int']['output']>;
  institutionalGovernances?: Maybe<Array<Scalars['String']['output']>>;
  key: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  mailingCity?: Maybe<Scalars['String']['output']>;
  mailingCountry?: Maybe<Country>;
  name?: Maybe<Scalars['String']['output']>;
  numberSpecimens?: Maybe<Scalars['Long']['output']>;
  occurrenceCount?: Maybe<Scalars['Long']['output']>;
  thumbor?: Maybe<Scalars['String']['output']>;
  types?: Maybe<Array<Scalars['String']['output']>>;
};


export type InstitutionSearchEntityThumborArgs = {
  fitIn?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type InstitutionSearchInput = {
  active?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  alternativeCode?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Array<Scalars['String']['input']>>;
  code?: InputMaybe<Array<Scalars['String']['input']>>;
  contact?: InputMaybe<Scalars['ID']['input']>;
  country?: InputMaybe<Array<Country>>;
  discipline?: InputMaybe<Array<Scalars['String']['input']>>;
  displayOnNHCPortal?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  fuzzyName?: InputMaybe<Array<Scalars['String']['input']>>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  institutionKey?: InputMaybe<Array<Scalars['GUID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Array<Scalars['String']['input']>>;
  numberSpecimens?: InputMaybe<Array<Scalars['String']['input']>>;
  occurrenceCount?: InputMaybe<Array<Scalars['String']['input']>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<CollectionsSortField>;
  sortOrder?: InputMaybe<SortOrder>;
  type?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type InstitutionSearchResults = {
  __typename?: 'InstitutionSearchResults';
  cardinality?: Maybe<InstitutionCardinality>;
  count: Scalars['Int']['output'];
  endOfRecords: Scalars['Boolean']['output'];
  facet?: Maybe<InstitutionFacet>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Maybe<InstitutionSearchEntity>>;
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

export enum InternalOccurrenceSearchParameter {
  EventDateGte = 'EVENT_DATE_GTE',
  EventDateLte = 'EVENT_DATE_LTE'
}

export enum InterpretationRemarkSeverity {
  Error = 'ERROR',
  Info = 'INFO',
  Warning = 'WARNING'
}

export enum InterpretationType_RecordType {
  All = 'ALL',
  Amplification = 'AMPLIFICATION',
  AmplificationTable = 'AMPLIFICATION_TABLE',
  Audubon = 'AUDUBON',
  AudubonTable = 'AUDUBON_TABLE',
  Basic = 'BASIC',
  ChronometricAgeTable = 'CHRONOMETRIC_AGE_TABLE',
  CloningTable = 'CLONING_TABLE',
  Clustering = 'CLUSTERING',
  DnaDerivedDataTable = 'DNA_DERIVED_DATA_TABLE',
  Event = 'EVENT',
  EventIdentifier = 'EVENT_IDENTIFIER',
  ExtendedMeasurementOrFactTable = 'EXTENDED_MEASUREMENT_OR_FACT_TABLE',
  GelImageTable = 'GEL_IMAGE_TABLE',
  GermplasmAccessionTable = 'GERMPLASM_ACCESSION_TABLE',
  GermplasmMeasurementScoreTable = 'GERMPLASM_MEASUREMENT_SCORE_TABLE',
  GermplasmMeasurementTraitTable = 'GERMPLASM_MEASUREMENT_TRAIT_TABLE',
  GermplasmMeasurementTrialTable = 'GERMPLASM_MEASUREMENT_TRIAL_TABLE',
  Grscicoll = 'GRSCICOLL',
  IdentificationTable = 'IDENTIFICATION_TABLE',
  Identifier = 'IDENTIFIER',
  IdentifierAbsent = 'IDENTIFIER_ABSENT',
  IdentifierTable = 'IDENTIFIER_TABLE',
  Image = 'IMAGE',
  ImageTable = 'IMAGE_TABLE',
  LoanTable = 'LOAN_TABLE',
  Location = 'LOCATION',
  LocationFeature = 'LOCATION_FEATURE',
  MaterialSampleTable = 'MATERIAL_SAMPLE_TABLE',
  MeasurementOrFact = 'MEASUREMENT_OR_FACT',
  MeasurementOrFactTable = 'MEASUREMENT_OR_FACT_TABLE',
  Metadata = 'METADATA',
  Multimedia = 'MULTIMEDIA',
  MultimediaTable = 'MULTIMEDIA_TABLE',
  Occurrence = 'OCCURRENCE',
  PermitTable = 'PERMIT_TABLE',
  PreparationTable = 'PREPARATION_TABLE',
  PreservationTable = 'PRESERVATION_TABLE',
  ReferenceTable = 'REFERENCE_TABLE',
  ResourceRelationshipTable = 'RESOURCE_RELATIONSHIP_TABLE',
  Taxonomy = 'TAXONOMY',
  Temporal = 'TEMPORAL',
  Verbatim = 'VERBATIM'
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
  gbifDatasetKey?: Maybe<Array<Maybe<DatasetFacet>>>;
  gbifNetworkKey?: Maybe<Array<Maybe<NetworkFacet>>>;
  gbifProgrammeAcronym?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  literatureType?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  openAccess?: Maybe<Array<Maybe<GenericFacetResult_Boolean>>>;
  peerReview?: Maybe<Array<Maybe<GenericFacetResult_Boolean>>>;
  publisher?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  publishingOrganizationKey?: Maybe<Array<Maybe<OrganizationFacet>>>;
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


export type LiteratureFacetGbifDatasetKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetGbifNetworkKeyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type LiteratureFacetGbifProgrammeAcronymArgs = {
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


export type LiteratureFacetPublishingOrganizationKeyArgs = {
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

export enum LiteratureSearchParameter {
  Added = 'ADDED',
  CitationType = 'CITATION_TYPE',
  CountriesOfCoverage = 'COUNTRIES_OF_COVERAGE',
  CountriesOfResearcher = 'COUNTRIES_OF_RESEARCHER',
  Discovered = 'DISCOVERED',
  Doi = 'DOI',
  GbifDatasetKey = 'GBIF_DATASET_KEY',
  GbifDownloadKey = 'GBIF_DOWNLOAD_KEY',
  GbifHighertaxonKey = 'GBIF_HIGHERTAXON_KEY',
  GbifNetworkKey = 'GBIF_NETWORK_KEY',
  GbifOccurrenceKey = 'GBIF_OCCURRENCE_KEY',
  GbifProgramme = 'GBIF_PROGRAMME',
  GbifProjectIdentifier = 'GBIF_PROJECT_IDENTIFIER',
  GbifTaxonKey = 'GBIF_TAXON_KEY',
  Language = 'LANGUAGE',
  LiteratureType = 'LITERATURE_TYPE',
  Modified = 'MODIFIED',
  OpenAccess = 'OPEN_ACCESS',
  PeerReview = 'PEER_REVIEW',
  Published = 'PUBLISHED',
  Publisher = 'PUBLISHER',
  PublishingCountry = 'PUBLISHING_COUNTRY',
  PublishingOrganizationKey = 'PUBLISHING_ORGANIZATION_KEY',
  Relevance = 'RELEVANCE',
  Source = 'SOURCE',
  Topics = 'TOPICS',
  Websites = 'WEBSITES',
  Year = 'YEAR'
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

export type Measurement = {
  __typename?: 'Measurement';
  measurementAccuracy?: Maybe<Scalars['String']['output']>;
  measurementDeterminedBy?: Maybe<Scalars['String']['output']>;
  measurementDeterminedDate?: Maybe<Scalars['String']['output']>;
  measurementID?: Maybe<Scalars['String']['output']>;
  measurementMethod?: Maybe<Scalars['String']['output']>;
  measurementRemarks?: Maybe<Scalars['String']['output']>;
  measurementType?: Maybe<Scalars['String']['output']>;
  measurementUnit?: Maybe<Scalars['String']['output']>;
  measurementValue?: Maybe<Scalars['String']['output']>;
};

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

export type MeetingEvent = {
  __typename?: 'MeetingEvent';
  allDayEvent?: Maybe<Scalars['Boolean']['output']>;
  attendees?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  coordinates?: Maybe<Coordinates>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
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

export type MenuItem = {
  __typename?: 'MenuItem';
  children?: Maybe<Array<MenuItem>>;
  externalLink?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  link?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export enum MetadataType {
  Dc = 'DC',
  Eml = 'EML'
}

export type MonthBreakdown = {
  __typename?: 'MonthBreakdown';
  c: Scalars['Int']['output'];
  m: Scalars['Int']['output'];
};

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
  title?: Maybe<Scalars['String']['output']>;
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

export enum NameUsageSearchParameter {
  ConstituentKey = 'CONSTITUENT_KEY',
  DatasetKey = 'DATASET_KEY',
  Habitat = 'HABITAT',
  HighertaxonKey = 'HIGHERTAXON_KEY',
  Issue = 'ISSUE',
  IsExtinct = 'IS_EXTINCT',
  NameType = 'NAME_TYPE',
  NomenclaturalStatus = 'NOMENCLATURAL_STATUS',
  Origin = 'ORIGIN',
  Rank = 'RANK',
  Status = 'STATUS',
  Threat = 'THREAT'
}

export enum NameUsageSearchRequest_NameUsageQueryField {
  Description = 'DESCRIPTION',
  Scientific = 'SCIENTIFIC',
  Vernacular = 'VERNACULAR'
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

export type NetworkFacet = {
  __typename?: 'NetworkFacet';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  network?: Maybe<Network>;
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
  createdAt: Scalars['DateTime']['output'];
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
  acceptedTaxon?: Maybe<Taxon>;
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
  higherGeography?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  higherGeographyID?: Maybe<Scalars['String']['output']>;
  highestBiostratigraphicZone?: Maybe<Scalars['String']['output']>;
  hostingOrganizationKey?: Maybe<Scalars['ID']['output']>;
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
  iucnRedListCategory?: Maybe<Scalars['String']['output']>;
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
  movingImages?: Maybe<Array<MultimediaItem>>;
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
  sounds?: Maybe<Array<MultimediaItem>>;
  source?: Maybe<Scalars['String']['output']>;
  spatial?: Maybe<Scalars['String']['output']>;
  species?: Maybe<Scalars['String']['output']>;
  speciesKey?: Maybe<Scalars['ID']['output']>;
  specificEpithet?: Maybe<Scalars['String']['output']>;
  startDayOfYear?: Maybe<Scalars['Int']['output']>;
  stateProvince?: Maybe<Scalars['String']['output']>;
  stillImageCount?: Maybe<Scalars['Int']['output']>;
  stillImages?: Maybe<Array<MultimediaItem>>;
  subgenus?: Maybe<Scalars['String']['output']>;
  subgenusKey?: Maybe<Scalars['ID']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  tableOfContents?: Maybe<Scalars['String']['output']>;
  taxon?: Maybe<Taxon>;
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
  typeStatus?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
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
  higherGeography: Scalars['Long']['output'];
  hostingOrganizationKey: Scalars['Long']['output'];
  identifiedBy: Scalars['Long']['output'];
  institutionCode: Scalars['Long']['output'];
  institutionKey: Scalars['Long']['output'];
  isSequenced: Scalars['Long']['output'];
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
  sex: Scalars['Long']['output'];
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
  chronometricDate?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  cloning?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  description?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  distribution?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  dnaDerivedData?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  eolMedia?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  eolReference?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
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
  speciesProfile?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  typesAndSpecimen?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  vernacularName?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
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
  higherGeography?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  hostingOrganizationKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Organization>>>;
  id?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  identifiedBy?: Maybe<Array<Maybe<OccurrenceFacetResult_IdentifiedBy>>>;
  individualCount?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  installationKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Installation>>>;
  institutionCode?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  institutionKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Institution>>>;
  isInCluster?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
  isSequenced?: Maybe<Array<Maybe<OccurrenceFacetResult_Boolean>>>;
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
  occurrenceStatus?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
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
  sex?: Maybe<Array<Maybe<OccurrenceFacetResult_Sex>>>;
  speciesKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  startDayOfYear?: Maybe<Array<Maybe<OccurrenceFacetResult_Float>>>;
  stateProvince?: Maybe<Array<Maybe<OccurrenceFacetResult_String>>>;
  taxonKey?: Maybe<Array<Maybe<OccurrenceFacetResult_Taxon>>>;
  typeStatus?: Maybe<Array<Maybe<OccurrenceFacetResult_TypeStatus>>>;
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


export type OccurrenceFacetHigherGeographyArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
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


export type OccurrenceFacetIsInClusterArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type OccurrenceFacetIsSequencedArgs = {
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

export type OccurrenceFacetResult_Sex = {
  __typename?: 'OccurrenceFacetResult_sex';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  concept?: Maybe<VocabularyConcept>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_SexOccurrencesArgs = {
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

export type OccurrenceFacetResult_TypeStatus = {
  __typename?: 'OccurrenceFacetResult_typeStatus';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  concept?: Maybe<VocabularyConcept>;
  count: Scalars['Long']['output'];
  key: Scalars['String']['output'];
  occurrences: OccurrenceSearchResult;
};


export type OccurrenceFacetResult_TypeStatusOccurrencesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceFeatures = {
  __typename?: 'OccurrenceFeatures';
  /** The occurrence has an IIIF endpoint */
  firstIIIF?: Maybe<Scalars['String']['output']>;
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

export type OccurrenceFeedback = {
  __typename?: 'OccurrenceFeedback';
  datasetContactEmail?: Maybe<OccurrenceFeedbackValue>;
  gbifGithub: Scalars['String']['output'];
  publisherFeedbackSystem?: Maybe<OccurrenceFeedbackValue>;
};

export type OccurrenceFeedbackValue = {
  __typename?: 'OccurrenceFeedbackValue';
  title: Scalars['String']['output'];
  value: Scalars['String']['output'];
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
  AgeOrStageInferredFromParentRank = 'AGE_OR_STAGE_INFERRED_FROM_PARENT_RANK',
  AgeOrStageInvalidRange = 'AGE_OR_STAGE_INVALID_RANGE',
  AgeOrStageRankMismatch = 'AGE_OR_STAGE_RANK_MISMATCH',
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
  EonOrEonothemAndEraOrErathemMismatch = 'EON_OR_EONOTHEM_AND_ERA_OR_ERATHEM_MISMATCH',
  EonOrEonothemInvalidRange = 'EON_OR_EONOTHEM_INVALID_RANGE',
  EonOrEonothemRankMismatch = 'EON_OR_EONOTHEM_RANK_MISMATCH',
  EpochOrSeriesAndAgeOrStageMismatch = 'EPOCH_OR_SERIES_AND_AGE_OR_STAGE_MISMATCH',
  EpochOrSeriesInferredFromParentRank = 'EPOCH_OR_SERIES_INFERRED_FROM_PARENT_RANK',
  EpochOrSeriesInvalidRange = 'EPOCH_OR_SERIES_INVALID_RANGE',
  EpochOrSeriesRankMismatch = 'EPOCH_OR_SERIES_RANK_MISMATCH',
  EraOrErathemAndPeriodOrSystemMismatch = 'ERA_OR_ERATHEM_AND_PERIOD_OR_SYSTEM_MISMATCH',
  EraOrErathemInferredFromParentRank = 'ERA_OR_ERATHEM_INFERRED_FROM_PARENT_RANK',
  EraOrErathemInvalidRange = 'ERA_OR_ERATHEM_INVALID_RANGE',
  EraOrErathemRankMismatch = 'ERA_OR_ERATHEM_RANK_MISMATCH',
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
  PeriodOrSystemAndEpochOrSeriesMismatch = 'PERIOD_OR_SYSTEM_AND_EPOCH_OR_SERIES_MISMATCH',
  PeriodOrSystemInferredFromParentRank = 'PERIOD_OR_SYSTEM_INFERRED_FROM_PARENT_RANK',
  PeriodOrSystemInvalidRange = 'PERIOD_OR_SYSTEM_INVALID_RANGE',
  PeriodOrSystemRankMismatch = 'PERIOD_OR_SYSTEM_RANK_MISMATCH',
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
  SuspectedType = 'SUSPECTED_TYPE',
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


export type OccurrenceNameUsageFormattedNameArgs = {
  useFallback?: InputMaybe<Scalars['Boolean']['input']>;
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

export enum OccurrenceSearchParameter {
  AcceptedTaxonKey = 'ACCEPTED_TAXON_KEY',
  AssociatedSequences = 'ASSOCIATED_SEQUENCES',
  BasisOfRecord = 'BASIS_OF_RECORD',
  Bed = 'BED',
  Biostratigraphy = 'BIOSTRATIGRAPHY',
  CatalogNumber = 'CATALOG_NUMBER',
  ClassKey = 'CLASS_KEY',
  CollectionCode = 'COLLECTION_CODE',
  CollectionKey = 'COLLECTION_KEY',
  Continent = 'CONTINENT',
  CoordinateUncertaintyInMeters = 'COORDINATE_UNCERTAINTY_IN_METERS',
  Country = 'COUNTRY',
  CrawlId = 'CRAWL_ID',
  DatasetId = 'DATASET_ID',
  DatasetKey = 'DATASET_KEY',
  DatasetName = 'DATASET_NAME',
  DecimalLatitude = 'DECIMAL_LATITUDE',
  DecimalLongitude = 'DECIMAL_LONGITUDE',
  DegreeOfEstablishment = 'DEGREE_OF_ESTABLISHMENT',
  Depth = 'DEPTH',
  DistanceFromCentroidInMeters = 'DISTANCE_FROM_CENTROID_IN_METERS',
  DwcaExtension = 'DWCA_EXTENSION',
  EarliestAgeOrLowestStage = 'EARLIEST_AGE_OR_LOWEST_STAGE',
  EarliestEonOrLowestEonothem = 'EARLIEST_EON_OR_LOWEST_EONOTHEM',
  EarliestEpochOrLowestSeries = 'EARLIEST_EPOCH_OR_LOWEST_SERIES',
  EarliestEraOrLowestErathem = 'EARLIEST_ERA_OR_LOWEST_ERATHEM',
  EarliestPeriodOrLowestSystem = 'EARLIEST_PERIOD_OR_LOWEST_SYSTEM',
  Elevation = 'ELEVATION',
  EndDayOfYear = 'END_DAY_OF_YEAR',
  EstablishmentMeans = 'ESTABLISHMENT_MEANS',
  EventDate = 'EVENT_DATE',
  EventDateGte = 'EVENT_DATE_GTE',
  EventId = 'EVENT_ID',
  FamilyKey = 'FAMILY_KEY',
  FieldNumber = 'FIELD_NUMBER',
  Formation = 'FORMATION',
  GadmGid = 'GADM_GID',
  GadmLevel_0Gid = 'GADM_LEVEL_0_GID',
  GadmLevel_1Gid = 'GADM_LEVEL_1_GID',
  GadmLevel_2Gid = 'GADM_LEVEL_2_GID',
  GadmLevel_3Gid = 'GADM_LEVEL_3_GID',
  GbifId = 'GBIF_ID',
  GbifRegion = 'GBIF_REGION',
  GenusKey = 'GENUS_KEY',
  GeologicalTime = 'GEOLOGICAL_TIME',
  Geometry = 'GEOMETRY',
  GeoreferencedBy = 'GEOREFERENCED_BY',
  GeoDistance = 'GEO_DISTANCE',
  Group = 'GROUP',
  HasCoordinate = 'HAS_COORDINATE',
  HasGeospatialIssue = 'HAS_GEOSPATIAL_ISSUE',
  HigherGeography = 'HIGHER_GEOGRAPHY',
  HighestBiostratigraphicZone = 'HIGHEST_BIOSTRATIGRAPHIC_ZONE',
  HostingOrganizationKey = 'HOSTING_ORGANIZATION_KEY',
  IdentifiedBy = 'IDENTIFIED_BY',
  IdentifiedById = 'IDENTIFIED_BY_ID',
  InstallationKey = 'INSTALLATION_KEY',
  InstitutionCode = 'INSTITUTION_CODE',
  InstitutionKey = 'INSTITUTION_KEY',
  Island = 'ISLAND',
  IslandGroup = 'ISLAND_GROUP',
  Issue = 'ISSUE',
  IsInCluster = 'IS_IN_CLUSTER',
  IsSequenced = 'IS_SEQUENCED',
  IucnRedListCategory = 'IUCN_RED_LIST_CATEGORY',
  KingdomKey = 'KINGDOM_KEY',
  LastInterpreted = 'LAST_INTERPRETED',
  LatestAgeOrHighestStage = 'LATEST_AGE_OR_HIGHEST_STAGE',
  LatestEonOrHighestEonothem = 'LATEST_EON_OR_HIGHEST_EONOTHEM',
  LatestEpochOrHighestSeries = 'LATEST_EPOCH_OR_HIGHEST_SERIES',
  LatestEraOrHighestErathem = 'LATEST_ERA_OR_HIGHEST_ERATHEM',
  LatestPeriodOrHighestSystem = 'LATEST_PERIOD_OR_HIGHEST_SYSTEM',
  License = 'LICENSE',
  LifeStage = 'LIFE_STAGE',
  Lithostratigraphy = 'LITHOSTRATIGRAPHY',
  Locality = 'LOCALITY',
  LowestBiostratigraphicZone = 'LOWEST_BIOSTRATIGRAPHIC_ZONE',
  MediaType = 'MEDIA_TYPE',
  Member = 'MEMBER',
  Modified = 'MODIFIED',
  Month = 'MONTH',
  NetworkKey = 'NETWORK_KEY',
  OccurrenceId = 'OCCURRENCE_ID',
  OccurrenceStatus = 'OCCURRENCE_STATUS',
  OrderKey = 'ORDER_KEY',
  OrganismId = 'ORGANISM_ID',
  OrganismQuantity = 'ORGANISM_QUANTITY',
  OrganismQuantityType = 'ORGANISM_QUANTITY_TYPE',
  OtherCatalogNumbers = 'OTHER_CATALOG_NUMBERS',
  ParentEventId = 'PARENT_EVENT_ID',
  Pathway = 'PATHWAY',
  PhylumKey = 'PHYLUM_KEY',
  Preparations = 'PREPARATIONS',
  PreviousIdentifications = 'PREVIOUS_IDENTIFICATIONS',
  Programme = 'PROGRAMME',
  ProjectId = 'PROJECT_ID',
  Protocol = 'PROTOCOL',
  PublishedByGbifRegion = 'PUBLISHED_BY_GBIF_REGION',
  PublishingCountry = 'PUBLISHING_COUNTRY',
  PublishingOrg = 'PUBLISHING_ORG',
  RecordedBy = 'RECORDED_BY',
  RecordedById = 'RECORDED_BY_ID',
  RecordNumber = 'RECORD_NUMBER',
  RelativeOrganismQuantity = 'RELATIVE_ORGANISM_QUANTITY',
  Repatriated = 'REPATRIATED',
  SampleSizeUnit = 'SAMPLE_SIZE_UNIT',
  SampleSizeValue = 'SAMPLE_SIZE_VALUE',
  SamplingProtocol = 'SAMPLING_PROTOCOL',
  ScientificName = 'SCIENTIFIC_NAME',
  Sex = 'SEX',
  SpeciesKey = 'SPECIES_KEY',
  StartDayOfYear = 'START_DAY_OF_YEAR',
  StateProvince = 'STATE_PROVINCE',
  SubgenusKey = 'SUBGENUS_KEY',
  TaxonomicStatus = 'TAXONOMIC_STATUS',
  TaxonConceptId = 'TAXON_CONCEPT_ID',
  TaxonId = 'TAXON_ID',
  TaxonKey = 'TAXON_KEY',
  TypeStatus = 'TYPE_STATUS',
  VerbatimScientificName = 'VERBATIM_SCIENTIFIC_NAME',
  WaterBody = 'WATER_BODY',
  Year = 'YEAR'
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
  sortBy?: InputMaybe<OccurrenceSortBy>;
  sortOrder?: InputMaybe<SortOrder>;
};

export enum OccurrenceSortBy {
  Date = 'DATE'
}

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
  literatureCount?: Maybe<Scalars['Int']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  machineTags?: Maybe<Array<MachineTag>>;
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  numPublishedDatasets?: Maybe<Scalars['Int']['output']>;
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  phone?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  postalCode?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  publishedDataset: DatasetListResults;
  tags?: Maybe<Array<Maybe<Tag>>>;
  thumborLogoUrl?: Maybe<Scalars['String']['output']>;
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


export type OrganizationMachineTagsArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};


export type OrganizationPublishedDatasetArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type OrganizationThumborLogoUrlArgs = {
  fitIn?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type OrganizationBreakdown = {
  __typename?: 'OrganizationBreakdown';
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
};

export type OrganizationFacet = {
  __typename?: 'OrganizationFacet';
  _predicate?: Maybe<Scalars['JSON']['output']>;
  count: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  organization?: Maybe<Organization>;
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
  IsNull = 'isNull',
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
  events?: Maybe<Array<MeetingEvent>>;
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
  collectionDescriptorGroup?: Maybe<CollectionDescriptorGroup>;
  collectionSearch?: Maybe<CollectionSearchResults>;
  composition?: Maybe<Composition>;
  dataUse?: Maybe<DataUse>;
  dataset?: Maybe<Dataset>;
  datasetDownloads?: Maybe<DatasetDownloadListResults>;
  datasetList: DatasetListResults;
  datasetSearch: DatasetSearchResults;
  datasetsByDownload?: Maybe<DatasetDownloadListResults>;
  directoryAmbassadors?: Maybe<DirectoryContactRoleSearchResults>;
  directoryAwardWinners: Array<Maybe<DirectoryPerson>>;
  directoryMentors?: Maybe<DirectoryContactRoleSearchResults>;
  directoryTranslators?: Maybe<DirectoryPersonRoleSearchResults>;
  download?: Maybe<Download>;
  event?: Maybe<Event>;
  eventSearch?: Maybe<EventSearchResult>;
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
  location?: Maybe<Event>;
  meetingEvent?: Maybe<MeetingEvent>;
  network?: Maybe<Network>;
  networkSearch?: Maybe<NetworkSearchResults>;
  news?: Maybe<News>;
  node?: Maybe<Node>;
  nodeCountry?: Maybe<Node>;
  nodeSearch?: Maybe<NodeSearchResults>;
  notification?: Maybe<Notification>;
  occurrence?: Maybe<Occurrence>;
  occurrenceClusterSearch?: Maybe<OccurrenceClusterSearchResult>;
  occurrenceSearch?: Maybe<OccurrenceSearchResult>;
  occurrences?: Maybe<SimpleOccurrenceResults>;
  orcid?: Maybe<OrcId>;
  organization?: Maybe<Organization>;
  organizationSearch?: Maybe<OrganizationSearchResult>;
  participant?: Maybe<Participant>;
  participantSearch?: Maybe<ParticipantSearchResults>;
  person?: Maybe<Person>;
  programme?: Maybe<Programme>;
  resource?: Maybe<Resource>;
  resourceSearch?: Maybe<ResourceSearchResult>;
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
  vocabularyConcept?: Maybe<VocabularyConcept>;
  vocabularyConceptSearch?: Maybe<VocabularySearchResult>;
};


export type QueryArticleArgs = {
  id: Scalars['String']['input'];
};


export type QueryBackboneSearchArgs = {
  habitat?: InputMaybe<Array<InputMaybe<Habitat>>>;
  higherTaxonKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hl?: InputMaybe<Scalars['Boolean']['input']>;
  isExtinct?: InputMaybe<Scalars['Boolean']['input']>;
  issue?: InputMaybe<Array<InputMaybe<NameUsageIssue>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nameType?: InputMaybe<Array<InputMaybe<NameType>>>;
  nomenclaturalStatus?: InputMaybe<Array<InputMaybe<NomenclaturalStatus>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  qField?: InputMaybe<Array<InputMaybe<TaxonSearchQField>>>;
  query?: InputMaybe<TaxonSearchInput>;
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


export type QueryCollectionDescriptorGroupArgs = {
  collectionKey: Scalars['ID']['input'];
  key: Scalars['ID']['input'];
};


export type QueryCollectionSearchArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  alternativeCode?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<Scalars['ID']['input']>;
  contentType?: InputMaybe<Array<Scalars['String']['input']>>;
  country?: InputMaybe<Array<InputMaybe<Country>>>;
  descriptorCountry?: InputMaybe<Array<Country>>;
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
  preservationType?: InputMaybe<Array<Scalars['String']['input']>>;
  q?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<CollectionSearchInput>;
  recordedBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortBy?: InputMaybe<CollectionsSortField>;
  sortOrder?: InputMaybe<SortOrder>;
  taxonKey?: InputMaybe<Array<Scalars['ID']['input']>>;
  typeStatus?: InputMaybe<Array<Scalars['String']['input']>>;
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


export type QueryDatasetListArgs = {
  country?: InputMaybe<Country>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  identifierType?: InputMaybe<IdentifierType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineTagName?: InputMaybe<Scalars['String']['input']>;
  machineTagNamespace?: InputMaybe<Scalars['String']['input']>;
  machineTagValue?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<DatasetType>;
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
  query?: InputMaybe<DatasetSearchInput>;
  subtype?: InputMaybe<Array<InputMaybe<DatasetSubtype>>>;
  type?: InputMaybe<Array<InputMaybe<DatasetType>>>;
};


export type QueryDatasetsByDownloadArgs = {
  key: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDirectoryAmbassadorsArgs = {
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
  key: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  datasetKey?: InputMaybe<Scalars['String']['input']>;
  eventID?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEventSearchArgs = {
  apiKey?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
  size?: InputMaybe<Scalars['Int']['input']>;
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
  active?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  alternativeCode?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Array<Scalars['String']['input']>>;
  code?: InputMaybe<Array<Scalars['String']['input']>>;
  contact?: InputMaybe<Scalars['ID']['input']>;
  country?: InputMaybe<Array<Country>>;
  discipline?: InputMaybe<Array<Scalars['String']['input']>>;
  displayOnNHCPortal?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  fuzzyName?: InputMaybe<Array<Scalars['String']['input']>>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  institutionKey?: InputMaybe<Array<Scalars['GUID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Array<Scalars['String']['input']>>;
  numberSpecimens?: InputMaybe<Array<Scalars['String']['input']>>;
  occurrenceCount?: InputMaybe<Array<Scalars['String']['input']>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<InstitutionSearchInput>;
  sortBy?: InputMaybe<CollectionsSortField>;
  sortOrder?: InputMaybe<SortOrder>;
  type?: InputMaybe<Array<Scalars['String']['input']>>;
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
  gbifOccurrenceKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  gbifTaxonKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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


export type QueryLocationArgs = {
  locationID?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeetingEventArgs = {
  id: Scalars['String']['input'];
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


export type QueryNodeCountryArgs = {
  countryCode: Scalars['String']['input'];
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


export type QueryOccurrencesArgs = {
  datasetKey?: InputMaybe<Scalars['String']['input']>;
  eventID?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Int']['input']>;
  locationID?: InputMaybe<Scalars['String']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
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
  participationStatus?: InputMaybe<ParticipationStatus>;
  q?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<NodeType>;
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
  contentType?: InputMaybe<Array<ContentType>>;
  countriesOfCoverage?: InputMaybe<Array<Scalars['String']['input']>>;
  countriesOfResearcher?: InputMaybe<Array<Scalars['String']['input']>>;
  from?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Array<Scalars['ID']['input']>>;
  locale?: InputMaybe<Array<Scalars['String']['input']>>;
  predicate?: InputMaybe<Predicate>;
  q?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ResourceSortBy>;
  sortOrder?: InputMaybe<ResourceSortOrder>;
  start?: InputMaybe<Scalars['String']['input']>;
  topics?: InputMaybe<Array<Scalars['String']['input']>>;
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
  higherTaxonKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  query?: InputMaybe<TaxonSearchInput>;
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
  taxonScope?: InputMaybe<Array<Scalars['ID']['input']>>;
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


export type QueryVocabularyConceptArgs = {
  concept: Scalars['ID']['input'];
  vocabulary: Scalars['ID']['input'];
};


export type QueryVocabularyConceptSearchArgs = {
  deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  hasParent?: InputMaybe<Scalars['Boolean']['input']>;
  hasReplacement?: InputMaybe<Scalars['Boolean']['input']>;
  includeChildren?: InputMaybe<Scalars['Boolean']['input']>;
  includeChildrenCount?: InputMaybe<Scalars['Boolean']['input']>;
  includeParents?: InputMaybe<Scalars['Boolean']['input']>;
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

export type Resource = Article | Composition | DataUse | Document | GbifProject | Help | Literature | MeetingEvent | News | Notification | Programme | Tool;

export type ResourceDocuments = {
  __typename?: 'ResourceDocuments';
  from: Scalars['Int']['output'];
  results: Array<Maybe<Resource>>;
  size: Scalars['Int']['output'];
  total: Scalars['Long']['output'];
};

export type ResourceFacet = {
  __typename?: 'ResourceFacet';
  contractCountry?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  countriesOfCoverage?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  countriesOfResearcher?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  gbifProgrammeAcronym?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  purposes?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
  topics?: Maybe<Array<Maybe<GenericFacetResult_String>>>;
};


export type ResourceFacetContractCountryArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type ResourceFacetCountriesOfCoverageArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type ResourceFacetCountriesOfResearcherArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type ResourceFacetGbifProgrammeAcronymArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type ResourceFacetPurposesArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type ResourceFacetTopicsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type ResourceSearchResult = {
  __typename?: 'ResourceSearchResult';
  _meta?: Maybe<Scalars['JSON']['output']>;
  _predicate?: Maybe<Scalars['JSON']['output']>;
  documents: ResourceDocuments;
  facet?: Maybe<ResourceFacet>;
};


export type ResourceSearchResultDocumentsArgs = {
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
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

export type SimpleOccurrence = {
  __typename?: 'SimpleOccurrence';
  basisOfRecord?: Maybe<Scalars['String']['output']>;
  family?: Maybe<Scalars['String']['output']>;
  individualCount?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  kingdom?: Maybe<Scalars['String']['output']>;
  occurrenceStatus?: Maybe<Scalars['String']['output']>;
  scientificName?: Maybe<Scalars['String']['output']>;
};

export type SimpleOccurrenceResults = {
  __typename?: 'SimpleOccurrenceResults';
  from: Scalars['Int']['output'];
  results: Array<Maybe<SimpleOccurrence>>;
  size: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

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
  acceptedTaxon?: Maybe<Taxon>;
  authorship?: Maybe<Scalars['String']['output']>;
  backboneTaxon?: Maybe<Taxon>;
  basionymKey?: Maybe<Scalars['Int']['output']>;
  canonicalName?: Maybe<Scalars['String']['output']>;
  /** Lists all direct child usages for a name usage */
  children?: Maybe<TaxonListResult>;
  class?: Maybe<Scalars['String']['output']>;
  classKey?: Maybe<Scalars['Int']['output']>;
  /** Lists all combinations for a name usage */
  combinations?: Maybe<Array<Maybe<Taxon>>>;
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
  parents?: Maybe<Array<Taxon>>;
  phylum?: Maybe<Scalars['String']['output']>;
  phylumKey?: Maybe<Scalars['Int']['output']>;
  publishedIn?: Maybe<Scalars['String']['output']>;
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
  /** Lists all vernacular names for a name usage. The language paramter isn't supported in the official API, so paging will not work properly when using the language parameter */
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


export type TaxonFormattedNameArgs = {
  useFallback?: InputMaybe<Scalars['Boolean']['input']>;
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
  language?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
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
  higherTaxonKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  higherTaxonKey?: Maybe<Array<Maybe<TaxonBreakdown>>>;
  issue?: Maybe<Array<Maybe<TaxonFacetResult>>>;
  rank?: Maybe<Array<Maybe<TaxonFacetResult>>>;
  status?: Maybe<Array<Maybe<TaxonFacetResult>>>;
};


export type TaxonFacetHigherTaxonKeyArgs = {
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
  higherTaxonKey?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
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
  results: Array<Taxon>;
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

export type TaxonSearchInput = {
  datasetKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  habitat?: InputMaybe<Array<InputMaybe<Habitat>>>;
  higherTaxonKey?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  sourceTaxon?: Maybe<Taxon>;
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

export type TemporalCoverage = {
  __typename?: 'TemporalCoverage';
  gte?: Maybe<Scalars['String']['output']>;
  lte?: Maybe<Scalars['String']['output']>;
};

export type Term = {
  __typename?: 'Term';
  group?: Maybe<Scalars['String']['output']>;
  htmlValue?: Maybe<Scalars['JSON']['output']>;
  issues?: Maybe<Array<Scalars['JSON']['output']>>;
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
  createdAt: Scalars['DateTime']['output'];
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
  InvitedTester = 'INVITED_TESTER',
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
  label?: Maybe<Array<Maybe<VocabularyLabel>>>;
  modified?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parentKey?: Maybe<Scalars['ID']['output']>;
  parents?: Maybe<Array<VocabularyConcept>>;
  replacedByKey?: Maybe<Scalars['ID']['output']>;
  sameAsUris?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags: Array<Maybe<VocabularyTag>>;
  uiDefinition?: Maybe<Scalars['String']['output']>;
  uiLabel?: Maybe<Scalars['String']['output']>;
  vocabularyKey?: Maybe<Scalars['ID']['output']>;
  vocabularyName?: Maybe<Scalars['String']['output']>;
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
  language: Scalars['String']['output'];
  modified?: Maybe<Scalars['DateTime']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type VocabularyLabel = {
  __typename?: 'VocabularyLabel';
  created?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
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
  modified?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type VolatileOccurrenceData = {
  __typename?: 'VolatileOccurrenceData';
  /** Duck typing various features that is worth highlighting */
  features?: Maybe<OccurrenceFeatures>;
  /** Feedback options for the occurrence */
  feedback?: Maybe<OccurrenceFeedback>;
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

export type YearBreakdown = {
  __typename?: 'YearBreakdown';
  c: Scalars['Int']['output'];
  ms?: Maybe<Array<Maybe<MonthBreakdown>>>;
  y: Scalars['Int']['output'];
};

export type VocabularyConceptQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
  vocabulary: Scalars['ID']['input'];
  concept: Scalars['ID']['input'];
}>;


export type VocabularyConceptQuery = { __typename?: 'Query', concept?: { __typename?: 'VocabularyConcept', uiLabel?: string | null, uiDefinition?: string | null, parents?: Array<{ __typename?: 'VocabularyConcept', uiLabel?: string | null }> | null } | null };

export type GlobeQueryVariables = Exact<{
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
}>;


export type GlobeQuery = { __typename?: 'Query', globe?: { __typename?: 'Globe', svg: string } | null };

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

export type ResultCardImageFragment = { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } };

export type ParticipantSelectQueryVariables = Exact<{
  type?: InputMaybe<NodeType>;
  participationStatus?: InputMaybe<ParticipationStatus>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ParticipantSelectQuery = { __typename?: 'Query', participantSearch?: { __typename?: 'ParticipantSearchResults', endOfRecords: boolean, count: number, results: Array<{ __typename?: 'Participant', id: string, name?: string | null } | null> } | null };

export type HeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type HeaderQuery = { __typename?: 'Query', gbifHome?: { __typename?: 'Home', title: string, summary?: string | null, children?: Array<{ __typename?: 'MenuItem', id: string, externalLink?: boolean | null, link?: string | null, title: string, children?: Array<{ __typename?: 'MenuItem', id: string, externalLink?: boolean | null, link?: string | null, title: string, children?: Array<{ __typename?: 'MenuItem', id: string, externalLink?: boolean | null, link?: string | null, title: string }> | null }> | null }> | null } | null };

export type CollectionResultFragment = { __typename?: 'CollectionSearchEntity', key: string, name?: string | null, active?: boolean | null, code?: string | null, excerpt?: string | null, numberSpecimens?: any | null, occurrenceCount?: any | null, institutionName?: string | null, institutionKey?: string | null, featuredImageLicense?: License | null, featuredImageUrl?: string | null, descriptorMatches: Array<{ __typename?: 'DescriptorMatches', key?: string | null, usageName?: string | null, country?: Country | null, individualCount?: any | null, recordedBy: Array<string>, typeStatus: Array<string>, identifiedBy: Array<string>, taxon?: { __typename?: 'Taxon', kingdom?: string | null, phylum?: string | null, class?: string | null, order?: string | null, family?: string | null, genus?: string | null, species?: string | null } | null }> };

export type DescriptorGroupsQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type DescriptorGroupsQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', descriptorGroups?: { __typename?: 'CollectionDescriptorGroupResults', results: Array<{ __typename?: 'CollectionDescriptorGroup', key: string, title?: string | null, description?: string | null } | null> } | null } | null };

export type DescriptorGroupQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  collectionKey: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DescriptorGroupQuery = { __typename?: 'Query', collectionDescriptorGroup?: { __typename?: 'CollectionDescriptorGroup', title?: string | null, description?: string | null, descriptors?: { __typename?: 'CollectionDescriptorResults', count?: number | null, offset?: number | null, limit?: number | null, results?: Array<{ __typename?: 'CollectionDescriptor', key: string, verbatim?: any | null }> | null } | null } | null };

export type CollectionQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', key: string, active?: boolean | null, code?: string | null, name?: string | null, description?: string | null, taxonomicCoverage?: string | null, geographicCoverage?: string | null, temporalCoverage?: string | null, notes?: string | null, homepage?: any | null, numberSpecimens?: number | null, incorporatedCollections: Array<string | null>, contentTypes: Array<string>, personalCollection?: boolean | null, email: Array<string>, phone: Array<string>, catalogUrls: Array<string>, apiUrls: Array<string>, preservationTypes: Array<string>, accessionStatus?: string | null, featuredImageLicense?: License | null, created?: string | null, deleted?: string | null, modified?: string | null, modifiedBy?: string | null, institutionKey?: string | null, featuredImageUrl?: string | null, featuredImageUrl_fallback?: string | null, replacedByCollection?: { __typename?: 'Collection', name?: string | null, key: string } | null, identifiers: Array<{ __typename?: 'Identifier', key: string, type: IdentifierType, identifier: string }>, contactPersons: Array<{ __typename?: 'ContactPerson', key?: string | null, firstName?: string | null, lastName?: string | null, phone: Array<string | null>, email: Array<string | null>, taxonomicExpertise: Array<string | null>, primary?: boolean | null, position: Array<string | null>, userIds: Array<{ __typename?: 'UserId', type?: string | null, id?: string | null } | null> }>, alternativeCodes: Array<{ __typename?: 'AlternativeCode', code: string, description?: string | null }>, institution?: { __typename?: 'Institution', code?: string | null, name?: string | null, key: string } | null, mailingAddress?: { __typename?: 'Address', address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: Country | null } | null, address?: { __typename?: 'Address', address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: Country | null } | null, descriptorGroups?: { __typename?: 'CollectionDescriptorGroupResults', count?: number | null } | null } | null };

export type CollectionSummaryMetricsQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
  imagePredicate?: InputMaybe<Predicate>;
  coordinatePredicate?: InputMaybe<Predicate>;
  clusterPredicate?: InputMaybe<Predicate>;
}>;


export type CollectionSummaryMetricsQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any }, cardinality?: { __typename?: 'OccurrenceCardinality', recordedBy: any } | null } | null, withImages?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withCoordinates?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withClusters?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null };

export type CollectionFallbackImageQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type CollectionFallbackImageQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', featuredImageUrl_fallback?: string | null } | null };

export type CollectionSearchQueryVariables = Exact<{
  query?: InputMaybe<CollectionSearchInput>;
}>;


export type CollectionSearchQuery = { __typename?: 'Query', collectionSearch?: { __typename?: 'CollectionSearchResults', count: number, limit: number, offset: number, results: Array<{ __typename?: 'CollectionSearchEntity', key: string, name?: string | null, active?: boolean | null, code?: string | null, excerpt?: string | null, numberSpecimens?: any | null, occurrenceCount?: any | null, institutionName?: string | null, institutionKey?: string | null, featuredImageLicense?: License | null, featuredImageUrl?: string | null, descriptorMatches: Array<{ __typename?: 'DescriptorMatches', key?: string | null, usageName?: string | null, country?: Country | null, individualCount?: any | null, recordedBy: Array<string>, typeStatus: Array<string>, identifiedBy: Array<string>, taxon?: { __typename?: 'Taxon', kingdom?: string | null, phylum?: string | null, class?: string | null, order?: string | null, family?: string | null, genus?: string | null, species?: string | null } | null }> } | null> } | null };

export type CollectionRecordedByFacetQueryVariables = Exact<{
  query?: InputMaybe<CollectionSearchInput>;
}>;


export type CollectionRecordedByFacetQuery = { __typename?: 'Query', search?: { __typename?: 'CollectionSearchResults', facet?: { __typename?: 'CollectionFacet', field?: Array<{ __typename?: 'CollectionFacetResult', name: string, count: number } | null> | null } | null } | null };

export type CollectionCityFacetQueryVariables = Exact<{
  query?: InputMaybe<CollectionSearchInput>;
}>;


export type CollectionCityFacetQuery = { __typename?: 'Query', search?: { __typename?: 'CollectionSearchResults', facet?: { __typename?: 'CollectionFacet', field?: Array<{ __typename?: 'CollectionFacetResult', name: string, count: number } | null> | null } | null } | null };

export type CollectionContentTypeFacetQueryVariables = Exact<{
  query?: InputMaybe<CollectionSearchInput>;
}>;


export type CollectionContentTypeFacetQuery = { __typename?: 'Query', search?: { __typename?: 'CollectionSearchResults', facet?: { __typename?: 'CollectionFacet', field?: Array<{ __typename?: 'CollectionFacetResult', name: string, count: number } | null> | null } | null } | null };

export type CollectionPreservationTypeFacetQueryVariables = Exact<{
  query?: InputMaybe<CollectionSearchInput>;
}>;


export type CollectionPreservationTypeFacetQuery = { __typename?: 'Query', search?: { __typename?: 'CollectionSearchResults', facet?: { __typename?: 'CollectionFacet', field?: Array<{ __typename?: 'CollectionFacetResult', name: string, count: number } | null> | null } | null } | null };

export type CollectionTypeStatusFacetQueryVariables = Exact<{
  query?: InputMaybe<CollectionSearchInput>;
}>;


export type CollectionTypeStatusFacetQuery = { __typename?: 'Query', search?: { __typename?: 'CollectionSearchResults', facet?: { __typename?: 'CollectionFacet', field?: Array<{ __typename?: 'CollectionFacetResult', name: string, count: number } | null> | null } | null } | null };

export type BecomeAPublisherPageQueryVariables = Exact<{ [key: string]: never; }>;


export type BecomeAPublisherPageQuery = { __typename?: 'Query', resource?: { __typename: 'Article', id: string, title: string, summary?: string | null, excerpt?: string | null, body?: string | null, topics?: Array<string | null> | null, purposes?: Array<string | null> | null, audiences?: Array<string | null> | null, citation?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null } | null> | null } | { __typename: 'Composition' } | { __typename: 'DataUse' } | { __typename: 'Document' } | { __typename: 'GbifProject' } | { __typename: 'Help' } | { __typename: 'Literature' } | { __typename: 'MeetingEvent' } | { __typename: 'News' } | { __typename: 'Notification' } | { __typename: 'Programme' } | { __typename: 'Tool' } | null };

export type DatasetStubResultFragment = { __typename?: 'DatasetSearchStub', key: string, title?: string | null, excerpt?: string | null, type?: DatasetType | null, publishingOrganizationTitle?: string | null };

export type DatasetResultFragment = { __typename?: 'Dataset', key: string, title?: string | null, excerpt?: string | null, type?: DatasetType | null, publishingOrganizationTitle?: string | null };

export type DatasetInsightsQueryVariables = Exact<{
  datasetPredicate?: InputMaybe<Predicate>;
  imagePredicate?: InputMaybe<Predicate>;
  coordinatePredicate?: InputMaybe<Predicate>;
  taxonPredicate?: InputMaybe<Predicate>;
  yearPredicate?: InputMaybe<Predicate>;
  eventPredicate?: InputMaybe<Predicate>;
  sitePredicate?: InputMaybe<Predicate>;
}>;


export type DatasetInsightsQuery = { __typename?: 'Query', siteOccurrences?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, unfiltered?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any }, cardinality?: { __typename?: 'OccurrenceCardinality', eventId: any } | null, facet?: { __typename?: 'OccurrenceFacet', dwcaExtension?: Array<{ __typename?: 'OccurrenceFacetResult_string', key: string, count: any } | null> | null } | null } | null, images?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any, results: Array<{ __typename?: 'Occurrence', key?: number | null, stillImages?: Array<{ __typename?: 'MultimediaItem', identifier?: string | null }> | null } | null> } } | null, withCoordinates?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withTaxonMatch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withYear?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withEventId?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null };

export type DatasetQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type DatasetQuery = { __typename?: 'Query', literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', total: any } } | null, totalTaxa: { __typename?: 'TaxonSearchResult', count: number }, accepted: { __typename?: 'TaxonSearchResult', count: number }, synonyms: { __typename?: 'TaxonSearchResult', count: number }, dataset?: { __typename?: 'Dataset', key: string, type?: DatasetType | null, title?: string | null, created?: string | null, modified?: string | null, deleted?: string | null, pubDate?: string | null, description?: string | null, purpose?: string | null, temporalCoverages?: Array<any | null> | null, logoUrl?: any | null, publishingOrganizationKey: string, publishingOrganizationTitle?: string | null, homepage?: any | null, additionalInfo?: string | null, license?: string | null, doi?: string | null, checklistBankDataset?: { __typename?: 'ChecklistBankDataset', key?: number | null } | null, duplicateOfDataset?: { __typename?: 'Dataset', key: string, title?: string | null } | null, metrics?: { __typename?: 'DatasetChecklistMetrics', colCoveragePct?: number | null, nubCoveragePct?: number | null, nubMatchingCount?: number | null, colMatchingCount?: number | null } | null, installation?: { __typename?: 'Installation', key: string, title?: string | null, organization?: { __typename?: 'Organization', key: string, title?: string | null } | null } | null, volatileContributors?: Array<{ __typename?: 'Contact', key?: string | null, firstName?: string | null, lastName?: string | null, position?: Array<string | null> | null, organization?: string | null, address: Array<string | null>, userId?: Array<string | null> | null, email?: Array<string | null> | null, phone?: Array<string | null> | null, type?: string | null, _highlighted?: boolean | null, roles?: Array<string | null> | null } | null> | null, contactsCitation?: Array<{ __typename?: 'ContactsCitation', key: number, abbreviatedName?: string | null, firstName?: string | null, lastName?: string | null, userId?: Array<any | null> | null, roles?: Array<string | null> | null }> | null, geographicCoverages?: Array<{ __typename?: 'GeographicCoverage', description?: string | null, boundingBox?: { __typename?: 'BoundingBox', minLatitude?: number | null, maxLatitude?: number | null, minLongitude?: number | null, maxLongitude?: number | null, globalCoverage?: boolean | null } | null } | null> | null, taxonomicCoverages?: Array<{ __typename?: 'TaxonomicCoverage', description?: string | null, coverages?: Array<{ __typename?: 'TaxonCoverage', scientificName?: string | null, commonName?: string | null, rank?: { __typename?: 'TaxonCoverageRank', interpreted?: string | null } | null } | null> | null } | null> | null, bibliographicCitations?: Array<{ __typename?: 'BibliographicCitation', identifier?: string | null, text?: string | null } | null> | null, samplingDescription?: { __typename?: 'SamplingDescription', studyExtent?: string | null, sampling?: string | null, qualityControl?: string | null, methodSteps?: Array<string | null> | null } | null, dataDescriptions?: Array<{ __typename?: 'DataDescription', charset?: string | null, name?: string | null, format?: string | null, formatVersion?: string | null, url?: string | null } | null> | null, citation?: { __typename?: 'Citation', text: string } | null, project?: { __typename?: 'Project', title?: string | null, abstract?: string | null, studyAreaDescription?: string | null, designDescription?: string | null, funding?: string | null, identifier?: string | null, contacts?: Array<{ __typename?: 'Contact', firstName?: string | null, lastName?: string | null, organization?: string | null, position?: Array<string | null> | null, roles?: Array<string | null> | null, type?: string | null, address: Array<string | null>, city?: string | null, postalCode?: string | null, province?: string | null, country?: Country | null, homepage?: Array<any | null> | null, email?: Array<string | null> | null, phone?: Array<string | null> | null, userId?: Array<string | null> | null } | null> | null } | null, endpoints?: Array<{ __typename?: 'Endpoint', key: string, type: EndpointType, url?: any | null }> | null, identifiers?: Array<{ __typename?: 'Identifier', key: string, type: IdentifierType, identifier: string } | null> | null, machineTags?: Array<{ __typename?: 'MachineTag', namespace: string, name: string, value: string }> | null, gridded?: Array<{ __typename?: 'GridMetric', percent?: number | null } | null> | null } | null };

export type DatasetOccurrenceSearchQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
  imagePredicate?: InputMaybe<Predicate>;
  coordinatePredicate?: InputMaybe<Predicate>;
  clusterPredicate?: InputMaybe<Predicate>;
}>;


export type DatasetOccurrenceSearchQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', from: number, size: number, total: any, results: Array<{ __typename?: 'Occurrence', dynamicProperties?: string | null } | null> } } | null, withImages?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withCoordinates?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withClusters?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null };

export type DatasetSearchQueryVariables = Exact<{
  query?: InputMaybe<DatasetSearchInput>;
}>;


export type DatasetSearchQuery = { __typename?: 'Query', datasetSearch: { __typename?: 'DatasetSearchResults', count: number, limit: number, offset: number, results: Array<{ __typename?: 'DatasetSearchStub', key: string, title?: string | null, excerpt?: string | null, type?: DatasetType | null, publishingOrganizationTitle?: string | null }> } };

export type DatasetHostingFacetQueryVariables = Exact<{
  query?: InputMaybe<DatasetSearchInput>;
}>;


export type DatasetHostingFacetQuery = { __typename?: 'Query', search: { __typename?: 'DatasetSearchResults', facet?: { __typename?: 'DatasetFacet', field?: Array<{ __typename?: 'DatasetOrganizationFacet', name: string, count: number, item?: { __typename?: 'Organization', title?: string | null } | null } | null> | null } | null } };

export type DatasetProjectFacetQueryVariables = Exact<{
  query?: InputMaybe<DatasetSearchInput>;
}>;


export type DatasetProjectFacetQuery = { __typename?: 'Query', search: { __typename?: 'DatasetSearchResults', facet?: { __typename?: 'DatasetFacet', field?: Array<{ __typename?: 'DatasetFacetResult', name: string, count: number } | null> | null } | null } };

export type DatasetPublishingCountryFacetQueryVariables = Exact<{
  query?: InputMaybe<DatasetSearchInput>;
}>;


export type DatasetPublishingCountryFacetQuery = { __typename?: 'Query', search: { __typename?: 'DatasetSearchResults', facet?: { __typename?: 'DatasetFacet', field?: Array<{ __typename?: 'DatasetFacetResult', name: string, count: number } | null> | null } | null } };

export type DatasetLicenceFacetQueryVariables = Exact<{
  query?: InputMaybe<DatasetSearchInput>;
}>;


export type DatasetLicenceFacetQuery = { __typename?: 'Query', search: { __typename?: 'DatasetSearchResults', facet?: { __typename?: 'DatasetFacet', field?: Array<{ __typename?: 'DatasetFacetResult', name: string, count: number } | null> | null } | null } };

export type DatasetTypeFacetQueryVariables = Exact<{
  query?: InputMaybe<DatasetSearchInput>;
}>;


export type DatasetTypeFacetQuery = { __typename?: 'Query', search: { __typename?: 'DatasetSearchResults', facet?: { __typename?: 'DatasetFacet', field?: Array<{ __typename?: 'DatasetFacetResult', name: string, count: number } | null> | null } | null } };

export type HomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageQuery = { __typename?: 'Query', gbifHome?: { __typename?: 'Home', title: string, summary?: string | null, primaryImage?: Array<{ __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string, thumbor: string } }> | null, occurrenceIcon?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string, thumbor: string } } | null, datasetIcon?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string, thumbor: string } } | null, publisherIcon?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string, thumbor: string } } | null, literatureIcon?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string, thumbor: string } } | null, blocks?: Array<{ __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null } | { __typename: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null } | { __typename: 'FeatureBlock', id: string, maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'MeetingEvent', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null } | { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null } | { __typename: 'HeaderBlock', id: string, title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null } | { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'TextBlock', id: string, title?: string | null, body?: string | null, hideTitle?: boolean | null, backgroundColour?: string | null }> | null } | null };

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

export type OrphanCollectionCodesForInstitutionQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OrphanCollectionCodesForInstitutionQuery = { __typename?: 'Query', orphaned?: { __typename?: 'OccurrenceSearchResult', cardinality?: { __typename?: 'OccurrenceCardinality', collectionCode: any } | null, facet?: { __typename?: 'OccurrenceFacet', collectionCode?: Array<{ __typename?: 'OccurrenceFacetResult_string', key: string, count: any } | null> | null } | null } | null };

export type InstitutionQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type InstitutionQuery = { __typename?: 'Query', institution?: { __typename?: 'Institution', key: string, code?: string | null, name?: string | null, description?: string | null, active?: boolean | null, email?: Array<string> | null, phone?: Array<string> | null, homepage?: any | null, catalogUrls?: Array<string> | null, types?: Array<string> | null, apiUrls?: Array<string> | null, institutionalGovernances?: Array<string> | null, disciplines?: Array<string> | null, latitude?: number | null, longitude?: number | null, additionalNames?: Array<string> | null, foundingDate?: number | null, numberSpecimens?: number | null, logoUrl?: any | null, featuredImageLicense?: License | null, created?: string | null, deleted?: string | null, modified?: string | null, modifiedBy?: string | null, collectionCount?: number | null, featuredImageUrl?: string | null, featuredImageUrl_fallback?: string | null, alternativeCodes?: Array<{ __typename?: 'AlternativeCode', code: string, description?: string | null }> | null, masterSourceMetadata?: { __typename?: 'MasterSourceMetadata', key: string, source: string, sourceId: string } | null, replacedByInstitution?: { __typename?: 'Institution', name?: string | null, key: string } | null, identifiers?: Array<{ __typename?: 'Identifier', identifier: string, type: IdentifierType }> | null, contactPersons: Array<{ __typename?: 'ContactPerson', key?: string | null, firstName?: string | null, lastName?: string | null, phone: Array<string | null>, email: Array<string | null>, taxonomicExpertise: Array<string | null>, primary?: boolean | null, position: Array<string | null>, userIds: Array<{ __typename?: 'UserId', type?: string | null, id?: string | null } | null> } | null>, mailingAddress?: { __typename?: 'Address', address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: Country | null } | null, address?: { __typename?: 'Address', address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: Country | null } | null } | null };

export type InstitutionSummaryMetricsQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  predicate?: InputMaybe<Predicate>;
  imagePredicate?: InputMaybe<Predicate>;
  coordinatePredicate?: InputMaybe<Predicate>;
  clusterPredicate?: InputMaybe<Predicate>;
}>;


export type InstitutionSummaryMetricsQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, institution?: { __typename?: 'Institution', key: string, collections?: Array<{ __typename?: 'Collection', key: string, excerpt?: string | null, code?: string | null, name?: string | null, active?: boolean | null, numberSpecimens?: number | null, richness?: number | null, occurrenceCount?: number | null }> | null } | null, withImages?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withCoordinates?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, withClusters?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null };

export type InstitutionFallbackImageQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type InstitutionFallbackImageQuery = { __typename?: 'Query', institution?: { __typename?: 'Institution', featuredImageUrl_fallback?: string | null } | null };

export type InstitutionCityFacetQueryVariables = Exact<{
  query?: InputMaybe<InstitutionSearchInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type InstitutionCityFacetQuery = { __typename?: 'Query', search?: { __typename?: 'InstitutionSearchResults', facet?: { __typename?: 'InstitutionFacet', field?: Array<{ __typename?: 'InstitutionFacetResult', name: string, count: number } | null> | null } | null } | null };

export type InstitutionDisciplineFacetQueryVariables = Exact<{
  query?: InputMaybe<InstitutionSearchInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type InstitutionDisciplineFacetQuery = { __typename?: 'Query', search?: { __typename?: 'InstitutionSearchResults', facet?: { __typename?: 'InstitutionFacet', field?: Array<{ __typename?: 'InstitutionFacetResult', name: string, count: number } | null> | null } | null } | null };

export type InstitutionTypeStatusFacetQueryVariables = Exact<{
  query?: InputMaybe<InstitutionSearchInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type InstitutionTypeStatusFacetQuery = { __typename?: 'Query', search?: { __typename?: 'InstitutionSearchResults', facet?: { __typename?: 'InstitutionFacet', field?: Array<{ __typename?: 'InstitutionFacetResult', name: string, count: number } | null> | null } | null } | null };

export type InstitutionResultFragment = { __typename?: 'InstitutionSearchEntity', key: string, name?: string | null, active?: boolean | null, code?: string | null, excerpt?: string | null, country?: Country | null, mailingCountry?: Country | null, collectionCount?: number | null, numberSpecimens?: any | null, occurrenceCount?: any | null, featuredImageLicense?: License | null, featuredImageUrl?: string | null };

export type InstitutionSearchQueryVariables = Exact<{
  query?: InputMaybe<InstitutionSearchInput>;
}>;


export type InstitutionSearchQuery = { __typename?: 'Query', institutionSearch?: { __typename?: 'InstitutionSearchResults', count: number, limit: number, offset: number, results: Array<{ __typename?: 'InstitutionSearchEntity', key: string, name?: string | null, active?: boolean | null, code?: string | null, excerpt?: string | null, country?: Country | null, mailingCountry?: Country | null, collectionCount?: number | null, numberSpecimens?: any | null, occurrenceCount?: any | null, featuredImageLicense?: License | null, featuredImageUrl?: string | null } | null> } | null };

export type LiteratureResultFragment = { __typename?: 'Literature', id: string, title: string, literatureType?: string | null, year?: number | null, relevance?: Array<string | null> | null, topics?: Array<string | null> | null, excerpt?: string | null };

export type LiteratureCoverageCountryFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteratureCoverageCountryFacetQuery = { __typename?: 'Query', search?: { __typename?: 'LiteratureSearchResult', facet?: { __typename?: 'LiteratureFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type LiteratureRelevanceFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteratureRelevanceFacetQuery = { __typename?: 'Query', search?: { __typename?: 'LiteratureSearchResult', facet?: { __typename?: 'LiteratureFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type LiteratureTopicsFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteratureTopicsFacetQuery = { __typename?: 'Query', search?: { __typename?: 'LiteratureSearchResult', facet?: { __typename?: 'LiteratureFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type LiteratureOpenAccessFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteratureOpenAccessFacetQuery = { __typename?: 'Query', search?: { __typename?: 'LiteratureSearchResult', facet?: { __typename?: 'LiteratureFacet', field?: Array<{ __typename?: 'GenericFacetResult_boolean', count: number, name: boolean } | null> | null } | null } | null };

export type LiteraturePeerReviewFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteraturePeerReviewFacetQuery = { __typename?: 'Query', search?: { __typename?: 'LiteratureSearchResult', facet?: { __typename?: 'LiteratureFacet', field?: Array<{ __typename?: 'GenericFacetResult_boolean', count: number, name: boolean } | null> | null } | null } | null };

export type LiteraturePublisherFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteraturePublisherFacetQuery = { __typename?: 'Query', search?: { __typename?: 'LiteratureSearchResult', facet?: { __typename?: 'LiteratureFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type LiteratureSourceFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteratureSourceFacetQuery = { __typename?: 'Query', search?: { __typename?: 'LiteratureSearchResult', facet?: { __typename?: 'LiteratureFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type LiteratureGbifProgrammeAcronymFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteratureGbifProgrammeAcronymFacetQuery = { __typename?: 'Query', search?: { __typename?: 'LiteratureSearchResult', facet?: { __typename?: 'LiteratureFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type LiteratureListSearchQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
  size?: InputMaybe<Scalars['Int']['input']>;
  from?: InputMaybe<Scalars['Int']['input']>;
}>;


export type LiteratureListSearchQuery = { __typename?: 'Query', literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', size: number, from: number, total: any, results: Array<{ __typename?: 'Literature', id: string, title: string, excerpt?: string | null, countriesOfResearcher?: Array<string | null> | null, countriesOfCoverage?: Array<string | null> | null, year?: number | null, identifiers?: { __typename?: 'LiteratureIdentifiers', doi?: string | null } | null } | null> } } | null };

export type LiteratureTableSearchQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
}>;


export type LiteratureTableSearchQuery = { __typename?: 'Query', literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', from: number, size: number, total: any, results: Array<{ __typename?: 'Literature', id: string, title: string, abstract?: string | null, countriesOfCoverage?: Array<string | null> | null, countriesOfResearcher?: Array<string | null> | null, day?: number | null, month?: number | null, year?: number | null, gbifRegion?: Array<GbifRegion | null> | null, keywords?: Array<string | null> | null, language?: Language | null, literatureType?: string | null, openAccess?: boolean | null, peerReview?: boolean | null, publisher?: string | null, relevance?: Array<string | null> | null, source?: string | null, tags?: Array<string | null> | null, topics?: Array<string | null> | null, websites?: Array<string | null> | null, authors?: Array<{ __typename?: 'Author', firstName?: string | null, lastName?: string | null } | null> | null, identifiers?: { __typename?: 'LiteratureIdentifiers', doi?: string | null } | null } | null> } } | null };

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


export type NetworkQuery = { __typename?: 'Query', network?: { __typename?: 'Network', key: string, title?: string | null, deleted?: string | null, created?: string | null, homepage?: Array<any | null> | null, numConstituents?: number | null, prose?: { __typename?: 'NetworkProse', title: string, summary?: string | null, excerpt?: string | null, body?: string | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null } | null } | null, occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', total: any } } | null };

export type NetworkPublishersQueryVariables = Exact<{
  network: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type NetworkPublishersQuery = { __typename?: 'Query', network?: { __typename?: 'Network', organizations?: { __typename?: 'OrganizationSearchResult', limit: number, count: number, offset: number, results: Array<{ __typename?: 'Organization', key: string, title?: string | null, created?: string | null, country?: Country | null, logoUrl?: string | null, excerpt?: string | null }> } | null } | null };

export type DownloadKeyQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type DownloadKeyQuery = { __typename?: 'Query', download?: { __typename?: 'Download', created: string, doi?: string | null, downloadLink?: string | null, eraseAfter?: string | null, key: string, license?: string | null, modified?: string | null, numberDatasets?: number | null, numberOrganizations?: number | null, numberPublishingCountries?: number | null, size?: number | null, status?: Download_Status | null, totalRecords?: number | null, request?: { __typename?: 'DownloadRequest', predicate?: any | null, format?: string | null, description?: string | null, gbifMachineDescription?: any | null, sql?: string | null } | null } | null, datasetsByDownload?: { __typename?: 'DatasetDownloadListResults', limit: number, offset: number, endOfRecords: boolean, count: number, results: Array<{ __typename?: 'DatasetDownload', datasetKey?: string | null, datasetTitle?: string | null, numberRecords?: number | null } | null> } | null };

export type SlowDownloadKeyQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type SlowDownloadKeyQuery = { __typename?: 'Query', literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', total: any } } | null };

export type DownloadKeyDatasetsQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DownloadKeyDatasetsQuery = { __typename?: 'Query', datasetsByDownload?: { __typename?: 'DatasetDownloadListResults', limit: number, offset: number, endOfRecords: boolean, count: number, results: Array<{ __typename?: 'DatasetDownload', datasetKey?: string | null, datasetTitle?: string | null, numberRecords?: number | null } | null> } | null };

export type PersonKeyQueryVariables = Exact<{
  type: Scalars['String']['input'];
  value: Scalars['String']['input'];
}>;


export type PersonKeyQuery = { __typename?: 'Query', person?: { __typename?: 'Person', name?: any | null, birthDate?: any | null, deathDate?: any | null, image?: any | null } | null };

export type OccurrenceClusterQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type OccurrenceClusterQuery = { __typename?: 'Query', occurrence?: { __typename?: 'Occurrence', related?: { __typename?: 'RelatedOccurrences', count?: number | null, currentOccurrence: { __typename?: 'RelatedCurrentOccurrence', stub?: { __typename?: 'RelatedOccurrenceStub', gbifId?: string | null, occurrenceID?: string | null, catalogNumber?: string | null, publishingOrgKey?: string | null, publishingOrgName?: string | null, datasetKey?: string | null, scientificName?: string | null } | null, occurrence?: { __typename?: 'Occurrence', key?: number | null, basisOfRecord?: string | null, datasetTitle?: string | null, publisherTitle?: string | null, coordinates?: any | null, typeStatus?: Array<string | null> | null, soundCount?: number | null, stillImageCount?: number | null, movingImageCount?: number | null, formattedCoordinates?: string | null, eventDate?: string | null, primaryImage?: { __typename?: 'MultimediaItem', identifier?: string | null } | null, gbifClassification?: { __typename?: 'GbifClassification', usage?: { __typename?: 'OccurrenceNameUsage', formattedName: string } | null } | null, volatile?: { __typename?: 'VolatileOccurrenceData', features?: { __typename?: 'OccurrenceFeatures', isSequenced?: boolean | null, isSamplingEvent?: boolean | null, isTreament?: boolean | null } | null } | null } | null }, relatedOccurrences?: Array<{ __typename?: 'RelatedOccurrence', reasons: Array<string | null>, stub?: { __typename?: 'RelatedOccurrenceStub', gbifId?: string | null, occurrenceID?: string | null, catalogNumber?: string | null, publishingOrgKey?: string | null, publishingOrgName?: string | null, datasetKey?: string | null, scientificName?: string | null } | null, occurrence?: { __typename?: 'Occurrence', key?: number | null, basisOfRecord?: string | null, datasetTitle?: string | null, publisherTitle?: string | null, coordinates?: any | null, typeStatus?: Array<string | null> | null, soundCount?: number | null, stillImageCount?: number | null, movingImageCount?: number | null, formattedCoordinates?: string | null, eventDate?: string | null, primaryImage?: { __typename?: 'MultimediaItem', identifier?: string | null } | null, gbifClassification?: { __typename?: 'GbifClassification', usage?: { __typename?: 'OccurrenceNameUsage', formattedName: string } | null } | null, volatile?: { __typename?: 'VolatileOccurrenceData', features?: { __typename?: 'OccurrenceFeatures', isSequenced?: boolean | null, isSamplingEvent?: boolean | null, isTreament?: boolean | null } | null } | null } | null } | null> | null } | null } | null };

export type RelatedOccurrenceStubFragment = { __typename?: 'RelatedOccurrenceStub', gbifId?: string | null, occurrenceID?: string | null, catalogNumber?: string | null, publishingOrgKey?: string | null, publishingOrgName?: string | null, datasetKey?: string | null, scientificName?: string | null };

export type RelatedOccurrenceDetailsFragment = { __typename?: 'Occurrence', key?: number | null, basisOfRecord?: string | null, datasetTitle?: string | null, publisherTitle?: string | null, coordinates?: any | null, typeStatus?: Array<string | null> | null, soundCount?: number | null, stillImageCount?: number | null, movingImageCount?: number | null, formattedCoordinates?: string | null, eventDate?: string | null, primaryImage?: { __typename?: 'MultimediaItem', identifier?: string | null } | null, gbifClassification?: { __typename?: 'GbifClassification', usage?: { __typename?: 'OccurrenceNameUsage', formattedName: string } | null } | null, volatile?: { __typename?: 'VolatileOccurrenceData', features?: { __typename?: 'OccurrenceFeatures', isSequenced?: boolean | null, isSamplingEvent?: boolean | null, isTreament?: boolean | null } | null } | null };

export type OccurrenceExistsQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type OccurrenceExistsQuery = { __typename?: 'Query', occurrence?: { __typename?: 'Occurrence', key?: number | null } | null };

export type OccurrenceQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type OccurrenceQuery = { __typename?: 'Query', occurrence?: { __typename?: 'Occurrence', key?: number | null, coordinates?: any | null, organismName?: string | null, lastCrawled?: string | null, countryCode?: Country | null, stateProvince?: string | null, locality?: string | null, eventDate?: string | null, typeStatus?: Array<string | null> | null, references?: string | null, issues?: Array<OccurrenceIssue | null> | null, basisOfRecord?: string | null, dynamicProperties?: string | null, institutionKey?: string | null, collectionKey?: string | null, isInCluster?: boolean | null, datasetKey?: string | null, datasetTitle?: string | null, publishingOrgKey?: string | null, publisherTitle?: string | null, institutionCode?: string | null, gadm?: any | null, stillImageCount?: number | null, movingImageCount?: number | null, soundCount?: number | null, scientificName?: string | null, volatile?: { __typename?: 'VolatileOccurrenceData', globe?: { __typename?: 'Globe', svg: string, lat: number, lon: number } | null, features?: { __typename?: 'OccurrenceFeatures', isSpecimen?: boolean | null, isTreament?: boolean | null, isSequenced?: boolean | null, isClustered?: boolean | null, isSamplingEvent?: boolean | null, firstIIIF?: string | null } | null } | null, dataset?: { __typename?: 'Dataset', citation?: { __typename?: 'Citation', text: string } | null } | null, extensions?: { __typename?: 'OccurrenceExtensions', audubon?: Array<any | null> | null, amplification?: Array<any | null> | null, germplasmAccession?: Array<any | null> | null, germplasmMeasurementScore?: Array<any | null> | null, germplasmMeasurementTrait?: Array<any | null> | null, germplasmMeasurementTrial?: Array<any | null> | null, identification?: Array<any | null> | null, identifier?: Array<any | null> | null, image?: Array<any | null> | null, measurementOrFact?: Array<any | null> | null, multimedia?: Array<any | null> | null, reference?: Array<any | null> | null, eolReference?: Array<any | null> | null, resourceRelationship?: Array<any | null> | null, cloning?: Array<any | null> | null, gelImage?: Array<any | null> | null, loan?: Array<any | null> | null, materialSample?: Array<any | null> | null, permit?: Array<any | null> | null, preparation?: Array<any | null> | null, preservation?: Array<any | null> | null, extendedMeasurementOrFact?: Array<any | null> | null, chronometricAge?: Array<any | null> | null, dnaDerivedData?: Array<any | null> | null } | null, stillImages?: Array<{ __typename?: 'MultimediaItem', title?: string | null, type?: string | null, format?: string | null, identifier?: string | null, created?: string | null, creator?: string | null, license?: string | null, publisher?: string | null, references?: string | null, rightsHolder?: string | null, description?: string | null, thumbor?: string | null }> | null, sounds?: Array<{ __typename?: 'MultimediaItem', title?: string | null, type?: string | null, format?: string | null, identifier?: string | null, created?: string | null, creator?: string | null, license?: string | null, publisher?: string | null, references?: string | null, rightsHolder?: string | null, description?: string | null, thumbor?: string | null }> | null, movingImages?: Array<{ __typename?: 'MultimediaItem', title?: string | null, type?: string | null, format?: string | null, identifier?: string | null, created?: string | null, creator?: string | null, license?: string | null, publisher?: string | null, references?: string | null, rightsHolder?: string | null, description?: string | null, thumbor?: string | null }> | null, gbifClassification?: { __typename?: 'GbifClassification', kingdom?: string | null, kingdomKey?: number | null, phylum?: string | null, phylumKey?: number | null, class?: string | null, classKey?: number | null, order?: string | null, orderKey?: number | null, family?: string | null, familyKey?: number | null, genus?: string | null, genusKey?: number | null, species?: string | null, speciesKey?: number | null, synonym?: boolean | null, classification?: Array<{ __typename?: 'Classification', key?: number | null, rank?: string | null, name?: string | null } | null> | null, usage?: { __typename?: 'OccurrenceNameUsage', rank: string, formattedName: string, key: number } | null, acceptedUsage?: { __typename?: 'OccurrenceNameUsage', formattedName: string, key: number } | null } | null, primaryImage?: { __typename?: 'MultimediaItem', identifier?: string | null } | null, terms?: Array<{ __typename?: 'Term', simpleName?: string | null, verbatim?: any | null, value?: any | null, htmlValue?: any | null, remarks?: string | null, issues?: Array<any> | null } | null> | null, recordedByIDs?: Array<{ __typename?: 'AssociatedID', type?: string | null, value?: string | null } | null> | null, identifiedByIDs?: Array<{ __typename?: 'AssociatedID', type?: string | null, value?: string | null } | null> | null } | null };

export type SlowOccurrenceKeyQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  language: Scalars['String']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
}>;


export type SlowOccurrenceKeyQuery = { __typename?: 'Query', occurrence?: { __typename?: 'Occurrence', key?: number | null, institution?: { __typename?: 'Institution', name?: string | null } | null, collection?: { __typename?: 'Collection', name?: string | null } | null, acceptedTaxon?: { __typename?: 'Taxon', vernacularNames?: { __typename?: 'TaxonVernacularNameResult', results: Array<{ __typename?: 'TaxonVernacularName', vernacularName: string, source?: string | null } | null> } | null } | null } | null, literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', results: Array<{ __typename?: 'Literature', title: string, abstract?: string | null, literatureType?: string | null, year?: number | null, websites?: Array<string | null> | null, authors?: Array<{ __typename?: 'Author', firstName?: string | null, lastName?: string | null } | null> | null, identifiers?: { __typename?: 'LiteratureIdentifiers', doi?: string | null } | null } | null> } } | null };

export type OccurrenceMediaDetailsFragment = { __typename?: 'MultimediaItem', title?: string | null, type?: string | null, format?: string | null, identifier?: string | null, created?: string | null, creator?: string | null, license?: string | null, publisher?: string | null, references?: string | null, rightsHolder?: string | null, description?: string | null, thumbor?: string | null };

export type OccurrenceTermFragment = { __typename?: 'Term', simpleName?: string | null, verbatim?: any | null, value?: any | null, htmlValue?: any | null, remarks?: string | null, issues?: Array<any> | null };

export type OccurrenceIsInClusterFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceIsInClusterFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_boolean', count: any, name: boolean } | null> | null } | null } | null };

export type OccurrenceisSequencedFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceisSequencedFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_boolean', count: any, name: boolean } | null> | null } | null } | null };

export type OccurrenceLicenseFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceLicenseFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceBoRFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceBoRFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceMediaFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceMediaFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceMonthFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceMonthFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_float', count: any, name: number } | null> | null } | null } | null };

export type OccurrenceContinentFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceContinentFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceProtocolFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceProtocolFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceDwcaExtensionFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceDwcaExtensionFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceIucnFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceIucnFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceTypeStatusFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceTypeStatusFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_typeStatus', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceIssueFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceIssueFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceOccurrenceStatusFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceOccurrenceStatusFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceProjectIdFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceProjectIdFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceOrganismIdFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceOrganismIdFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrencehigherGeographyFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrencehigherGeographyFacetQuery = { __typename?: 'Query', search?: { __typename?: 'OccurrenceSearchResult', facet?: { __typename?: 'OccurrenceFacet', field?: Array<{ __typename?: 'OccurrenceFacetResult_string', count: any, name: string } | null> | null } | null } | null };

export type OccurrenceMediaSearchQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
  size?: InputMaybe<Scalars['Int']['input']>;
  from?: InputMaybe<Scalars['Int']['input']>;
}>;


export type OccurrenceMediaSearchQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any, size: number, from: number, results: Array<{ __typename?: 'Occurrence', key?: number | null, countryCode?: Country | null, locality?: string | null, basisOfRecord?: string | null, scientificName?: string | null, typeStatus?: Array<string | null> | null, eventDate?: string | null, formattedCoordinates?: string | null, gbifClassification?: { __typename?: 'GbifClassification', usage?: { __typename?: 'OccurrenceNameUsage', formattedName: string } | null } | null, primaryImage?: { __typename?: 'MultimediaItem', identifier?: string | null } | null, volatile?: { __typename?: 'VolatileOccurrenceData', features?: { __typename?: 'OccurrenceFeatures', isSpecimen?: boolean | null } | null } | null } | null> } } | null };

export type OccurrenceSearchQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
}>;


export type OccurrenceSearchQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', from: number, size: number, total: any, results: Array<{ __typename?: 'Occurrence', key?: number | null, taxonKey?: string | null, hasTaxonIssues?: boolean | null, eventDate?: string | null, year?: number | null, coordinates?: any | null, formattedCoordinates?: string | null, country?: string | null, countryCode?: Country | null, basisOfRecord?: string | null, datasetTitle?: string | null, datasetKey?: string | null, publishingOrgKey?: string | null, publisherTitle?: string | null, catalogNumber?: string | null, recordedBy?: Array<string | null> | null, identifiedBy?: Array<string | null> | null, recordNumber?: string | null, typeStatus?: Array<string | null> | null, preparations?: Array<string | null> | null, collectionCode?: string | null, locality?: string | null, higherGeography?: Array<string | null> | null, stateProvince?: string | null, establishmentMeans?: string | null, iucnRedListCategory?: string | null, datasetName?: Array<string | null> | null, stillImageCount?: number | null, movingImageCount?: number | null, soundCount?: number | null, issues?: Array<OccurrenceIssue | null> | null, gbifClassification?: { __typename?: 'GbifClassification', verbatimScientificName?: string | null, usage?: { __typename?: 'OccurrenceNameUsage', rank: string, formattedName: string, key: number } | null } | null, institution?: { __typename?: 'Institution', code?: string | null, name?: string | null, key: string } | null, collection?: { __typename?: 'Collection', code?: string | null, name?: string | null, key: string } | null, volatile?: { __typename?: 'VolatileOccurrenceData', features?: { __typename?: 'OccurrenceFeatures', isSequenced?: boolean | null, isTreament?: boolean | null, isClustered?: boolean | null, isSamplingEvent?: boolean | null } | null } | null } | null> } } | null };

export type PublisherCountsQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  jsonKey: Scalars['JSON']['input'];
}>;


export type PublisherCountsQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, hostedDatasets: { __typename?: 'DatasetSearchResults', count: number }, literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', total: any } } | null };

export type PublisherQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type PublisherQuery = { __typename?: 'Query', publisher?: { __typename?: 'Organization', key: string, title?: string | null, description?: string | null, deleted?: string | null, created?: string | null, homepage?: Array<string | null> | null, numPublishedDatasets?: number | null, latitude?: number | null, longitude?: number | null, address?: Array<string | null> | null, city?: string | null, country?: Country | null, email?: Array<string | null> | null, phone?: Array<string | null> | null, postalCode?: string | null, province?: string | null, endorsingNodeKey?: string | null, endorsementApproved?: boolean | null, logoUrl?: string | null, endorsingNode?: { __typename?: 'Node', title?: string | null, participant?: { __typename?: 'Participant', id: string, name?: string | null, type?: NodeType | null, countryCode?: Country | null } | null } | null, installation: { __typename?: 'InstallationSearchResults', count: number, results: Array<{ __typename?: 'Installation', key: string, title?: string | null }> }, contacts?: Array<{ __typename?: 'Contact', key?: string | null, type?: string | null, firstName?: string | null, lastName?: string | null, email?: Array<string | null> | null, phone?: Array<string | null> | null, homepage?: Array<any | null> | null, organization?: string | null, roles?: Array<string | null> | null, userId?: Array<string | null> | null }> | null } | null };

export type PublisherStatsQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  jsonKey: Scalars['JSON']['input'];
}>;


export type PublisherStatsQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, hostedDatasets: { __typename?: 'DatasetSearchResults', count: number }, literatureSearch?: { __typename?: 'LiteratureSearchResult', documents: { __typename?: 'LiteratureDocuments', total: any } } | null };

export type PublisherResultFragment = { __typename?: 'Organization', key: string, title?: string | null, created?: string | null, country?: Country | null, logoUrl?: string | null, excerpt?: string | null };

export type PublisherSearchQueryVariables = Exact<{
  country?: InputMaybe<Country>;
  q?: InputMaybe<Scalars['String']['input']>;
  isEndorsed?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PublisherSearchQuery = { __typename?: 'Query', list?: { __typename?: 'OrganizationSearchResult', limit: number, count: number, offset: number, results: Array<{ __typename?: 'Organization', key: string, title?: string | null, created?: string | null, country?: Country | null, logoUrl?: string | null, excerpt?: string | null }> } | null };

export type AliasHandlingQueryVariables = Exact<{
  alias: Scalars['String']['input'];
}>;


export type AliasHandlingQuery = { __typename?: 'Query', resource?: { __typename: 'Article', id: string, title: string, urlAlias?: string | null } | { __typename: 'Composition', id: string, urlAlias?: string | null, maybeTitle?: string | null } | { __typename: 'DataUse', id: string, title: string } | { __typename: 'Document', id: string, title: string } | { __typename: 'GbifProject', id: string, title: string } | { __typename: 'Help' } | { __typename: 'Literature' } | { __typename: 'MeetingEvent', id: string, title: string } | { __typename: 'News', id: string, title: string } | { __typename: 'Notification' } | { __typename: 'Programme', id: string, title: string } | { __typename: 'Tool', id: string, title: string } | null };

export type ArticlePageFragment = { __typename?: 'Article', id: string, title: string, summary?: string | null, excerpt?: string | null, body?: string | null, topics?: Array<string | null> | null, purposes?: Array<string | null> | null, audiences?: Array<string | null> | null, citation?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null } | null> | null };

export type ArticleBannerFragment = { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } };

export type DocumentPreviewFragment = { __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null };

export type FundingOrganisationDetailsFragment = { __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null };

export type ProgrammeFundingBannerFragment = { __typename: 'Programme', fundingOrganisations?: Array<{ __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null };

export type ProjectFundingBannerFragment = { __typename: 'GbifProject', fundsAllocated?: number | null, programme?: { __typename: 'Programme', fundingOrganisations?: Array<{ __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null } | null, overrideProgrammeFunding?: Array<{ __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null } | null> | null };

type BlockItemDetails_CarouselBlock_Fragment = { __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null };

type BlockItemDetails_CustomComponentBlock_Fragment = { __typename: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null };

type BlockItemDetails_FeatureBlock_Fragment = { __typename: 'FeatureBlock', id: string, maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'MeetingEvent', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null };

type BlockItemDetails_FeaturedTextBlock_Fragment = { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null };

type BlockItemDetails_HeaderBlock_Fragment = { __typename: 'HeaderBlock', id: string, title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null };

type BlockItemDetails_MediaBlock_Fragment = { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null };

type BlockItemDetails_MediaCountBlock_Fragment = { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null };

type BlockItemDetails_TextBlock_Fragment = { __typename: 'TextBlock', id: string, title?: string | null, body?: string | null, hideTitle?: boolean | null, backgroundColour?: string | null };

export type BlockItemDetailsFragment = BlockItemDetails_CarouselBlock_Fragment | BlockItemDetails_CustomComponentBlock_Fragment | BlockItemDetails_FeatureBlock_Fragment | BlockItemDetails_FeaturedTextBlock_Fragment | BlockItemDetails_HeaderBlock_Fragment | BlockItemDetails_MediaBlock_Fragment | BlockItemDetails_MediaCountBlock_Fragment | BlockItemDetails_TextBlock_Fragment;

export type CarouselBlockDetailsFragment = { __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null };

export type CustomComponentBlockDetailsFragment = { __typename?: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null };

export type OrganizationPreviewQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type OrganizationPreviewQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', title?: string | null, created?: string | null, description?: string | null, contacts?: Array<{ __typename?: 'Contact', email?: Array<string | null> | null, firstName?: string | null, lastName?: string | null }> | null } | null };

export type TaiwanNodeQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
}>;


export type TaiwanNodeQuery = { __typename?: 'Query', nodeSearch?: { __typename?: 'NodeSearchResults', results: Array<{ __typename?: 'Node', key: string, participantTitle?: string | null, participationStatus?: string | null, title?: string | null } | null> } | null };

export type NodeCountryQueryVariables = Exact<{
  countryCode: Scalars['String']['input'];
}>;


export type NodeCountryQuery = { __typename?: 'Query', nodeCountry?: { __typename?: 'Node', key: string, participantTitle?: string | null, participationStatus?: string | null, title?: string | null } | null };

export type NonCountryNodeQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
}>;


export type NonCountryNodeQuery = { __typename?: 'Query', nodeSearch?: { __typename?: 'NodeSearchResults', results: Array<{ __typename?: 'Node', key: string, participantTitle?: string | null } | null> } | null };

export type ParticipantsQueryVariables = Exact<{ [key: string]: never; }>;


export type ParticipantsQuery = { __typename?: 'Query', participantSearch?: { __typename?: 'ParticipantSearchResults', endOfRecords: boolean, results: Array<{ __typename?: 'Participant', id: string, name?: string | null, countryCode?: Country | null, participationStatus?: ParticipationStatus | null } | null> } | null };

export type FeatureBlockDetailsFragment = { __typename: 'FeatureBlock', maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'MeetingEvent', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null };

export type FeaturedTextBlockDetailsFragment = { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null };

export type HeaderBlockDetailsFragment = { __typename: 'HeaderBlock', title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null };

export type MediaBlockDetailsFragment = { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null };

export type MediaCountBlockDetailsFragment = { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null };

export type TextBlockDetailsFragment = { __typename?: 'TextBlock', title?: string | null, body?: string | null, hideTitle?: boolean | null, id: string, backgroundColour?: string | null };

export type CompositionPageFragment = { __typename?: 'Composition', id: string, summary?: string | null, excerpt?: string | null, maybeTitle?: string | null, blocks?: Array<{ __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null } | { __typename: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null } | { __typename: 'FeatureBlock', id: string, maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'MeetingEvent', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null } | { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null } | { __typename: 'HeaderBlock', id: string, title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null } | { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'TextBlock', id: string, title?: string | null, body?: string | null, hideTitle?: boolean | null, backgroundColour?: string | null }> | null };

export type ProseCardImgFragment = { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } };

type ResourceRedirectDetails_Article_Fragment = { __typename: 'Article', id: string, title: string, urlAlias?: string | null };

type ResourceRedirectDetails_Composition_Fragment = { __typename: 'Composition', id: string, urlAlias?: string | null, maybeTitle?: string | null };

type ResourceRedirectDetails_DataUse_Fragment = { __typename: 'DataUse', id: string, title: string };

type ResourceRedirectDetails_Document_Fragment = { __typename: 'Document', id: string, title: string };

type ResourceRedirectDetails_GbifProject_Fragment = { __typename: 'GbifProject', id: string, title: string };

type ResourceRedirectDetails_Help_Fragment = { __typename: 'Help' };

type ResourceRedirectDetails_Literature_Fragment = { __typename: 'Literature' };

type ResourceRedirectDetails_MeetingEvent_Fragment = { __typename: 'MeetingEvent', id: string, title: string };

type ResourceRedirectDetails_News_Fragment = { __typename: 'News', id: string, title: string };

type ResourceRedirectDetails_Notification_Fragment = { __typename: 'Notification' };

type ResourceRedirectDetails_Programme_Fragment = { __typename: 'Programme', id: string, title: string };

type ResourceRedirectDetails_Tool_Fragment = { __typename: 'Tool', id: string, title: string };

export type ResourceRedirectDetailsFragment = ResourceRedirectDetails_Article_Fragment | ResourceRedirectDetails_Composition_Fragment | ResourceRedirectDetails_DataUse_Fragment | ResourceRedirectDetails_Document_Fragment | ResourceRedirectDetails_GbifProject_Fragment | ResourceRedirectDetails_Help_Fragment | ResourceRedirectDetails_Literature_Fragment | ResourceRedirectDetails_MeetingEvent_Fragment | ResourceRedirectDetails_News_Fragment | ResourceRedirectDetails_Notification_Fragment | ResourceRedirectDetails_Programme_Fragment | ResourceRedirectDetails_Tool_Fragment;

export type DataUsePageFragment = { __typename?: 'DataUse', id: string, title: string, summary?: string | null, resourceUsed?: string | null, excerpt?: string | null, body?: string | null, countriesOfCoverage?: Array<string | null> | null, topics?: Array<string | null> | null, purposes?: Array<string | null> | null, audiences?: Array<string | null> | null, citation?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null };

export type DataUseResultFragment = { __typename?: 'DataUse', id: string, title: string, excerpt?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null };

export type DocumentPageFragment = { __typename?: 'Document', id: string, title: string, createdAt: string, excerpt?: string | null, summary?: string | null, body?: string | null, citation?: string | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, document?: { __typename?: 'DocumentAsset', title?: string | null, description?: string | null, file?: { __typename?: 'DocumentAssetFile', fileName?: string | null, url?: string | null } | null } | null };

export type DocumentResultFragment = { __typename?: 'Document', id: string, title: string, excerpt?: string | null };

export type EventPageFragment = { __typename?: 'MeetingEvent', id: string, title: string, summary?: string | null, excerpt?: string | null, body?: string | null, location?: string | null, country?: string | null, start: string, end?: string | null, eventLanguage?: string | null, venue?: string | null, allDayEvent?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null } | null> | null };

export type EventResultFragment = { __typename?: 'MeetingEvent', id: string, title: string, excerpt?: string | null, country?: string | null, location?: string | null, venue?: string | null, start: string, end?: string | null, gbifsAttendee?: string | null, allDayEvent?: boolean | null, primaryLink?: { __typename?: 'Link', url: string } | null };

export type NewsPageFragment = { __typename?: 'News', id: string, title: string, summary?: string | null, excerpt?: string | null, body?: string | null, countriesOfCoverage?: Array<string | null> | null, topics?: Array<string | null> | null, purposes?: Array<string | null> | null, audiences?: Array<string | null> | null, citation?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null };

export type NewsResultFragment = { __typename?: 'News', id: string, title: string, excerpt?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null };

export type ProgrammePageFragment = { __typename: 'Programme', title: string, excerpt?: string | null, blocks?: Array<{ __typename: 'CarouselBlock', id: string, title?: string | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null }> | null } | { __typename: 'CustomComponentBlock', id: string, componentType?: string | null, title?: string | null, width?: string | null, backgroundColour?: string | null, settings?: any | null } | { __typename: 'FeatureBlock', id: string, maxPerRow?: number | null, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null, features?: Array<{ __typename: 'DataUse', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'Feature', id: string, title: string, url: string, primaryImage: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } } | { __typename: 'MeetingEvent', id: string, title: string, start: string, end?: string | null, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null } | { __typename: 'News', id: string, title: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null }> | null } | { __typename: 'FeaturedTextBlock', id: string, title?: string | null, hideTitle?: boolean | null, body?: string | null, backgroundColour?: string | null } | { __typename: 'HeaderBlock', id: string, title?: string | null, summary?: string | null, hideTitle?: boolean | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null } | { __typename: 'MediaBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', url: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'MediaCountBlock', id: string, body?: string | null, reverse?: boolean | null, subtitle?: string | null, titleCountPart: string, backgroundColour?: string | null, roundImage?: boolean | null, mediaTitle: string, optionalImg?: { __typename?: 'AssetImage', title?: string | null, description?: string | null, file: { __typename?: 'ImageFile', mobile: string } } | null, callToAction?: Array<{ __typename?: 'Link', label: string, url: string }> | null } | { __typename: 'TextBlock', id: string, title?: string | null, body?: string | null, hideTitle?: boolean | null, backgroundColour?: string | null }> | null, fundingOrganisations?: Array<{ __typename?: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null };

export type ProgrammeResultFragment = { __typename?: 'Programme', id: string, title: string, excerpt?: string | null, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null };

export type ProjectPageFragment = { __typename: 'GbifProject', title: string, excerpt?: string | null, status?: string | null, start?: string | null, end?: string | null, fundsAllocated?: number | null, projectId?: string | null, id: string, body?: string | null, matchingFunds?: number | null, grantType?: string | null, purposes?: Array<string> | null, leadContact?: string | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, programme?: { __typename: 'Programme', id: string, title: string, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null } | null, overrideProgrammeFunding?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null } | null> | null, leadPartner?: { __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null, additionalPartners?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string }> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null }> | null };

export type ProjectQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type ProjectQuery = { __typename?: 'Query', resource?: { __typename: 'Article', id: string, title: string, urlAlias?: string | null } | { __typename: 'Composition', id: string, urlAlias?: string | null, maybeTitle?: string | null } | { __typename: 'DataUse', id: string, title: string } | { __typename: 'Document', id: string, title: string } | { __typename: 'GbifProject', title: string, excerpt?: string | null, status?: string | null, start?: string | null, end?: string | null, fundsAllocated?: number | null, id: string, projectId?: string | null, body?: string | null, matchingFunds?: number | null, grantType?: string | null, purposes?: Array<string> | null, leadContact?: string | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, programme?: { __typename: 'Programme', id: string, title: string, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null }> | null } | null, overrideProgrammeFunding?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null, logo?: { __typename?: 'AssetImage', title?: string | null, file: { __typename?: 'ImageFile', url: string } } | null } | null> | null, leadPartner?: { __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null, additionalPartners?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, fundingOrganisations?: Array<{ __typename: 'FundingOrganisation', id: string, title?: string | null, url?: string | null } | { __typename: 'Participant', id: string, title?: string | null } | null> | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string }> | null, documents?: Array<{ __typename?: 'DocumentAsset', title?: string | null, file?: { __typename?: 'DocumentAssetFile', url?: string | null, fileName?: string | null, contentType?: string | null, volatile_documentType?: string | null, details?: { __typename?: 'DocumentAssetFileDetails', size?: number | null } | null } | null }> | null } | { __typename: 'Help' } | { __typename: 'Literature' } | { __typename: 'MeetingEvent', id: string, title: string } | { __typename: 'News', id: string, title: string } | { __typename: 'Notification' } | { __typename: 'Programme', id: string, title: string } | { __typename: 'Tool', id: string, title: string } | null, gbifProject?: { __typename?: 'GbifProject', projectId?: string | null } | null, datasetsHelp?: { __typename?: 'Help', title: string } | null };

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


export type ProjectNewsAndEventsQuery = { __typename?: 'Query', gbifProject?: { __typename?: 'GbifProject', news?: Array<{ __typename: 'News', createdAt: string, id: string, title: string, excerpt?: string | null, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null }> | null, events?: Array<{ __typename: 'MeetingEvent', start: string, id: string, title: string, excerpt?: string | null, country?: string | null, location?: string | null, venue?: string | null, end?: string | null, gbifsAttendee?: string | null, allDayEvent?: boolean | null, primaryLink?: { __typename?: 'Link', url: string } | null }> | null } | null, help?: { __typename?: 'Help', title: string } | null };

export type ProjectResultFragment = { __typename?: 'GbifProject', id: string, title: string, excerpt?: string | null, createdAt: string, purposes?: Array<string> | null, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null, programme?: { __typename?: 'Programme', id: string, title: string } | null };

export type ResourceRedirectQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ResourceRedirectQuery = { __typename?: 'Query', resource?: { __typename: 'Article' } | { __typename: 'Composition' } | { __typename: 'DataUse' } | { __typename: 'Document' } | { __typename: 'GbifProject' } | { __typename: 'Help' } | { __typename: 'Literature' } | { __typename: 'MeetingEvent' } | { __typename: 'News' } | { __typename: 'Notification' } | { __typename: 'Programme' } | { __typename: 'Tool' } | null };

export type ToolPageFragment = { __typename?: 'Tool', id: string, title: string, summary?: string | null, body?: string | null, citation?: string | null, createdAt: string, author?: string | null, rights?: string | null, rightsHolder?: string | null, publicationDate?: string | null, primaryImage?: { __typename?: 'AssetImage', description?: string | null, title?: string | null, file: { __typename?: 'ImageFile', url: string, normal: string, mobile: string, details: { __typename?: 'ImageFileDetails', image?: { __typename?: 'ImageFileDetailsImage', width?: number | null, height?: number | null } | null } } } | null, primaryLink?: { __typename?: 'Link', label: string, url: string } | null, secondaryLinks?: Array<{ __typename?: 'Link', label: string, url: string } | null> | null };

export type ToolResultFragment = { __typename?: 'Tool', id: string, title: string, excerpt?: string | null, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null };

export type ResourceCoverageCountryFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type ResourceCoverageCountryFacetQuery = { __typename?: 'Query', search?: { __typename?: 'ResourceSearchResult', facet?: { __typename?: 'ResourceFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type ResourceTopicsFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type ResourceTopicsFacetQuery = { __typename?: 'Query', search?: { __typename?: 'ResourceSearchResult', facet?: { __typename?: 'ResourceFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type ResourceResearcherCountryFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type ResourceResearcherCountryFacetQuery = { __typename?: 'Query', search?: { __typename?: 'ResourceSearchResult', facet?: { __typename?: 'ResourceFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type ResourceGbifProgrammeAcronymFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type ResourceGbifProgrammeAcronymFacetQuery = { __typename?: 'Query', search?: { __typename?: 'ResourceSearchResult', facet?: { __typename?: 'ResourceFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type ResourcePurposesFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type ResourcePurposesFacetQuery = { __typename?: 'Query', search?: { __typename?: 'ResourceSearchResult', facet?: { __typename?: 'ResourceFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type ResourceContractCountryFacetQueryVariables = Exact<{
  predicate?: InputMaybe<Predicate>;
}>;


export type ResourceContractCountryFacetQuery = { __typename?: 'Query', search?: { __typename?: 'ResourceSearchResult', facet?: { __typename?: 'ResourceFacet', field?: Array<{ __typename?: 'GenericFacetResult_string', count: number, name: string } | null> | null } | null } | null };

export type ResourceSearchQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
  contentType?: InputMaybe<Array<ContentType> | ContentType>;
}>;


export type ResourceSearchQuery = { __typename?: 'Query', resourceSearch?: { __typename?: 'ResourceSearchResult', documents: { __typename?: 'ResourceDocuments', from: number, size: number, total: any, results: Array<{ __typename: 'Article' } | { __typename: 'Composition' } | { __typename: 'DataUse', id: string, title: string, excerpt?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null } | { __typename: 'Document', id: string, title: string, excerpt?: string | null } | { __typename: 'GbifProject', id: string, title: string, excerpt?: string | null, createdAt: string, purposes?: Array<string> | null, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null, programme?: { __typename?: 'Programme', id: string, title: string } | null } | { __typename: 'Help' } | { __typename: 'Literature' } | { __typename: 'MeetingEvent', id: string, title: string, excerpt?: string | null, country?: string | null, location?: string | null, venue?: string | null, start: string, end?: string | null, gbifsAttendee?: string | null, allDayEvent?: boolean | null, primaryLink?: { __typename?: 'Link', url: string } | null } | { __typename: 'News', id: string, title: string, excerpt?: string | null, createdAt: string, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null } | { __typename: 'Notification' } | { __typename: 'Programme', id: string, title: string, excerpt?: string | null, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null } | { __typename: 'Tool', id: string, title: string, excerpt?: string | null, primaryImage?: { __typename?: 'AssetImage', file: { __typename?: 'ImageFile', url: string } } | null } | null> } } | null };

export type TaxonOccurrenceImagesQueryVariables = Exact<{
  imagePredicate?: InputMaybe<Predicate>;
}>;


export type TaxonOccurrenceImagesQuery = { __typename?: 'Query', images?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any, results: Array<{ __typename?: 'Occurrence', key?: number | null, stillImages?: Array<{ __typename?: 'MultimediaItem', identifier?: string | null }> | null } | null> } } | null };

export type TaxonTypeSpecimensQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  predicate?: InputMaybe<Predicate>;
}>;


export type TaxonTypeSpecimensQuery = { __typename?: 'Query', occurrenceSearch?: { __typename?: 'OccurrenceSearchResult', _meta?: any | null, documents: { __typename?: 'OccurrenceDocuments', from: number, size: number, total: any, results: Array<{ __typename?: 'Occurrence', key?: number | null, taxonKey?: string | null, scientificName?: string | null, typeStatus?: Array<string | null> | null, typifiedName?: string | null, catalogNumber?: string | null, recordedBy?: Array<string | null> | null, year?: number | null, country?: string | null, institutionCode?: string | null, collectionCode?: string | null, occurrenceID?: string | null, dataset?: { __typename?: 'Dataset', key: string, title?: string | null } | null, extensions?: { __typename?: 'OccurrenceExtensions', dnaDerivedData?: Array<any | null> | null } | null } | null> } } | null };

export type TaxonVernacularNamesQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaxonVernacularNamesQuery = { __typename?: 'Query', taxon?: { __typename?: 'Taxon', vernacularNames?: { __typename?: 'TaxonVernacularNameResult', endOfRecords: boolean, results: Array<{ __typename?: 'TaxonVernacularName', vernacularName: string, language?: string | null, sourceTaxonKey: number, source?: string | null, sourceTaxon?: { __typename?: 'Taxon', datasetKey?: string | null } | null } | null> } | null } | null };

export type TaxonKeyQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  predicate?: InputMaybe<Predicate>;
  imagePredicate?: InputMaybe<Predicate>;
}>;


export type TaxonKeyQuery = { __typename?: 'Query', taxon?: { __typename?: 'Taxon', key: number, scientificName?: string | null, kingdom?: string | null, formattedName?: string | null, rank?: Rank | null, taxonomicStatus?: string | null, publishedIn?: string | null, dataset?: { __typename?: 'Dataset', citation?: { __typename?: 'Citation', text: string, citationProvidedBySource?: boolean | null } | null } | null, vernacularCount?: { __typename?: 'TaxonVernacularNameResult', results: Array<{ __typename?: 'TaxonVernacularName', taxonKey: number } | null> } | null, parents?: Array<{ __typename?: 'Taxon', rank?: Rank | null, scientificName?: string | null, key: number }> | null, acceptedTaxon?: { __typename?: 'Taxon', key: number, formattedName?: string | null, scientificName?: string | null } | null, synonyms?: { __typename?: 'TaxonListResult', results: Array<{ __typename?: 'Taxon', key: number }> } | null } | null, imagesCount?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null, typesSpecimenCount?: { __typename?: 'OccurrenceSearchResult', documents: { __typename?: 'OccurrenceDocuments', total: any } } | null };

export type SlowTaxonQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type SlowTaxonQuery = { __typename?: 'Query', taxon?: { __typename?: 'Taxon', key: number, basionymKey?: number | null, vernacularNames?: { __typename?: 'TaxonVernacularNameResult', results: Array<{ __typename?: 'TaxonVernacularName', vernacularName: string, source?: string | null } | null> } | null, combinations?: Array<{ __typename?: 'Taxon', key: number, nameKey?: number | null, acceptedKey?: number | null, canonicalName?: string | null, authorship?: string | null, scientificName?: string | null, formattedName?: string | null, rank?: Rank | null, taxonomicStatus?: string | null, numDescendants?: number | null } | null> | null, synonyms?: { __typename?: 'TaxonListResult', limit: number, offset: number, endOfRecords: boolean, results: Array<{ __typename?: 'Taxon', key: number, nameKey?: number | null, acceptedKey?: number | null, canonicalName?: string | null, authorship?: string | null, scientificName?: string | null, formattedName?: string | null, rank?: Rank | null, taxonomicStatus?: string | null, numDescendants?: number | null }> } | null, wikiData?: { __typename?: 'WikiDataTaxonData', source?: { __typename?: 'WikiDataTaxonSourceItem', id: string, url: string } | null, identifiers?: Array<{ __typename?: 'WikiDataIdentifier', id: string, label?: any | null, description?: any | null, url: string } | null> | null } | null } | null };

export type TaxonRankFacetQueryVariables = Exact<{
  query?: InputMaybe<TaxonSearchInput>;
}>;


export type TaxonRankFacetQuery = { __typename?: 'Query', search: { __typename?: 'TaxonSearchResult', facet?: { __typename?: 'TaxonFacet', field?: Array<{ __typename?: 'TaxonFacetResult', name: string, count: number } | null> | null } | null } };

export type TaxonStatusFacetQueryVariables = Exact<{
  query?: InputMaybe<TaxonSearchInput>;
}>;


export type TaxonStatusFacetQuery = { __typename?: 'Query', search: { __typename?: 'TaxonSearchResult', facet?: { __typename?: 'TaxonFacet', field?: Array<{ __typename?: 'TaxonFacetResult', name: string, count: number } | null> | null } | null } };

export type TaxonSearchQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<TaxonSearchInput>;
}>;


export type TaxonSearchQuery = { __typename?: 'Query', taxonSearch: { __typename?: 'TaxonSearchResult', count: number, offset: number, endOfRecords: boolean, results: Array<{ __typename?: 'Taxon', key: number, nubKey?: number | null, scientificName?: string | null, formattedName?: string | null, kingdom?: string | null, phylum?: string | null, class?: string | null, order?: string | null, family?: string | null, genus?: string | null, species?: string | null, taxonomicStatus?: string | null, rank?: Rank | null, datasetKey?: string | null, accepted?: string | null, acceptedKey?: number | null, numDescendants?: number | null, dataset?: { __typename?: 'Dataset', title?: string | null } | null, vernacularNames?: { __typename?: 'TaxonVernacularNameResult', results: Array<{ __typename?: 'TaxonVernacularName', vernacularName: string, source?: string | null, sourceTaxonKey: number } | null> } | null } | null> } };

export type RootSearchQueryVariables = Exact<{
  datasetKey: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RootSearchQuery = { __typename?: 'Query', checklistRoots?: { __typename?: 'TaxonListResult', offset: number, endOfRecords: boolean, results: Array<{ __typename?: 'Taxon', key: number, nubKey?: number | null, scientificName?: string | null, formattedName?: string | null, kingdom?: string | null, phylum?: string | null, class?: string | null, order?: string | null, family?: string | null, genus?: string | null, species?: string | null, taxonomicStatus?: string | null, rank?: Rank | null, datasetKey?: string | null, accepted?: string | null, acceptedKey?: number | null, numDescendants?: number | null, dataset?: { __typename?: 'Dataset', title?: string | null } | null, vernacularNames?: { __typename?: 'TaxonVernacularNameResult', results: Array<{ __typename?: 'TaxonVernacularName', vernacularName: string, source?: string | null, sourceTaxonKey: number } | null> } | null }> } | null };

export type TaxonChildrenQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaxonChildrenQuery = { __typename?: 'Query', taxon?: { __typename?: 'Taxon', key: number, scientificName?: string | null, numDescendants?: number | null, children?: { __typename?: 'TaxonListResult', limit: number, endOfRecords: boolean, offset: number, results: Array<{ __typename?: 'Taxon', key: number, numDescendants?: number | null, scientificName?: string | null, formattedName?: string | null }> } | null } | null };

export type TaxonParentKeysQueryVariables = Exact<{
  key: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaxonParentKeysQuery = { __typename?: 'Query', taxon?: { __typename?: 'Taxon', key: number, parents?: Array<{ __typename?: 'Taxon', key: number, numDescendants?: number | null, scientificName?: string | null, formattedName?: string | null, children?: { __typename?: 'TaxonListResult', limit: number, endOfRecords: boolean, offset: number, results: Array<{ __typename?: 'Taxon', key: number, numDescendants?: number | null, scientificName?: string | null, formattedName?: string | null }> } | null }> | null } | null };

export type TaxonResultFragment = { __typename?: 'Taxon', key: number, nubKey?: number | null, scientificName?: string | null, formattedName?: string | null, kingdom?: string | null, phylum?: string | null, class?: string | null, order?: string | null, family?: string | null, genus?: string | null, taxonomicStatus?: string | null };

export const CollectionResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CollectionResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionSearchEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"institutionName"}},{"kind":"Field","name":{"kind":"Name","value":"institutionKey"}},{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"300"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"200"}}]},{"kind":"Field","name":{"kind":"Name","value":"featuredImageLicense"}},{"kind":"Field","name":{"kind":"Name","value":"descriptorMatches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"usageName"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"individualCount"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"identifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"taxon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kingdom"}},{"kind":"Field","name":{"kind":"Name","value":"phylum"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"genus"}},{"kind":"Field","name":{"kind":"Name","value":"species"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionResultFragment, unknown>;
export const DatasetStubResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetStubResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchStub"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<DatasetStubResultFragment, unknown>;
export const DatasetResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dataset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<DatasetResultFragment, unknown>;
export const InstitutionResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InstitutionResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InstitutionSearchEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"mailingCountry"}},{"kind":"Field","name":{"kind":"Name","value":"collectionCount"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"300"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"200"}}]},{"kind":"Field","name":{"kind":"Name","value":"featuredImageLicense"}}]}}]} as unknown as DocumentNode<InstitutionResultFragment, unknown>;
export const LiteratureResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LiteratureResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Literature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"literatureType"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"relevance"}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]} as unknown as DocumentNode<LiteratureResultFragment, unknown>;
export const ArticleBannerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<ArticleBannerFragment, unknown>;
export const NetworkAboutTabFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NetworkAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NetworkProse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<NetworkAboutTabFragment, unknown>;
export const RelatedOccurrenceStubFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RelatedOccurrenceStub"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RelatedOccurrenceStub"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceID"}},{"kind":"Field","name":{"kind":"Name","value":"catalogNumber"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrgKey"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrgName"}},{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}}]}}]} as unknown as DocumentNode<RelatedOccurrenceStubFragment, unknown>;
export const RelatedOccurrenceDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RelatedOccurrenceDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Occurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"basisOfRecord"}},{"kind":"Field","name":{"kind":"Name","value":"datasetTitle"}},{"kind":"Field","name":{"kind":"Name","value":"publisherTitle"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"soundCount"}},{"kind":"Field","name":{"kind":"Name","value":"stillImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"movingImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"formattedCoordinates"}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifClassification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"volatile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSequenced"}},{"kind":"Field","name":{"kind":"Name","value":"isSamplingEvent"}},{"kind":"Field","name":{"kind":"Name","value":"isTreament"}}]}}]}}]}}]} as unknown as DocumentNode<RelatedOccurrenceDetailsFragment, unknown>;
export const OccurrenceMediaDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OccurrenceMediaDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MultimediaItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"license"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"}},{"kind":"Field","name":{"kind":"Name","value":"references"}},{"kind":"Field","name":{"kind":"Name","value":"rightsHolder"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"800"}}]}]}}]} as unknown as DocumentNode<OccurrenceMediaDetailsFragment, unknown>;
export const OccurrenceTermFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OccurrenceTerm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Term"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"simpleName"}},{"kind":"Field","name":{"kind":"Name","value":"verbatim"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"htmlValue"}},{"kind":"Field","name":{"kind":"Name","value":"remarks"}},{"kind":"Field","name":{"kind":"Name","value":"issues"}}]}}]} as unknown as DocumentNode<OccurrenceTermFragment, unknown>;
export const PublisherResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PublisherResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]} as unknown as DocumentNode<PublisherResultFragment, unknown>;
export const DocumentPreviewFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<DocumentPreviewFragment, unknown>;
export const ArticlePageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticlePage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"audiences"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<ArticlePageFragment, unknown>;
export const HeaderBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<HeaderBlockDetailsFragment, unknown>;
export const ProseCardImgFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<ProseCardImgFragment, unknown>;
export const FeatureBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<FeatureBlockDetailsFragment, unknown>;
export const FeaturedTextBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}}]} as unknown as DocumentNode<FeaturedTextBlockDetailsFragment, unknown>;
export const MediaBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<MediaBlockDetailsFragment, unknown>;
export const MediaCountBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<MediaCountBlockDetailsFragment, unknown>;
export const CarouselBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<CarouselBlockDetailsFragment, unknown>;
export const CustomComponentBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}}]} as unknown as DocumentNode<CustomComponentBlockDetailsFragment, unknown>;
export const TextBlockDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}}]} as unknown as DocumentNode<TextBlockDetailsFragment, unknown>;
export const BlockItemDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlockItemDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlockItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"HeaderBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeatureBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeaturedTextBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CarouselBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomComponentBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextBlockDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}}]} as unknown as DocumentNode<BlockItemDetailsFragment, unknown>;
export const CompositionPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompositionPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"maybeTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BlockItemDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlockItemDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlockItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"HeaderBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeatureBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeaturedTextBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CarouselBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomComponentBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextBlockDetails"}}]}}]}}]} as unknown as DocumentNode<CompositionPageFragment, unknown>;
export const ResourceRedirectDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceRedirectDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"maybeTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ResourceRedirectDetailsFragment, unknown>;
export const DataUsePageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataUsePage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"resourceUsed"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countriesOfCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"audiences"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<DataUsePageFragment, unknown>;
export const ResultCardImageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResultCardImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"180"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"120"}}]}]}}]}}]} as unknown as DocumentNode<ResultCardImageFragment, unknown>;
export const DataUseResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataUseResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResultCardImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"180"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"120"}}]}]}}]}}]} as unknown as DocumentNode<DataUseResultFragment, unknown>;
export const DocumentPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}}]}}]} as unknown as DocumentNode<DocumentPageFragment, unknown>;
export const DocumentResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]} as unknown as DocumentNode<DocumentResultFragment, unknown>;
export const EventPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"eventLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"venue"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<EventPageFragment, unknown>;
export const EventResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"venue"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifsAttendee"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}}]}}]} as unknown as DocumentNode<EventResultFragment, unknown>;
export const NewsPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countriesOfCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"audiences"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<NewsPageFragment, unknown>;
export const NewsResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResultCardImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"180"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"120"}}]}]}}]}}]} as unknown as DocumentNode<NewsResultFragment, unknown>;
export const FundingOrganisationDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<FundingOrganisationDetailsFragment, unknown>;
export const ProgrammeFundingBannerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<ProgrammeFundingBannerFragment, unknown>;
export const ProgrammePageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammePage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BlockItemDetails"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeFundingBanner"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlockItemDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlockItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"HeaderBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeatureBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeaturedTextBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CarouselBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomComponentBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextBlockDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}}]} as unknown as DocumentNode<ProgrammePageFragment, unknown>;
export const ProgrammeResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResultCardImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"180"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"120"}}]}]}}]}}]} as unknown as DocumentNode<ProgrammeResultFragment, unknown>;
export const ProjectFundingBannerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeFundingBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}}]} as unknown as DocumentNode<ProjectFundingBannerFragment, unknown>;
export const ParticipantOrFundingOrganisationDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipantOrFundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Participant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ParticipantOrFundingOrganisationDetailsFragment, unknown>;
export const ProjectAboutTabFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"matchingFunds"}},{"kind":"Field","name":{"kind":"Name","value":"grantType"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"leadPartner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"additionalPartners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leadContact"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipantOrFundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Participant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectAboutTabFragment, unknown>;
export const ProjectPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFundingBanner"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectAboutTab"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipantOrFundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Participant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeFundingBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"matchingFunds"}},{"kind":"Field","name":{"kind":"Name","value":"grantType"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"leadPartner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"additionalPartners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leadContact"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}}]}}]} as unknown as DocumentNode<ProjectPageFragment, unknown>;
export const ProjectDatasetsTabFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectDatasetsTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"datasetsHelp"},"name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"StringValue","value":"how-to-link-datasets-to-my-project-page","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ProjectDatasetsTabFragment, unknown>;
export const ProjectResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResultCardImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"180"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"120"}}]}]}}]}}]} as unknown as DocumentNode<ProjectResultFragment, unknown>;
export const ToolPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ToolPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"rights"}},{"kind":"Field","name":{"kind":"Name","value":"rightsHolder"}},{"kind":"Field","name":{"kind":"Name","value":"publicationDate"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]} as unknown as DocumentNode<ToolPageFragment, unknown>;
export const ToolResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ToolResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResultCardImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"180"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"120"}}]}]}}]}}]} as unknown as DocumentNode<ToolResultFragment, unknown>;
export const TaxonResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxonResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Taxon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"nubKey"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"kingdom"}},{"kind":"Field","name":{"kind":"Name","value":"phylum"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"genus"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicStatus"}}]}}]} as unknown as DocumentNode<TaxonResultFragment, unknown>;
export const VocabularyConceptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"vocabularyConcept"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"vocabulary"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"concept"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"concept"},"name":{"kind":"Name","value":"vocabularyConcept"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"vocabulary"},"value":{"kind":"Variable","name":{"kind":"Name","value":"vocabulary"}}},{"kind":"Argument","name":{"kind":"Name","value":"concept"},"value":{"kind":"Variable","name":{"kind":"Name","value":"concept"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uiLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}]},{"kind":"Field","name":{"kind":"Name","value":"uiDefinition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}]},{"kind":"Field","name":{"kind":"Name","value":"parents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uiLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}]}]}}]}}]}}]} as unknown as DocumentNode<VocabularyConceptQuery, VocabularyConceptQueryVariables>;
export const GlobeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"globe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cLat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"cLon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lon"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"svg"}}]}}]}}]} as unknown as DocumentNode<GlobeQuery, GlobeQueryVariables>;
export const HelpTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HelpText"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}}]}}]}}]} as unknown as DocumentNode<HelpTextQuery, HelpTextQueryVariables>;
export const HelpTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HelpTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<HelpTitleQuery, HelpTitleQueryVariables>;
export const ParticipantSelectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParticipantSelect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NodeType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participationStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participantSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participationStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ParticipantSelectQuery, ParticipantSelectQueryVariables>;
export const HeaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Header"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifHome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalLink"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalLink"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalLink"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<HeaderQuery, HeaderQueryVariables>;
export const DescriptorGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DescriptorGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"descriptorGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DescriptorGroupsQuery, DescriptorGroupsQueryVariables>;
export const DescriptorGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DescriptorGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectionDescriptorGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"descriptors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"verbatim"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DescriptorGroupQuery, DescriptorGroupQueryVariables>;
export const CollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Collection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"geographicCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"temporalCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"incorporatedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"contentTypes"}},{"kind":"Field","name":{"kind":"Name","value":"personalCollection"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"catalogUrls"}},{"kind":"Field","name":{"kind":"Name","value":"apiUrls"}},{"kind":"Field","name":{"kind":"Name","value":"preservationTypes"}},{"kind":"Field","name":{"kind":"Name","value":"accessionStatus"}},{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"667"}}]},{"kind":"Field","name":{"kind":"Name","value":"featuredImageLicense"}},{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl_fallback"},"name":{"kind":"Name","value":"homepageOGImageUrl_volatile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"onlyIfNoImageUrl"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"timeoutMs"},"value":{"kind":"IntValue","value":"300"}}]},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"replacedByCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"institutionKey"}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactPersons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicExpertise"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"userIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"alternativeCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mailingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descriptorGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionQuery, CollectionQueryVariables>;
export const CollectionSummaryMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionSummaryMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardinality"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withImages"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withCoordinates"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withClusters"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionSummaryMetricsQuery, CollectionSummaryMetricsQueryVariables>;
export const CollectionFallbackImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionFallbackImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl_fallback"},"name":{"kind":"Name","value":"homepageOGImageUrl_volatile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"onlyIfNoImageUrl"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"timeoutMs"},"value":{"kind":"IntValue","value":"3000"}}]}]}}]}}]} as unknown as DocumentNode<CollectionFallbackImageQuery, CollectionFallbackImageQueryVariables>;
export const CollectionSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CollectionResult"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CollectionResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionSearchEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"institutionName"}},{"kind":"Field","name":{"kind":"Name","value":"institutionKey"}},{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"300"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"200"}}]},{"kind":"Field","name":{"kind":"Name","value":"featuredImageLicense"}},{"kind":"Field","name":{"kind":"Name","value":"descriptorMatches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"usageName"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"individualCount"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"identifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"taxon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kingdom"}},{"kind":"Field","name":{"kind":"Name","value":"phylum"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"genus"}},{"kind":"Field","name":{"kind":"Name","value":"species"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionSearchQuery, CollectionSearchQueryVariables>;
export const CollectionRecordedByFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionRecordedByFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"collectionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"recordedBy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CollectionRecordedByFacetQuery, CollectionRecordedByFacetQueryVariables>;
export const CollectionCityFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionCityFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"collectionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"city"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CollectionCityFacetQuery, CollectionCityFacetQueryVariables>;
export const CollectionContentTypeFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionContentTypeFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"collectionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"contentType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CollectionContentTypeFacetQuery, CollectionContentTypeFacetQueryVariables>;
export const CollectionPreservationTypeFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionPreservationTypeFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"collectionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"preservationType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CollectionPreservationTypeFacetQuery, CollectionPreservationTypeFacetQueryVariables>;
export const CollectionTypeStatusFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionTypeStatusFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"collectionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"typeStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CollectionTypeStatusFacetQuery, CollectionTypeStatusFacetQueryVariables>;
export const BecomeAPublisherPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BecomeAPublisherPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"alias"},"value":{"kind":"StringValue","value":"/become-a-publisher","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"audiences"}},{"kind":"Field","name":{"kind":"Name","value":"citation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<BecomeAPublisherPageQuery, BecomeAPublisherPageQueryVariables>;
export const DatasetInsightsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetInsights"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"datasetPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taxonPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"yearPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sitePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"siteOccurrences"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sitePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"unfiltered"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"datasetPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardinality"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dwcaExtension"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"images"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"stillImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"identifier"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withCoordinates"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withTaxonMatch"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taxonPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withYear"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"yearPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withEventId"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetInsightsQuery, DatasetInsightsQueryVariables>;
export const DatasetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dataset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gbifDatasetKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalTaxa"},"name":{"kind":"Name","value":"taxonSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasetKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"origin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"SOURCE"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"accepted"},"name":{"kind":"Name","value":"taxonSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasetKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"origin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"SOURCE"}]}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ACCEPTED"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"synonyms"},"name":{"kind":"Name","value":"taxonSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasetKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"origin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"SOURCE"}]}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"SYNONYM"},{"kind":"EnumValue","value":"HETEROTYPIC_SYNONYM"},{"kind":"EnumValue","value":"PROPARTE_SYNONYM"},{"kind":"EnumValue","value":"HOMOTYPIC_SYNONYM"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"checklistBankDataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"duplicateOfDataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colCoveragePct"}},{"kind":"Field","name":{"kind":"Name","value":"nubCoveragePct"}},{"kind":"Field","name":{"kind":"Name","value":"nubMatchingCount"}},{"kind":"Field","name":{"kind":"Name","value":"colMatchingCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"temporalCoverages"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationKey"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"additionalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"volatileContributors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"_highlighted"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactsCitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviatedName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}},{"kind":"Field","name":{"kind":"Name","value":"geographicCoverages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"boundingBox"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minLatitude"}},{"kind":"Field","name":{"kind":"Name","value":"maxLatitude"}},{"kind":"Field","name":{"kind":"Name","value":"minLongitude"}},{"kind":"Field","name":{"kind":"Name","value":"maxLongitude"}},{"kind":"Field","name":{"kind":"Name","value":"globalCoverage"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicCoverages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"coverages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"rank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interpreted"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"bibliographicCitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"samplingDescription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studyExtent"}},{"kind":"Field","name":{"kind":"Name","value":"sampling"}},{"kind":"Field","name":{"kind":"Name","value":"qualityControl"}},{"kind":"Field","name":{"kind":"Name","value":"methodSteps"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dataDescriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charset"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"formatVersion"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"citation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"license"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"studyAreaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"designDescription"}},{"kind":"Field","name":{"kind":"Name","value":"funding"}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"endpoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doi"}},{"kind":"Field","name":{"kind":"Name","value":"machineTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"namespace"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gridded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"percent"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetQuery, DatasetQueryVariables>;
export const DatasetOccurrenceSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetOccurrenceSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dynamicProperties"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withImages"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withCoordinates"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withClusters"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetOccurrenceSearchQuery, DatasetOccurrenceSearchQueryVariables>;
export const DatasetSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DatasetStubResult"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetStubResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchStub"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<DatasetSearchQuery, DatasetSearchQueryVariables>;
export const DatasetHostingFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetHostingFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"hostingOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","alias":{"kind":"Name","value":"item"},"name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<DatasetHostingFacetQuery, DatasetHostingFacetQueryVariables>;
export const DatasetProjectFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetProjectFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"projectId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DatasetProjectFacetQuery, DatasetProjectFacetQueryVariables>;
export const DatasetPublishingCountryFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetPublishingCountryFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"publishingCountry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DatasetPublishingCountryFacetQuery, DatasetPublishingCountryFacetQueryVariables>;
export const DatasetLicenceFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetLicenceFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"license"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DatasetLicenceFacetQuery, DatasetLicenceFacetQueryVariables>;
export const DatasetTypeFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetTypeFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DatasetTypeFacetQuery, DatasetTypeFacetQueryVariables>;
export const HomePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomePage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifHome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"datasetIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publisherIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"literatureIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BlockItemDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HeaderBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProseCardImg"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeatureBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Feature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProseCardImg"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeaturedTextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MediaCountBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"mediaTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","alias":{"kind":"Name","value":"optionalImg"},"name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reverse"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"titleCountPart"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"roundImage"}},{"kind":"Field","name":{"kind":"Name","value":"callToAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CarouselBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomComponentBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"componentType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextBlockDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"hideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColour"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlockItemDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlockItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"HeaderBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeatureBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeaturedTextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeaturedTextBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CarouselBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CarouselBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaCountBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MediaCountBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomComponentBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomComponentBlockDetails"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextBlockDetails"}}]}}]}}]} as unknown as DocumentNode<HomePageQuery, HomePageQueryVariables>;
export const InstallationDatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstallationDatasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"installation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"installation"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DatasetResult"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dataset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<InstallationDatasetsQuery, InstallationDatasetsQueryVariables>;
export const InstallationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Installation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"endpoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<InstallationQuery, InstallationQueryVariables>;
export const OrphanCollectionCodesForInstitutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"orphanCollectionCodesForInstitution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"orphaned"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardinality"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectionCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectionCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrphanCollectionCodesForInstitutionQuery, OrphanCollectionCodesForInstitutionQueryVariables>;
export const InstitutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Institution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"catalogUrls"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"types"}},{"kind":"Field","name":{"kind":"Name","value":"apiUrls"}},{"kind":"Field","name":{"kind":"Name","value":"institutionalGovernances"}},{"kind":"Field","name":{"kind":"Name","value":"disciplines"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"additionalNames"}},{"kind":"Field","name":{"kind":"Name","value":"foundingDate"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"667"}}]},{"kind":"Field","name":{"kind":"Name","value":"featuredImageLicense"}},{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl_fallback"},"name":{"kind":"Name","value":"homepageOGImageUrl_volatile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"onlyIfNoImageUrl"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"timeoutMs"},"value":{"kind":"IntValue","value":"300"}}]},{"kind":"Field","name":{"kind":"Name","value":"masterSourceMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"replacedByInstitution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contactPersons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicExpertise"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"userIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"mailingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collectionCount"}}]}}]}}]} as unknown as DocumentNode<InstitutionQuery, InstitutionQueryVariables>;
export const InstitutionSummaryMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstitutionSummaryMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"institution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"200"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"richness"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withImages"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withCoordinates"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinatePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withClusters"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clusterPredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<InstitutionSummaryMetricsQuery, InstitutionSummaryMetricsQueryVariables>;
export const InstitutionFallbackImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstitutionFallbackImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl_fallback"},"name":{"kind":"Name","value":"homepageOGImageUrl_volatile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"onlyIfNoImageUrl"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"timeoutMs"},"value":{"kind":"IntValue","value":"3000"}}]}]}}]}}]} as unknown as DocumentNode<InstitutionFallbackImageQuery, InstitutionFallbackImageQueryVariables>;
export const InstitutionCityFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstitutionCityFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InstitutionSearchInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"institutionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"city"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InstitutionCityFacetQuery, InstitutionCityFacetQueryVariables>;
export const InstitutionDisciplineFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstitutionDisciplineFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InstitutionSearchInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"institutionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"discipline"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InstitutionDisciplineFacetQuery, InstitutionDisciplineFacetQueryVariables>;
export const InstitutionTypeStatusFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstitutionTypeStatusFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InstitutionSearchInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"institutionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"type"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InstitutionTypeStatusFacetQuery, InstitutionTypeStatusFacetQueryVariables>;
export const InstitutionSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstitutionSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InstitutionSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institutionSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InstitutionResult"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InstitutionResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InstitutionSearchEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"mailingCountry"}},{"kind":"Field","name":{"kind":"Name","value":"collectionCount"}},{"kind":"Field","name":{"kind":"Name","value":"numberSpecimens"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","alias":{"kind":"Name","value":"featuredImageUrl"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"300"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"200"}}]},{"kind":"Field","name":{"kind":"Name","value":"featuredImageLicense"}}]}}]} as unknown as DocumentNode<InstitutionSearchQuery, InstitutionSearchQueryVariables>;
export const LiteratureCoverageCountryFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteratureCoverageCountryFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"countriesOfCoverage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteratureCoverageCountryFacetQuery, LiteratureCoverageCountryFacetQueryVariables>;
export const LiteratureRelevanceFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteratureRelevanceFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"relevance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteratureRelevanceFacetQuery, LiteratureRelevanceFacetQueryVariables>;
export const LiteratureTopicsFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteratureTopicsFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"topics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteratureTopicsFacetQuery, LiteratureTopicsFacetQueryVariables>;
export const LiteratureOpenAccessFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteratureOpenAccessFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"openAccess"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteratureOpenAccessFacetQuery, LiteratureOpenAccessFacetQueryVariables>;
export const LiteraturePeerReviewFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteraturePeerReviewFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"peerReview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteraturePeerReviewFacetQuery, LiteraturePeerReviewFacetQueryVariables>;
export const LiteraturePublisherFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteraturePublisherFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"publisher"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteraturePublisherFacetQuery, LiteraturePublisherFacetQueryVariables>;
export const LiteratureSourceFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteratureSourceFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"source"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteratureSourceFacetQuery, LiteratureSourceFacetQueryVariables>;
export const LiteratureGbifProgrammeAcronymFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteratureGbifProgrammeAcronymFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"gbifProgrammeAcronym"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteratureGbifProgrammeAcronymFacetQuery, LiteratureGbifProgrammeAcronymFacetQueryVariables>;
export const LiteratureListSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteratureListSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}},{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"countriesOfResearcher"}},{"kind":"Field","name":{"kind":"Name","value":"countriesOfCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"doi"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteratureListSearchQuery, LiteratureListSearchQueryVariables>;
export const LiteratureTableSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiteratureTableSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countriesOfCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"countriesOfResearcher"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"gbifRegion"}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"doi"}}]}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"literatureType"}},{"kind":"Field","name":{"kind":"Name","value":"openAccess"}},{"kind":"Field","name":{"kind":"Name","value":"peerReview"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"}},{"kind":"Field","name":{"kind":"Name","value":"relevance"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"topics"}},{"kind":"Field","name":{"kind":"Name","value":"websites"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LiteratureTableSearchQuery, LiteratureTableSearchQueryVariables>;
export const NetworkDatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NetworkDatasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"network"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"network"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"constituents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DatasetResult"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dataset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<NetworkDatasetsQuery, NetworkDatasetsQueryVariables>;
export const NetworkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Network"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"prose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NetworkAboutTab"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numConstituents"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gbifNetworkKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NetworkAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NetworkProse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<NetworkQuery, NetworkQueryVariables>;
export const NetworkPublishersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NetworkPublishers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"network"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"network"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<NetworkPublishersQuery, NetworkPublishersQueryVariables>;
export const DownloadKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DownloadKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"download"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"doi"}},{"kind":"Field","name":{"kind":"Name","value":"downloadLink"}},{"kind":"Field","name":{"kind":"Name","value":"eraseAfter"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"license"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"numberDatasets"}},{"kind":"Field","name":{"kind":"Name","value":"numberOrganizations"}},{"kind":"Field","name":{"kind":"Name","value":"numberPublishingCountries"}},{"kind":"Field","name":{"kind":"Name","value":"request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","alias":{"kind":"Name","value":"sql"},"name":{"kind":"Name","value":"sqlFormatted"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"gbifMachineDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"datasetsByDownload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"datasetTitle"}},{"kind":"Field","name":{"kind":"Name","value":"numberRecords"}}]}}]}}]}}]} as unknown as DocumentNode<DownloadKeyQuery, DownloadKeyQueryVariables>;
export const SlowDownloadKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SlowDownloadKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gbifDownloadKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<SlowDownloadKeyQuery, SlowDownloadKeyQueryVariables>;
export const DownloadKeyDatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DownloadKeyDatasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetsByDownload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"datasetTitle"}},{"kind":"Field","name":{"kind":"Name","value":"numberRecords"}}]}}]}}]}}]} as unknown as DocumentNode<DownloadKeyDatasetsQuery, DownloadKeyDatasetsQueryVariables>;
export const PersonKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"deathDate"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<PersonKeyQuery, PersonKeyQueryVariables>;
export const OccurrenceClusterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceCluster"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"related"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentOccurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stub"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedOccurrenceStub"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedOccurrenceDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedOccurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reasons"}},{"kind":"Field","name":{"kind":"Name","value":"stub"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedOccurrenceStub"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedOccurrenceDetails"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RelatedOccurrenceStub"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RelatedOccurrenceStub"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceID"}},{"kind":"Field","name":{"kind":"Name","value":"catalogNumber"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrgKey"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrgName"}},{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RelatedOccurrenceDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Occurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"basisOfRecord"}},{"kind":"Field","name":{"kind":"Name","value":"datasetTitle"}},{"kind":"Field","name":{"kind":"Name","value":"publisherTitle"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"soundCount"}},{"kind":"Field","name":{"kind":"Name","value":"stillImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"movingImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"formattedCoordinates"}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifClassification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"volatile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSequenced"}},{"kind":"Field","name":{"kind":"Name","value":"isSamplingEvent"}},{"kind":"Field","name":{"kind":"Name","value":"isTreament"}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceClusterQuery, OccurrenceClusterQueryVariables>;
export const OccurrenceExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode<OccurrenceExistsQuery, OccurrenceExistsQueryVariables>;
export const OccurrenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Occurrence"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"organismName"}},{"kind":"Field","name":{"kind":"Name","value":"lastCrawled"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"stateProvince"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"references"}},{"kind":"Field","name":{"kind":"Name","value":"issues"}},{"kind":"Field","name":{"kind":"Name","value":"basisOfRecord"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicProperties"}},{"kind":"Field","name":{"kind":"Name","value":"institutionKey"}},{"kind":"Field","name":{"kind":"Name","value":"collectionKey"}},{"kind":"Field","name":{"kind":"Name","value":"isInCluster"}},{"kind":"Field","name":{"kind":"Name","value":"volatile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sphere"},"value":{"kind":"BooleanValue","value":false}},{"kind":"Argument","name":{"kind":"Name","value":"land"},"value":{"kind":"BooleanValue","value":false}},{"kind":"Argument","name":{"kind":"Name","value":"graticule"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"svg"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSpecimen"}},{"kind":"Field","name":{"kind":"Name","value":"isTreament"}},{"kind":"Field","name":{"kind":"Name","value":"isSequenced"}},{"kind":"Field","name":{"kind":"Name","value":"isClustered"}},{"kind":"Field","name":{"kind":"Name","value":"isSamplingEvent"}},{"kind":"Field","name":{"kind":"Name","value":"firstIIIF"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"datasetTitle"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrgKey"}},{"kind":"Field","name":{"kind":"Name","value":"publisherTitle"}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"citation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"institutionCode"}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"audubon"}},{"kind":"Field","name":{"kind":"Name","value":"amplification"}},{"kind":"Field","name":{"kind":"Name","value":"germplasmAccession"}},{"kind":"Field","name":{"kind":"Name","value":"germplasmMeasurementScore"}},{"kind":"Field","name":{"kind":"Name","value":"germplasmMeasurementTrait"}},{"kind":"Field","name":{"kind":"Name","value":"germplasmMeasurementTrial"}},{"kind":"Field","name":{"kind":"Name","value":"identification"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"measurementOrFact"}},{"kind":"Field","name":{"kind":"Name","value":"multimedia"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"eolReference"}},{"kind":"Field","name":{"kind":"Name","value":"resourceRelationship"}},{"kind":"Field","name":{"kind":"Name","value":"cloning"}},{"kind":"Field","name":{"kind":"Name","value":"gelImage"}},{"kind":"Field","name":{"kind":"Name","value":"loan"}},{"kind":"Field","name":{"kind":"Name","value":"materialSample"}},{"kind":"Field","name":{"kind":"Name","value":"permit"}},{"kind":"Field","name":{"kind":"Name","value":"preparation"}},{"kind":"Field","name":{"kind":"Name","value":"preservation"}},{"kind":"Field","name":{"kind":"Name","value":"extendedMeasurementOrFact"}},{"kind":"Field","name":{"kind":"Name","value":"chronometricAge"}},{"kind":"Field","name":{"kind":"Name","value":"dnaDerivedData"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gadm"}},{"kind":"Field","name":{"kind":"Name","value":"stillImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"movingImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"soundCount"}},{"kind":"Field","name":{"kind":"Name","value":"stillImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OccurrenceMediaDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OccurrenceMediaDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"movingImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OccurrenceMediaDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifClassification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kingdom"}},{"kind":"Field","name":{"kind":"Name","value":"kingdomKey"}},{"kind":"Field","name":{"kind":"Name","value":"phylum"}},{"kind":"Field","name":{"kind":"Name","value":"phylumKey"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"classKey"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"orderKey"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"familyKey"}},{"kind":"Field","name":{"kind":"Name","value":"genus"}},{"kind":"Field","name":{"kind":"Name","value":"genusKey"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"speciesKey"}},{"kind":"Field","name":{"kind":"Name","value":"synonym"}},{"kind":"Field","name":{"kind":"Name","value":"classification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"acceptedUsage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"terms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OccurrenceTerm"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByIDs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identifiedByIDs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OccurrenceMediaDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MultimediaItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"license"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"}},{"kind":"Field","name":{"kind":"Name","value":"references"}},{"kind":"Field","name":{"kind":"Name","value":"rightsHolder"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"800"}}]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OccurrenceTerm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Term"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"simpleName"}},{"kind":"Field","name":{"kind":"Name","value":"verbatim"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"htmlValue"}},{"kind":"Field","name":{"kind":"Name","value":"remarks"}},{"kind":"Field","name":{"kind":"Name","value":"issues"}}]}}]} as unknown as DocumentNode<OccurrenceQuery, OccurrenceQueryVariables>;
export const SlowOccurrenceKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SlowOccurrenceKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"source"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrence"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"acceptedTaxon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vernacularNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}},{"kind":"Argument","name":{"kind":"Name","value":"source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"source"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vernacularName"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gbifOccurrenceKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"literatureType"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"doi"}}]}},{"kind":"Field","name":{"kind":"Name","value":"websites"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SlowOccurrenceKeyQuery, SlowOccurrenceKeyQueryVariables>;
export const OccurrenceIsInClusterFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceIsInClusterFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"isInCluster"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceIsInClusterFacetQuery, OccurrenceIsInClusterFacetQueryVariables>;
export const OccurrenceisSequencedFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceisSequencedFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"isSequenced"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceisSequencedFacetQuery, OccurrenceisSequencedFacetQueryVariables>;
export const OccurrenceLicenseFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceLicenseFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"license"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceLicenseFacetQuery, OccurrenceLicenseFacetQueryVariables>;
export const OccurrenceBoRFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceBoRFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"basisOfRecord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceBoRFacetQuery, OccurrenceBoRFacetQueryVariables>;
export const OccurrenceMediaFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceMediaFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"mediaType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceMediaFacetQuery, OccurrenceMediaFacetQueryVariables>;
export const OccurrenceMonthFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceMonthFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"month"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"12"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceMonthFacetQuery, OccurrenceMonthFacetQueryVariables>;
export const OccurrenceContinentFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceContinentFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"continent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceContinentFacetQuery, OccurrenceContinentFacetQueryVariables>;
export const OccurrenceProtocolFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceProtocolFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"protocol"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceProtocolFacetQuery, OccurrenceProtocolFacetQueryVariables>;
export const OccurrenceDwcaExtensionFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceDwcaExtensionFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"dwcaExtension"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceDwcaExtensionFacetQuery, OccurrenceDwcaExtensionFacetQueryVariables>;
export const OccurrenceIucnFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceIucnFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"iucnRedListCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceIucnFacetQuery, OccurrenceIucnFacetQueryVariables>;
export const OccurrenceTypeStatusFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceTypeStatusFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"typeStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceTypeStatusFacetQuery, OccurrenceTypeStatusFacetQueryVariables>;
export const OccurrenceIssueFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceIssueFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"issue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceIssueFacetQuery, OccurrenceIssueFacetQueryVariables>;
export const OccurrenceOccurrenceStatusFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceOccurrenceStatusFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"occurrenceStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceOccurrenceStatusFacetQuery, OccurrenceOccurrenceStatusFacetQueryVariables>;
export const OccurrenceProjectIdFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceProjectIdFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"projectId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceProjectIdFacetQuery, OccurrenceProjectIdFacetQueryVariables>;
export const OccurrenceOrganismIdFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceOrganismIdFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"organismId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceOrganismIdFacetQuery, OccurrenceOrganismIdFacetQueryVariables>;
export const OccurrencehigherGeographyFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrencehigherGeographyFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"higherGeography"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrencehigherGeographyFacetQuery, OccurrencehigherGeographyFacetQueryVariables>;
export const OccurrenceMediaSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"occurrenceMediaSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}},{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"basisOfRecord"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"gbifClassification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"identifier"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"formattedCoordinates"}},{"kind":"Field","name":{"kind":"Name","value":"volatile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSpecimen"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceMediaSearchQuery, OccurrenceMediaSearchQueryVariables>;
export const OccurrenceSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccurrenceSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"taxonKey"}},{"kind":"Field","name":{"kind":"Name","value":"hasTaxonIssues"}},{"kind":"Field","name":{"kind":"Name","value":"gbifClassification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verbatimScientificName"}},{"kind":"Field","name":{"kind":"Name","value":"usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"formattedCoordinates"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"basisOfRecord"}},{"kind":"Field","name":{"kind":"Name","value":"datasetTitle"}},{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrgKey"}},{"kind":"Field","name":{"kind":"Name","value":"publisherTitle"}},{"kind":"Field","name":{"kind":"Name","value":"catalogNumber"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"identifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"recordNumber"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"preparations"}},{"kind":"Field","name":{"kind":"Name","value":"collectionCode"}},{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"higherGeography"}},{"kind":"Field","name":{"kind":"Name","value":"stateProvince"}},{"kind":"Field","name":{"kind":"Name","value":"establishmentMeans"}},{"kind":"Field","name":{"kind":"Name","value":"iucnRedListCategory"}},{"kind":"Field","name":{"kind":"Name","value":"datasetName"}},{"kind":"Field","name":{"kind":"Name","value":"stillImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"movingImageCount"}},{"kind":"Field","name":{"kind":"Name","value":"soundCount"}},{"kind":"Field","name":{"kind":"Name","value":"issues"}},{"kind":"Field","name":{"kind":"Name","value":"volatile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSequenced"}},{"kind":"Field","name":{"kind":"Name","value":"isTreament"}},{"kind":"Field","name":{"kind":"Name","value":"isClustered"}},{"kind":"Field","name":{"kind":"Name","value":"isSamplingEvent"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<OccurrenceSearchQuery, OccurrenceSearchQueryVariables>;
export const PublisherCountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublisherCounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jsonKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"equals"}},{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"publishingOrg","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jsonKey"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"hostedDatasets"},"name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hostingOrg"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"publishingOrganizationKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<PublisherCountsQuery, PublisherCountsQueryVariables>;
export const PublisherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Publisher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"publisher"},"name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"numPublishedDatasets"}},{"kind":"Field","alias":{"kind":"Name","value":"logoUrl"},"name":{"kind":"Name","value":"thumborLogoUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"fitIn"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"endorsingNode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"participant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"endorsingNodeKey"}},{"kind":"Field","name":{"kind":"Name","value":"endorsementApproved"}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<PublisherQuery, PublisherQueryVariables>;
export const PublisherStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublisherStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jsonKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"equals"}},{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"publishingOrg","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jsonKey"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"hostedDatasets"},"name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hostingOrg"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"literatureSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"publishingOrganizationKey"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"key"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<PublisherStatsQuery, PublisherStatsQueryVariables>;
export const PublisherSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublisherSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Country"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isEndorsed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"list"},"name":{"kind":"Name","value":"organizationSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"isEndorsed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isEndorsed"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]}}]}}]} as unknown as DocumentNode<PublisherSearchQuery, PublisherSearchQueryVariables>;
export const AliasHandlingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AliasHandling"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"alias"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"alias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"alias"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResourceRedirectDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceRedirectDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"maybeTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<AliasHandlingQuery, AliasHandlingQueryVariables>;
export const OrganizationPreviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationPreview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<OrganizationPreviewQuery, OrganizationPreviewQueryVariables>;
export const TaiwanNodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaiwanNode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodeSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifierType"},"value":{"kind":"EnumValue","value":"GBIF_PARTICIPANT"}},{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"participantTitle"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<TaiwanNodeQuery, TaiwanNodeQueryVariables>;
export const NodeCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NodeCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodeCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"countryCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"participantTitle"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<NodeCountryQuery, NodeCountryQueryVariables>;
export const NonCountryNodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NonCountryNode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodeSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifierType"},"value":{"kind":"EnumValue","value":"GBIF_PARTICIPANT"}},{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"participantTitle"}}]}}]}}]}}]} as unknown as DocumentNode<NonCountryNodeQuery, NonCountryNodeQueryVariables>;
export const ParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participantSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"COUNTRY"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}}]}}]}}]}}]} as unknown as DocumentNode<ParticipantsQuery, ParticipantsQueryVariables>;
export const ProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Project"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResourceRedirectDetails"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectPage"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectDatasetsTab"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFundingBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeFundingBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingOrganisationDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipantOrFundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FundingOrganisation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Participant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticleBanner"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"normal"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"1200"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"500"}}]},{"kind":"Field","alias":{"kind":"Name","value":"mobile"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"800"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentPreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"volatile_documentType"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectAboutTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"matchingFunds"}},{"kind":"Field","name":{"kind":"Name","value":"grantType"}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}},{"kind":"Field","name":{"kind":"Name","value":"leadPartner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"additionalPartners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leadContact"}},{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fundingOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"overrideProgrammeFunding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipantOrFundingOrganisationDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArticleBanner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentPreview"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceRedirectDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Composition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"maybeTitle"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlAlias"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"fundsAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFundingBanner"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectAboutTab"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectDatasetsTab"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"datasetsHelp"},"name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"StringValue","value":"how-to-link-datasets-to-my-project-page","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ProjectQuery, ProjectQueryVariables>;
export const ProjectDatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectDatasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"500"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DatasetStubResult"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetStubResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetSearchStub"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publishingOrganizationTitle"}}]}}]} as unknown as DocumentNode<ProjectDatasetsQuery, ProjectDatasetsQueryVariables>;
export const ProjectNewsAndEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectNewsAndEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gbifProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"news"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"NewsResult"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventResult"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"help"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"StringValue","value":"how-to-add-events-to-my-project-page","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResultCardImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"180"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"120"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"venue"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifsAttendee"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}}]}}]} as unknown as DocumentNode<ProjectNewsAndEventsQuery, ProjectNewsAndEventsQueryVariables>;
export const ResourceRedirectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResourceRedirect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<ResourceRedirectQuery, ResourceRedirectQueryVariables>;
export const ResourceCoverageCountryFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResourceCoverageCountryFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"resourceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"countriesOfCoverage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ResourceCoverageCountryFacetQuery, ResourceCoverageCountryFacetQueryVariables>;
export const ResourceTopicsFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResourceTopicsFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"resourceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"topics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ResourceTopicsFacetQuery, ResourceTopicsFacetQueryVariables>;
export const ResourceResearcherCountryFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResourceResearcherCountryFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"resourceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"countriesOfResearcher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ResourceResearcherCountryFacetQuery, ResourceResearcherCountryFacetQueryVariables>;
export const ResourceGbifProgrammeAcronymFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResourceGbifProgrammeAcronymFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"resourceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"gbifProgrammeAcronym"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ResourceGbifProgrammeAcronymFacetQuery, ResourceGbifProgrammeAcronymFacetQueryVariables>;
export const ResourcePurposesFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResourcePurposesFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"resourceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"purposes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ResourcePurposesFacetQuery, ResourcePurposesFacetQueryVariables>;
export const ResourceContractCountryFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResourceContractCountryFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"resourceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"contractCountry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ResourceContractCountryFacetQuery, ResourceContractCountryFacetQueryVariables>;
export const ResourceSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResourceSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContentType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resourceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}},{"kind":"Argument","name":{"kind":"Name","value":"contentType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NewsResult"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataUseResult"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventResult"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectResult"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgrammeResult"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ToolResult"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentResult"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResultCardImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"url"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"180"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"120"}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewsResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataUseResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DataUse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"venue"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"primaryLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gbifsAttendee"}},{"kind":"Field","name":{"kind":"Name","value":"allDayEvent"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GbifProject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"programme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"purposes"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgrammeResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Programme"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ToolResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"primaryImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResultCardImage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}}]}}]} as unknown as DocumentNode<ResourceSearchQuery, ResourceSearchQueryVariables>;
export const TaxonOccurrenceImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonOccurrenceImages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"images"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"25"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"stillImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"identifier"},"name":{"kind":"Name","value":"thumbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"400"}}]}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaxonOccurrenceImagesQuery, TaxonOccurrenceImagesQueryVariables>;
export const TaxonTypeSpecimensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonTypeSpecimens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_meta"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"taxonKey"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"typeStatus"}},{"kind":"Field","name":{"kind":"Name","value":"typifiedName"}},{"kind":"Field","name":{"kind":"Name","value":"catalogNumber"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"institutionCode"}},{"kind":"Field","name":{"kind":"Name","value":"collectionCode"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceID"}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dnaDerivedData"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaxonTypeSpecimensQuery, TaxonTypeSpecimensQueryVariables>;
export const TaxonVernacularNamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonVernacularNames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vernacularNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vernacularName"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTaxonKey"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTaxon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaxonVernacularNamesQuery, TaxonVernacularNamesQueryVariables>;
export const TaxonKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"kingdom"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicStatus"}},{"kind":"Field","name":{"kind":"Name","value":"publishedIn"}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"citation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"citationProvidedBySource"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"vernacularCount"},"name":{"kind":"Name","value":"vernacularNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxonKey"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"parents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"acceptedTaxon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"synonyms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"imagesCount"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imagePredicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"typesSpecimenCount"},"name":{"kind":"Name","value":"occurrenceSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"predicate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"predicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<TaxonKeyQuery, TaxonKeyQueryVariables>;
export const SlowTaxonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SlowTaxon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"basionymKey"}},{"kind":"Field","name":{"kind":"Name","value":"vernacularNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vernacularName"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"combinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"nameKey"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedKey"}},{"kind":"Field","name":{"kind":"Name","value":"canonicalName"}},{"kind":"Field","name":{"kind":"Name","value":"authorship"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicStatus"}},{"kind":"Field","name":{"kind":"Name","value":"numDescendants"}}]}},{"kind":"Field","name":{"kind":"Name","value":"synonyms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"nameKey"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedKey"}},{"kind":"Field","name":{"kind":"Name","value":"canonicalName"}},{"kind":"Field","name":{"kind":"Name","value":"authorship"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicStatus"}},{"kind":"Field","name":{"kind":"Name","value":"numDescendants"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"wikiData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SlowTaxonQuery, SlowTaxonQueryVariables>;
export const TaxonRankFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonRankFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaxonSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"taxonSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"rank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaxonRankFacetQuery, TaxonRankFacetQueryVariables>;
export const TaxonStatusFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonStatusFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaxonSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"search"},"name":{"kind":"Name","value":"taxonSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"field"},"name":{"kind":"Name","value":"status"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaxonStatusFacetQuery, TaxonStatusFacetQueryVariables>;
export const TaxonSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaxonSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxonSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"nubKey"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"kingdom"}},{"kind":"Field","name":{"kind":"Name","value":"phylum"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"genus"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicStatus"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedKey"}},{"kind":"Field","name":{"kind":"Name","value":"numDescendants"}},{"kind":"Field","name":{"kind":"Name","value":"vernacularNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"2"}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"StringValue","value":"eng","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vernacularName"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTaxonKey"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaxonSearchQuery, TaxonSearchQueryVariables>;
export const RootSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"datasetKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checklistRoots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasetKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"datasetKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"nubKey"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"kingdom"}},{"kind":"Field","name":{"kind":"Name","value":"phylum"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"genus"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"taxonomicStatus"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"datasetKey"}},{"kind":"Field","name":{"kind":"Name","value":"dataset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedKey"}},{"kind":"Field","name":{"kind":"Name","value":"numDescendants"}},{"kind":"Field","name":{"kind":"Name","value":"vernacularNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"2"}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"StringValue","value":"eng","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vernacularName"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTaxonKey"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RootSearchQuery, RootSearchQueryVariables>;
export const TaxonChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"numDescendants"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"numDescendants"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]}]}}]}}]}}]}}]} as unknown as DocumentNode<TaxonChildrenQuery, TaxonChildrenQueryVariables>;
export const TaxonParentKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaxonParentKeys"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"parents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"numDescendants"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]},{"kind":"Field","name":{"kind":"Name","value":"children"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"numDescendants"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"formattedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useFallback"},"value":{"kind":"BooleanValue","value":true}}]}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaxonParentKeysQuery, TaxonParentKeysQueryVariables>;