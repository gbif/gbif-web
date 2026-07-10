import {
  AnimaliaIcon,
  ArchaeaIcon,
  BacteriaIcon,
  ChromistaIcon,
  FungiKingdomIcon,
  PlantaeIcon,
  ProtozoaIcon,
  VirusesIcon,
} from '@/components/icons/icons';

export const MAX_ROWS = 6000;
export const BATCH_SIZE = 10;
export const PAGE_SIZE = 20;

export const KINGDOMS = [
  { value: 'animalia', label: 'Animalia', icon: AnimaliaIcon },
  { value: 'plantae', label: 'Plantae', icon: PlantaeIcon },
  { value: 'fungi', label: 'Fungi', icon: FungiKingdomIcon },
  { value: 'chromista', label: 'Chromista', icon: ChromistaIcon },
  { value: 'bacteria', label: 'Bacteria', icon: BacteriaIcon },
  { value: 'protozoa', label: 'Protozoa', icon: ProtozoaIcon },
  { value: 'viruses', label: 'Viruses', icon: VirusesIcon },
  { value: 'archaea', label: 'Archaea', icon: ArchaeaIcon },
];

// `key` is the SpeciesRow field the column sorts on (and its cell renders from).
export const RESULT_COLUMNS: { key: string; id: string; defaultMessage: string }[] = [
  { key: 'occurrenceId', id: 'tools.speciesLookup.colId', defaultMessage: 'id' },
  {
    key: 'verbatimScientificName',
    id: 'tools.speciesLookup.colVerbatimScientificName',
    defaultMessage: 'verbatimScientificName',
  },
  {
    key: 'preferedKingdom',
    id: 'tools.speciesLookup.colPreferedKingdom',
    defaultMessage: 'preferedKingdom',
  },
  { key: 'matchType', id: 'tools.speciesLookup.colMatchType', defaultMessage: 'matchType' },
  { key: 'confidence', id: 'tools.speciesLookup.colConfidence', defaultMessage: 'confidence' },
  {
    key: 'scientificName',
    id: 'tools.speciesLookup.colScientificNameEditable',
    defaultMessage: 'scientificName (editable)',
  },
  { key: 'status', id: 'tools.speciesLookup.colStatus', defaultMessage: 'status' },
  { key: 'rank', id: 'tools.speciesLookup.colRank', defaultMessage: 'rank' },
  { key: 'kingdom', id: 'tools.speciesLookup.colKingdom', defaultMessage: 'kingdom' },
  { key: 'phylum', id: 'tools.speciesLookup.colPhylum', defaultMessage: 'phylum' },
  { key: 'class', id: 'tools.speciesLookup.colClass', defaultMessage: 'class' },
  { key: 'order', id: 'tools.speciesLookup.colOrder', defaultMessage: 'order' },
  { key: 'family', id: 'tools.speciesLookup.colFamily', defaultMessage: 'family' },
  { key: 'genus', id: 'tools.speciesLookup.colGenus', defaultMessage: 'genus' },
  { key: 'species', id: 'tools.speciesLookup.colSpecies', defaultMessage: 'species' },
  {
    key: 'classification',
    id: 'tools.speciesLookup.colClassification',
    defaultMessage: 'classification',
  },
  {
    key: 'canonicalName',
    id: 'tools.speciesLookup.colCanonicalName',
    defaultMessage: 'canonicalName',
  },
  { key: 'authorship', id: 'tools.speciesLookup.colAuthorship', defaultMessage: 'authorship' },
];

export const CSV_EXPORT_FIELDS = [
  'occurrenceId',
  'verbatimScientificName',
  'scientificName',
  'key',
  'matchType',
  'confidence',
  'status',
  'rank',
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
  'species',
  'canonicalName',
  'authorship',
  'classification',
  'usageKey',
  'acceptedUsageKey',
] as const;

export type ClassificationItem = {
  key: string;
  name: string;
  rank: string;
};

export type SuggestResult = {
  key: string;
  scientificName: string;
  canonicalName?: string;
  authorship?: string;
  rank: string;
  status: string;
  acceptedKey?: string;
  accepted?: string;
  group?: string;
  context?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  classification?: ClassificationItem[];
};

export type SpeciesRow = {
  verbatimScientificName: string;
  preferedKingdom?: string;
  occurrenceId?: string;
  scientificName?: string;
  canonicalName?: string;
  authorship?: string;
  key?: string;
  matchType?: string;
  confidence?: number;
  status?: string;
  rank?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  kingdomKey?: string;
  phylumKey?: string;
  classKey?: string;
  orderKey?: string;
  familyKey?: string;
  genusKey?: string;
  speciesKey?: string;
  usageKey?: string;
  acceptedUsageKey?: string;
  accepted?: string;
  acceptedKey?: string;
  classification?: ClassificationItem[];
  userEdited?: boolean;
  discarded?: boolean;
  alternatives?: SuggestResult[];
};

export type Phase = 'upload' | 'selectKingdom' | 'results';

export type SortDirection = 'asc' | 'desc';
