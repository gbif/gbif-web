export const MAX_SEQUENCES = 6000;
export const PAGE_SIZE = 20;
export const BATCH_SIZE = 25;
export const BATCH_CONCURRENCY = 2;
export const MAX_RETRIES = 3;
export const MAX_BATCH_ERRORS = 25;

export const DEFAULT_MARKER = 'COI';

export type MarkerOption = {
  value: string;
  marker: string;
  group: string;
  database: string;
};

// The reference database dropdown options. `value` is sent as-is in the request payload as `marker`.
export const MARKERS: MarkerOption[] = [
  {
    value: 'ITS',
    marker: 'ITS',
    group: 'Fungi and other Eukaryotes',
    database: 'UNITE general FASTA release for eukaryotes',
  },
  {
    value: 'COI',
    marker: 'COI',
    group: 'Animals',
    database: 'BOLD Public Database (99% clustered)',
  },
  {
    value: '16S',
    marker: '16S',
    group: 'Bacteria and Archaea',
    database: 'Genome Taxonomy Database',
  },
  { value: '18S', marker: '18S', group: 'Eukaryotes', database: 'PR2 database' },
  { value: '12S', marker: '12S', group: 'Fish', database: 'MitoFish' },
  { value: 'RBCL', marker: 'rbcL', group: 'Diatoms', database: 'Diat.barcode' },
  {
    value: '12s_mt12s_eukaryotes_midori2',
    marker: '12S',
    group: 'Eukaryotes',
    database: 'Midori2',
  },
  {
    value: '16s_mt16s_eukaryotes_midori2',
    marker: '16S',
    group: 'Eukaryotes',
    database: 'Midori2',
  },
  {
    value: 'cytb_eukaryotes_midori2',
    marker: 'Cytochrome b',
    group: 'Eukaryotes',
    database: 'Midori2',
  },
  { value: '12s_nbdl', marker: '12S', group: 'NBDL Australia', database: 'NBDL Australia' },
  { value: '16s_nbdl', marker: '16S', group: 'NBDL Australia', database: 'NBDL Australia' },
  { value: 'coi_nbdl', marker: 'COI', group: 'NBDL Australia', database: 'NBDL Australia' },
  {
    value: 'cytb_nbdl',
    marker: 'Cytochrome b',
    group: 'NBDL Australia',
    database: 'NBDL Australia',
  },
];

// One example sequence per common marker — used by the "Load test data" button.
// Default marker is COI so the example loads two real COI sequences.
export const SAMPLE_SEQUENCES_BY_MARKER: Record<string, string> = {
  COI: `>seq1
ATTGTCAGCAGGAATCGCACATGGAGGAGCATCAGTTGATCTGGCTATTTTTTCATTACACCTAGCAGGAATTTCATCAATTTTGGGGGCAGTAAATTTTATTACAACAGTAATTAATATGCGATCAACAGGGATTACTCTTGATCGAATACCTCTATTTGTATGATCAGTTGTTATTACTGCAATTCTTTTATTATTATCCCTC
>seq2
ATTATCTTCATATTTATTTCATTCATCACCATCTGTTGATATTGCAATTTTTTCTCTTCATATAACAGGAATTTCTTCTATTATTGGATCTTTAAATTTTATTGTTACAATTATATTAATAAAAAATTATTCTTTAAGTTATGATCAAATTAATTTATTTTCATGATCAGTTTGTATTACTGTAATTTTATTAATATTATCTTTA`,
};

export type SequenceInput = {
  occurrenceId: string;
  sequence: string;
};

export type ClassificationItem = {
  key: number;
  name: string;
  rank: string;
};

export type TaxonMatch = {
  synonym?: boolean;
  usage?: {
    key: number;
    name: string;
    rank?: string;
    formattedName?: string;
  };
  classification?: ClassificationItem[];
  diagnostics?: {
    matchType?: string;
    confidence?: number;
    status?: string;
  };
};

export type BlastMatch = {
  name?: string;
  identity?: number;
  appliedScientificName?: string;
  matchType?: string;
  bitScore?: number;
  expectValue?: number;
  querySequence?: string;
  subjectSequence?: string;
  qstart?: string;
  qend?: string;
  sstart?: string;
  send?: string;
  qcovs?: number;
  distanceToBestMatch?: number;
  accession?: string;
  taxonMatch?: TaxonMatch;
  /** True when the GBIF taxonomy lookup failed (network/server error). Absent when lookup succeeded (even with no match). */
  taxonMatchError?: boolean;
};

export type SequenceResult = {
  occurrenceId: string;
  sequence: string;
  marker: string;
  status: 'pending' | 'matched' | 'errored';
  match?: BlastMatch;
  error?: string;
};

export type Phase = 'upload' | 'results';
export type SortDirection = 'asc' | 'desc';

export const RESULT_COLUMNS: { key: string; id: string; defaultMessage: string }[] = [
  { key: 'occurrenceId', id: 'tools.sequenceId.colOccurrenceId', defaultMessage: 'occurrenceId' },
  { key: 'marker', id: 'tools.sequenceId.colMarker', defaultMessage: 'marker' },
  { key: 'identity', id: 'tools.sequenceId.colIdentity', defaultMessage: 'identity' },
  { key: 'bitScore', id: 'tools.sequenceId.colBitScore', defaultMessage: 'bitScore' },
  { key: 'expectValue', id: 'tools.sequenceId.colExpectValue', defaultMessage: 'expectValue' },
  {
    key: 'queryCoverage',
    id: 'tools.sequenceId.colQueryCoverage',
    defaultMessage: 'queryCoverage',
  },
  { key: 'queryLength', id: 'tools.sequenceId.colQueryLength', defaultMessage: 'queryLength' },
  { key: 'matchType', id: 'tools.sequenceId.colMatchType', defaultMessage: 'matchType' },
  {
    key: 'scientificName',
    id: 'tools.sequenceId.colScientificName',
    defaultMessage: 'scientificName',
  },
  { key: 'alignment', id: 'tools.sequenceId.colAlignment', defaultMessage: 'alignment' },
  {
    key: 'classification',
    id: 'tools.sequenceId.colClassification',
    defaultMessage: 'classification',
  },
  { key: 'sequence', id: 'tools.sequenceId.colSequence', defaultMessage: 'sequence' },
];

export const CSV_EXPORT_FIELDS = [
  'occurrenceId',
  'marker',
  'identity',
  'bitScore',
  'expectValue',
  'queryCoverage',
  'matchType',
  'scientificName',
  'classification',
  'sequence',
] as const;

// Sequence cell truncation length when collapsed.
export const SEQUENCE_PREVIEW_LENGTH = 50;
