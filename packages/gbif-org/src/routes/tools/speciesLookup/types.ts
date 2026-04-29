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
  'usageKey',
  'acceptedUsageKey',
] as const;

export type SuggestResult = {
  key: string;
  scientificName: string;
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
};

export type SpeciesRow = {
  verbatimScientificName: string;
  preferedKingdom?: string;
  occurrenceId?: string;
  scientificName?: string;
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
  userEdited?: boolean;
  discarded?: boolean;
  alternatives?: SuggestResult[];
};

export type Phase = 'upload' | 'selectKingdom' | 'results';
