import { expect, test, vi } from 'vitest';
import { getPredicateAsFilter } from './getPredicateAsFilter';

// the filter components pull in the whole UI, which isn't needed to convert predicates
vi.mock('@/components/filters/filterTools', () => ({
  filterConfigTypes: { WILDCARD: 'WILDCARD' },
}));
vi.mock('@/components/filters/rangeFilter', () => ({ rangeOrTerm: (x: string) => x }));

test('reads an exclusion that keeps empty values back as a plain exclusion', () => {
  expect(
    getPredicateAsFilter({
      predicate: {
        type: 'and',
        predicates: [
          { type: 'in', key: 'OCCURRENCE_STATUS', values: ['PRESENT'] },
          {
            type: 'or',
            predicates: [
              { type: 'isNull', parameter: 'TAXONOMIC_ISSUE', checklistKey: 'abc' },
              {
                type: 'not',
                predicate: {
                  type: 'in',
                  key: 'TAXONOMIC_ISSUE',
                  values: ['TAXON_MATCH_NONE'],
                  checklistKey: 'abc',
                },
              },
            ],
          },
        ],
      },
      filters: {},
    })
  ).toEqual({
    filter: {
      must: { occurrenceStatus: ['PRESENT'] },
      mustNot: { taxonomicIssue: ['TAXON_MATCH_NONE'] },
    },
  });
});

test('an or of unrelated predicates is still not converted', () => {
  expect(
    getPredicateAsFilter({
      predicate: {
        type: 'or',
        predicates: [
          { type: 'isNull', parameter: 'ISSUE' },
          { type: 'not', predicate: { type: 'equals', key: 'COUNTRY', value: 'DK' } },
        ],
      },
      filters: {},
    })
  ).toEqual({ error: 'UNABLE_TO_CONVERT' });
});
