import { BoundingBox } from '@/types';

/**
 * Below this overlap score (see getOverlapScore) the current viewport is
 * considered to have little/no meaningful overlap with the data, and we
 * suggest zooming to the data extent.
 */
export const LOW_OVERLAP_THRESHOLD = 0.15;

/**
 * The shape of the latitude/longitude stats returned from the GraphQL
 * occurrenceSearch.stats field. Only min/max are needed to build an extent.
 */
export type LatLngStats = {
  decimalLatitude?: { min?: number | null; max?: number | null } | null;
  decimalLongitude?: { min?: number | null; max?: number | null } | null;
} | null;

/**
 * Build a bounding box (EPSG:4326) from occurrence latitude/longitude stats.
 * Returns null if the stats are missing (e.g. when there are no results).
 */
export function statsToBoundingBox(stats?: LatLngStats): BoundingBox | null {
  const lat = stats?.decimalLatitude;
  const lng = stats?.decimalLongitude;
  if (
    !lat ||
    !lng ||
    lat.min == null ||
    lat.max == null ||
    lng.min == null ||
    lng.max == null
  ) {
    return null;
  }
  return {
    top: lat.max,
    bottom: lat.min,
    left: lng.min,
    right: lng.max,
  };
}

// Minimum span (in degrees) used to give a non-zero area to degenerate
// extents, such as a single point where min === max.
const MIN_SPAN = 0.0001;

function padBox(box: BoundingBox): BoundingBox {
  let { left, right, bottom, top } = box;
  if (right - left < MIN_SPAN) {
    const center = (left + right) / 2;
    left = center - MIN_SPAN / 2;
    right = center + MIN_SPAN / 2;
  }
  if (top - bottom < MIN_SPAN) {
    const center = (bottom + top) / 2;
    bottom = center - MIN_SPAN / 2;
    top = center + MIN_SPAN / 2;
  }
  return { left, right, bottom, top };
}

/**
 * Returns a value between 0 and 1 describing how well the data extent and the
 * current viewport overlap. The score is the larger of:
 *  - the fraction of the data extent that is visible in the viewport
 *  - the fraction of the viewport that is covered by the data extent
 *
 * Using the larger of the two avoids false suggestions when the entire data
 * set is already visible (large viewport, small data) or when the user is
 * zoomed into the data (small viewport inside a large data extent). A low
 * score therefore means the user is looking at an area with little/no data.
 */
export function getOverlapScore(viewport: BoundingBox, data: BoundingBox): number {
  const v = padBox(viewport);
  const d = padBox(data);

  const left = Math.max(v.left, d.left);
  const right = Math.min(v.right, d.right);
  const bottom = Math.max(v.bottom, d.bottom);
  const top = Math.min(v.top, d.top);

  const width = right - left;
  const height = top - bottom;
  if (width <= 0 || height <= 0) return 0;

  const intersection = width * height;
  const dataArea = (d.right - d.left) * (d.top - d.bottom);
  const viewportArea = (v.right - v.left) * (v.top - v.bottom);

  return Math.max(intersection / dataArea, intersection / viewportArea);
}
