import { allFilters } from '../../search/tabsConfig';

/**
 * Search params for a resource search filtered on a tag, e.g. `{ topics: 'AGRICULTURE' }`.
 * Returns undefined when the resource search has no filter for the field (e.g. audiences),
 * in which case the tag cannot be linked.
 */
export function getTagSearchParams(
  field: string,
  value: string
): Record<string, string> | undefined {
  if (!allFilters.includes(field)) return undefined;
  return { [field]: value };
}
