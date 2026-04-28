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

export const BACKBONE_DATASET_KEY = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';
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
  'usageKey',
  'acceptedUsageKey',
] as const;

export type SuggestResult = {
  key: number;
  scientificName: string;
  canonicalName: string;
  rank: string;
  status: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
};

export type SpeciesRow = {
  verbatimScientificName: string;
  preferedKingdom?: string;
  occurrenceId?: string;
  scientificName?: string;
  key?: number;
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
  kingdomKey?: number;
  phylumKey?: number;
  classKey?: number;
  orderKey?: number;
  familyKey?: number;
  genusKey?: number;
  speciesKey?: number;
  canonicalName?: string;
  authorship?: string;
  usageKey?: number;
  acceptedUsageKey?: number;
  accepted?: string;
  acceptedKey?: number;
  userEdited?: boolean;
  discarded?: boolean;
  alternatives?: SuggestResult[];
};

export type Phase = 'upload' | 'selectKingdom' | 'results';
