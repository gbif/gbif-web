/* eslint-env mocha */
import assert from 'assert';
import {
  collectPredicateChecklists,
  BACKBONE_CHECKLIST_KEY,
} from './collectPredicateChecklists';

const CUSTOM_CHECKLIST = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

// ---------------------------------------------------------------------------
// Example predicates
// ---------------------------------------------------------------------------

// Simple leaf: checklist-aware field with an explicit checklistKey
const explicitChecklistPredicate = {
  type: 'equals',
  key: 'TAXON_KEY',
  value: '212',
  checklistKey: CUSTOM_CHECKLIST,
};

// Simple leaf: checklist-aware field, no checklistKey → implies backbone
const implicitBackbonePredicate = {
  type: 'equals',
  key: 'TAXON_KEY',
  value: '212',
};

// Simple leaf: non-checklist-aware field → no checklist key collected
const nonChecklistPredicate = {
  type: 'equals',
  key: 'COUNTRY',
  value: 'DK',
};

// NOT wrapper (single nested predicate)
const notPredicate = {
  type: 'not',
  predicate: {
    type: 'equals',
    key: 'KINGDOM_KEY',
    value: '6',
    checklistKey: CUSTOM_CHECKLIST,
  },
};

// AND with mixed children: one explicit, one implicit, one unrelated
const andPredicate = {
  type: 'and',
  predicates: [
    {
      type: 'equals',
      key: 'TAXON_KEY',
      value: '212',
      checklistKey: CUSTOM_CHECKLIST,
    },
    {
      type: 'equals',
      key: 'SPECIES_KEY',
      value: '999',
      // no checklistKey → backbone implied
    },
    {
      type: 'equals',
      key: 'COUNTRY',
      value: 'DK',
    },
  ],
};

// nest predicate with implicit checklistKey inside AND to test recursive collection and dedpulication
const nestedPredicate = {
  type: 'and',
  predicates: [
    {
      type: 'equals',
      key: 'TAXON_KEY',
      value: '212',
      checklistKey: CUSTOM_CHECKLIST,
    },
    {
      type: 'equals',
      key: 'SPECIES_KEY',
      value: '999',
      // no checklistKey → backbone implied
    },
    {
      type: 'equals',
      key: 'COUNTRY',
      value: 'DK',
    },
    {
      type: 'and',
      predicates: [
        {
          type: 'equals',
          key: 'SPECIES_KEY',
          value: '999',
          // no checklistKey → backbone implied
        },
        {
          type: 'equals',
          key: 'TAXON_KEY',
          value: '123',
          // no checklistKey → backbone implied
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('collectPredicateChecklists', () => {
  it('returns empty set for null/undefined predicate', () => {
    assert.deepStrictEqual(collectPredicateChecklists(null, true), new Set());
    assert.deepStrictEqual(
      collectPredicateChecklists(undefined, true),
      new Set(),
    );
  });

  it('returns the explicit checklistKey for a leaf predicate', () => {
    const result = collectPredicateChecklists(explicitChecklistPredicate, true);
    assert.deepStrictEqual(result, new Set([CUSTOM_CHECKLIST]));
  });

  it('returns the backbone key when addImplicit=true and no checklistKey', () => {
    const result = collectPredicateChecklists(implicitBackbonePredicate, true);
    assert.deepStrictEqual(result, new Set([BACKBONE_CHECKLIST_KEY]));
  });

  it('returns empty set when addImplicit=false and no checklistKey', () => {
    const result = collectPredicateChecklists(implicitBackbonePredicate, false);
    assert.deepStrictEqual(result, new Set());
  });

  it('returns empty set for a non-checklist-aware field', () => {
    const result = collectPredicateChecklists(nonChecklistPredicate, true);
    assert.deepStrictEqual(result, new Set());
  });

  it('traverses a NOT wrapper (single nested predicate)', () => {
    const result = collectPredicateChecklists(notPredicate, true);
    assert.deepStrictEqual(result, new Set([CUSTOM_CHECKLIST]));
  });

  it('collects from all children of an AND predicate, deduplicating keys', () => {
    const result = collectPredicateChecklists(andPredicate, true);
    // CUSTOM_CHECKLIST from TAXON_KEY, BACKBONE from SPECIES_KEY, COUNTRY ignored
    assert.deepStrictEqual(
      result,
      new Set([CUSTOM_CHECKLIST, BACKBONE_CHECKLIST_KEY]),
    );
  });

  it('returns only explicit keys when addImplicit=false on AND predicate', () => {
    const result = collectPredicateChecklists(andPredicate, false);
    assert.deepStrictEqual(result, new Set([CUSTOM_CHECKLIST]));
  });

  it('traverses nested predicates and deduplicates implicit keys', () => {
    const result = collectPredicateChecklists(nestedPredicate, true);
    // CUSTOM_CHECKLIST from TAXON_KEY, BACKBONE from all SPECIES_KEY and TAXON_KEY instances, COUNTRY ignored
    assert.deepStrictEqual(
      result,
      new Set([CUSTOM_CHECKLIST, BACKBONE_CHECKLIST_KEY]),
    );
  });
});
