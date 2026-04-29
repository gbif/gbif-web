export const MAX_NAMES = 6000;
export const PAGE_SIZE = 20;

export const SAMPLE_NAMES = [
  'Abies alba Mill.',
  'Ge Nicéville 1895',
  'Stagonospora polyspora M.T. Lucas & Sousa da Câmara 1934',
  'Arthopyrenia hyalospora (Nyl.) R.C. Harris comb. nov',
].join('\n');

export const CSV_EXPORT_FIELDS = [
  'scientificName',
  'type',
  'genusOrAbove',
  'specificEpithet',
  'infraSpecificEpithet',
  'authorship',
  'bracketAuthorship',
  'parsed',
  'authorsParsed',
  'canonicalName',
  'canonicalNameWithMarker',
  'canonicalNameComplete',
  'rankMarker',
] as const;

export const RESULT_COLUMNS: { key: string; id: string; defaultMessage: string }[] = [
  {
    key: 'scientificName',
    id: 'tools.nameParser.colScientificName',
    defaultMessage: 'scientificName',
  },
  { key: 'parsed', id: 'tools.nameParser.colParsed', defaultMessage: 'parsed' },
  { key: 'type', id: 'tools.nameParser.colType', defaultMessage: 'type' },
  {
    key: 'genusOrAbove',
    id: 'tools.nameParser.colGenusOrAbove',
    defaultMessage: 'genusOrAbove',
  },
  {
    key: 'specificEpithet',
    id: 'tools.nameParser.colSpecificEpithet',
    defaultMessage: 'specificEpithet',
  },
  {
    key: 'infraSpecificEpithet',
    id: 'tools.nameParser.colInfraSpecificEpithet',
    defaultMessage: 'infraSpecificEpithet',
  },
  { key: 'authorship', id: 'tools.nameParser.colAuthorship', defaultMessage: 'authorship' },
  {
    key: 'bracketAuthorship',
    id: 'tools.nameParser.colBracketAuthorship',
    defaultMessage: 'bracketAuthorship',
  },
  { key: 'sensu', id: 'tools.nameParser.colSensu', defaultMessage: 'sensu' },
  {
    key: 'canonicalName',
    id: 'tools.nameParser.colCanonicalName',
    defaultMessage: 'canonicalName',
  },
  {
    key: 'canonicalNameWithMarker',
    id: 'tools.nameParser.colCanonicalNameWithMarker',
    defaultMessage: 'canonicalNameWithMarker',
  },
  {
    key: 'canonicalNameComplete',
    id: 'tools.nameParser.colCanonicalNameComplete',
    defaultMessage: 'canonicalNameComplete',
  },
  { key: 'rankMarker', id: 'tools.nameParser.colRankMarker', defaultMessage: 'rankMarker' },
];

export type ParsedName = {
  scientificName?: string;
  parsed?: boolean;
  parsedPartially?: boolean;
  type?: string;
  genusOrAbove?: string;
  specificEpithet?: string;
  infraSpecificEpithet?: string;
  authorship?: string;
  bracketAuthorship?: string;
  bracketYear?: string;
  year?: string;
  sensu?: string;
  authorsParsed?: boolean;
  canonicalName?: string;
  canonicalNameWithMarker?: string;
  canonicalNameComplete?: string;
  rankMarker?: string;
};

export type Phase = 'upload' | 'results';

export type SortDirection = 'asc' | 'desc';
