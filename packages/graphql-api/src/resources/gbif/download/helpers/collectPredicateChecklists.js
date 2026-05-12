import config from '@/config';

export const BACKBONE_CHECKLIST_KEY =
  config.gbifBackboneUUID ?? 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

// Predicate fields that are resolved against a checklist. When one of these
// is used and the predicate node has no explicit checklistKey, the GBIF
// backbone is implied (which is how downloads behaved before multi-taxonomy).
export const CHECKLIST_AWARE_PREDICATE_FIELDS = new Set([
  'TAXON_KEY',
  'ACCEPTED_TAXON_KEY',
  'SPECIES_KEY',
  'GENUS_KEY',
  'FAMILY_KEY',
  'ORDER_KEY',
  'CLASS_KEY',
  'PHYLUM_KEY',
  'KINGDOM_KEY',
  'SUBGENUS_KEY',
  'IUCN_RED_LIST_CATEGORY',
  'ISSUES',
  'TAXONOMIC_ISSUES',
]);

/**
 * Recursively collects checklist keys referenced by a predicate tree.
 *
 * @param {object} predicate - The predicate (or sub-predicate) to inspect.
 * @param {boolean} addImplicit - When true, checklist-aware fields with no
 *   explicit checklistKey will cause the GBIF backbone key to be included.
 * @returns {Set<string>} The set of checklist keys found.
 */
export function collectPredicateChecklists(predicate, addImplicit) {
  if (!predicate || typeof predicate !== 'object') return new Set();

  const result = new Set();

  if (Array.isArray(predicate.predicates)) {
    predicate.predicates.forEach((child) => {
      collectPredicateChecklists(child, addImplicit).forEach((k) =>
        result.add(k),
      );
    });
  }
  if (predicate.predicate) {
    collectPredicateChecklists(predicate.predicate, addImplicit).forEach((k) =>
      result.add(k),
    );
  }

  const fieldName = predicate.key ?? predicate.parameter;
  if (typeof fieldName === 'string') {
    if (CHECKLIST_AWARE_PREDICATE_FIELDS.has(fieldName)) {
      if (predicate.checklistKey) {
        result.add(predicate.checklistKey);
      } else if (addImplicit) {
        result.add(BACKBONE_CHECKLIST_KEY);
      }
    }
  }

  return result;
}
