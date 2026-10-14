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

test('reads an exclusion on a nested field back as a plain exclusion', () => {
  expect(
    getPredicateAsFilter({
      predicate: {
        type: 'or',
        predicates: [
          {
            type: 'not',
            predicate: { type: 'isNotNull', parameter: 'NUCLEOTIDE_SEQUENCE_TARGET_GENE' },
          },
          {
            type: 'not',
            predicate: { type: 'in', key: 'NUCLEOTIDE_SEQUENCE_TARGET_GENE', values: ['COI'] },
          },
        ],
      },
      filters: {},
    })
  ).toEqual({
    filter: { must: {}, mustNot: { nucleotideSequenceTargetGene: ['COI'] } },
  });
});

// The download page then links to search with the original predicate as a predicate filter, so
// older downloads still run exactly the predicate they were made with.
test('a plain negation from an older download is not turned into an exclusion', () => {
  expect(
    getPredicateAsFilter({
      predicate: {
        type: 'and',
        predicates: [
          { type: 'in', key: 'OCCURRENCE_STATUS', values: ['PRESENT'] },
          { type: 'not', predicate: { type: 'in', key: 'ISSUE', values: ['ZERO_COORDINATE'] } },
        ],
      },
      filters: {},
    })
  ).toEqual({ error: 'UNABLE_TO_CONVERT' });

  expect(
    getPredicateAsFilter({
      predicate: {
        type: 'not',
        predicate: { type: 'equals', key: 'ISSUE', value: 'ZERO_COORDINATE' },
      },
      filters: {},
    })
  ).toEqual({ error: 'UNABLE_TO_CONVERT' });
});

test('an exclusion whose empty check has another checklistKey is not converted', () => {
  const exclusion = (nullChecklistKey?: string) => ({
    type: 'and',
    predicates: [
      { type: 'in', key: 'OCCURRENCE_STATUS', values: ['PRESENT'] },
      {
        type: 'or',
        predicates: [
          { type: 'isNull', parameter: 'TAXONOMIC_ISSUE', checklistKey: nullChecklistKey },
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
  });
  expect(getPredicateAsFilter({ predicate: exclusion('other'), filters: {} })).toEqual({
    error: 'UNABLE_TO_CONVERT',
  });
  expect(getPredicateAsFilter({ predicate: exclusion(undefined), filters: {} })).toEqual({
    error: 'UNABLE_TO_CONVERT',
  });
});
