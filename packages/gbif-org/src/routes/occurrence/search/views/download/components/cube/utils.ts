import { TAXONOMIC_GROUPS, HIGHER_TAXONOMIC_OPTIONS } from './types';

export function getHigherTaxonomicGroups(taxonomicLevel: string): readonly string[] {
  const index = TAXONOMIC_GROUPS.indexOf(taxonomicLevel as any);
  return index === -1 ? [] : HIGHER_TAXONOMIC_OPTIONS.slice(0, index);
}
