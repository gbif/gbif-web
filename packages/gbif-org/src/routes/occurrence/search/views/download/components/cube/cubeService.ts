import { FilterType } from '@/contexts/filter';
import { CubeDimensions } from '@/routes/occurrence/search/views/download/components/CubeDimensionsSelector';

export interface CubeSqlGenerationOptions {
  taxonomy?: string;
  temporal?: string;
  spatial?: string;
  resolution?: number | string;
  randomize?: 'YES' | 'NO';
  higherGroups?: string[];
  includeTemporalUncertainty?: 'YES' | 'NO';
  includeSpatialUncertainty?: 'YES' | 'NO';
  predicate?: any;
  removeRecordsWithGeospatialIssues?: boolean;
  removeRecordsTaxonIssues?: boolean;
  removeRecordsAtCentroids?: boolean;
  removeFossilsAndLiving?: boolean;
  removeAbsenceRecords?: boolean;
}

export interface CubeSqlResponse {
  sql: string;
  machineDescription?: string;
  error?: string | null;
}

/**
 * Converts CubeDimensions to the format expected by the SQL generation API
 */
export function convertCubeDimensionsToSqlOptions(
  cube: CubeDimensions,
  predicate?: any
): CubeSqlGenerationOptions {
  const options: CubeSqlGenerationOptions = {
    taxonomy: cube.taxonomicLevel,
    temporal: cube.temporalResolution,
    spatial: cube.spatial,
    resolution: cube.resolution,
    randomize: cube.randomize,
    higherGroups: cube.selectedHigherTaxonomyGroups,
    includeTemporalUncertainty: cube.includeTemporalUncertainty,
    includeSpatialUncertainty: cube.includeSpatialUncertainty,
    predicate,
  };

  // Apply data quality filters
  const hasQualityFilter =
    cube.removeRecordsWithGeospatialIssues ||
    cube.removeRecordsTaxonIssues ||
    cube.removeRecordsAtCentroids ||
    cube.removeFossilsAndLiving ||
    cube.removeAbsenceRecords;

  if (hasQualityFilter) {
    const qualityPredicates: any[] = [];
    if (predicate) {
      qualityPredicates.push(predicate);
    }

    if (cube.removeRecordsWithGeospatialIssues) {
      qualityPredicates.push({
        type: 'equals',
        key: 'HAS_GEOSPATIAL_ISSUE',
        value: 'false',
      });
    }

    if (cube.removeRecordsTaxonIssues) {
      qualityPredicates.push({
        type: 'not',
        predicate: {
          type: 'in',
          key: 'TAXONOMIC_ISSUE',
          values: ['TAXON_MATCH_FUZZY'],
        },
      });
    }

    if (cube.removeRecordsAtCentroids) {
      qualityPredicates.push({
        type: 'equals',
        key: 'DISTANCE_FROM_CENTROID_IN_METERS',
        value: '2000,*',
      });
    }

    if (cube.removeFossilsAndLiving) {
      qualityPredicates.push({
        type: 'not',
        predicate: {
          type: 'in',
          key: 'BASIS_OF_RECORD',
          values: ['FOSSIL_SPECIMEN', 'LIVING_SPECIMEN'],
        },
      });
    }

    if (cube.removeAbsenceRecords) {
      qualityPredicates.push({
        type: 'equals',
        key: 'OCCURRENCE_STATUS',
        value: 'present',
      });
    }

    options.predicate = {
      type: 'and',
      predicates: qualityPredicates,
    };
  }

  return options;
}

/**
 * Generate SQL from cube dimensions
 */
export async function generateCubeSql(
  dimensions: CubeDimensions,
  predicate?: any
): Promise<CubeSqlResponse> {
  const options = convertCubeDimensionsToSqlOptions(dimensions, predicate);

  const response = await fetch('https://graphql.gbif.org/unstable-api/generate-sql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate SQL: ${response.statusText}`);
  }

  return response.json();
}

export function hasFilter(filter?: FilterType, field?: string): boolean {
  if (!filter || !field) return false;
  return Boolean(
    typeof filter.must?.[field]?.length !== 'undefined' ||
      typeof filter.mustNot?.[field]?.length !== 'undefined'
  );
}

export function hasAllFilters(filter?: FilterType, fields?: string[]): boolean {
  if (!filter || !fields) return false;
  return fields.every((field) => hasFilter(filter, field));
}
