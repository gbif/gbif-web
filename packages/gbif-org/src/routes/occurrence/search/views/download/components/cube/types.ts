export interface CubeDimensions {
  spatialResolution: string;
  temporalResolution: string;
  taxonomicLevel: string;
  spatial: string;
  resolution: number | string;
  randomize: 'YES' | 'NO';
  includeTemporalUncertainty: 'YES' | 'NO';
  includeSpatialUncertainty: 'YES' | 'NO';
  selectedHigherTaxonomyGroups: string[];
  removeRecordsWithGeospatialIssues: boolean;
  removeRecordsTaxonIssues: boolean;
  removeRecordsAtCentroids: boolean;
  removeFossilsAndLiving: boolean;
  removeAbsenceRecords: boolean;
}

export interface CubeDimensionsSelectorProps {
  cube: CubeDimensions;
  onChange: (dimensions: CubeDimensions) => void;
  isExpanded: boolean;
  onToggle: () => void;
  filter?: any;
  predicate?: any;
  onValidationChange?: (isValid: boolean) => void;
}

export const TAXONOMIC_GROUPS = [
  'KINGDOM',
  'PHYLUM',
  'CLASS',
  'ORDER',
  'FAMILY',
  'GENUS',
  'SPECIES',
  'ACCEPTED_TAXON',
  'EXACT_TAXON',
] as const;

export const TEMPORAL_GROUPS = ['YEAR', 'YEARMONTH', 'DATE'] as const;

export const SPATIAL_GROUPS = [
  'EEA_REFERENCE_GRID',
  'EXTENDED_QUARTER_DEGREE_GRID',
  'ISEA3H_GRID',
  'MILITARY_GRID_REFERENCE_SYSTEM',
  'COUNTRY',
] as const;

export const HIGHER_TAXONOMIC_OPTIONS = [
  'KINGDOM',
  'PHYLUM',
  'CLASS',
  'ORDER',
  'FAMILY',
  'GENUS',
] as const;

export const RESOLUTION_OPTIONS: Record<string, number[]> = {
  EEA_REFERENCE_GRID: [25, 100, 250, 1000, 10000, 50000, 100000],
  EXTENDED_QUARTER_DEGREE_GRID: [0, 1, 2, 3, 4, 5, 6],
  ISEA3H_GRID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  MILITARY_GRID_REFERENCE_SYSTEM: [0, 1, 10, 100, 1000, 10000, 100000],
};

export const RESOLUTION_DEFAULTS: Record<string, number> = {
  EEA_REFERENCE_GRID: 1000,
  EXTENDED_QUARTER_DEGREE_GRID: 2,
  ISEA3H_GRID: 9,
  MILITARY_GRID_REFERENCE_SYSTEM: 1000,
};
