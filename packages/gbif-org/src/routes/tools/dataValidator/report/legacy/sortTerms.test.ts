import { describe, expect, it } from 'vitest';
import type { TermInfo } from '../../data/types';
import { nextTermSort, sortTerms, termLocalName } from './sortTerms';

const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const DWC = 'http://rs.tdwg.org/dwc/terms/';

const terms: TermInfo[] = [
  { term: `${DWC}scientificName`, rawIndexed: 30, interpretedIndexed: 28 },
  { term: `${DWC}basisOfRecord`, rawIndexed: 30 },
  { term: 'http://purl.org/dc/terms/modified', rawIndexed: 4, interpretedIndexed: 4 },
  { term: `${DWC}eventDate`, rawIndexed: 12, interpretedIndexed: 10 },
];
const names = (list: TermInfo[]) => list.map((t) => termLocalName(t.term ?? ''));

describe('sortTerms', () => {
  it('keeps the API order when there is no sort', () => {
    expect(sortTerms(terms, undefined, collator)).toBe(terms);
  });

  it('sorts terms by their local name, ignoring the namespace', () => {
    expect(names(sortTerms(terms, { key: 'term', direction: 'asc' }, collator))).toEqual([
      'basisOfRecord',
      'eventDate',
      'modified',
      'scientificName',
    ]);
  });

  it('sorts counts and keeps the API order for ties', () => {
    expect(names(sortTerms(terms, { key: 'count', direction: 'desc' }, collator))).toEqual([
      'scientificName',
      'basisOfRecord',
      'eventDate',
      'modified',
    ]);
    expect(names(sortTerms(terms, { key: 'count', direction: 'asc' }, collator))).toEqual([
      'modified',
      'eventDate',
      'scientificName',
      'basisOfRecord',
    ]);
  });

  it('puts missing interpreted counts last in both directions', () => {
    for (const direction of ['asc', 'desc'] as const) {
      const sorted = sortTerms(terms, { key: 'interpreted', direction }, collator);
      expect(names(sorted).at(-1)).toBe('basisOfRecord');
    }
  });

  it('does not change the input array', () => {
    const copy = [...terms];
    sortTerms(terms, { key: 'term', direction: 'desc' }, collator);
    expect(terms).toEqual(copy);
  });
});

describe('nextTermSort', () => {
  it('starts names ascending and numbers descending', () => {
    expect(nextTermSort(undefined, 'term')).toEqual({ key: 'term', direction: 'asc' });
    expect(nextTermSort(undefined, 'count')).toEqual({ key: 'count', direction: 'desc' });
  });

  it('flips on the second click and resets on the third', () => {
    const first = nextTermSort(undefined, 'count');
    const second = nextTermSort(first, 'count');
    expect(second).toEqual({ key: 'count', direction: 'asc' });
    expect(nextTermSort(second, 'count')).toBeUndefined();
  });

  it('starts over when another column is chosen', () => {
    expect(nextTermSort({ key: 'count', direction: 'asc' }, 'term')).toEqual({
      key: 'term',
      direction: 'asc',
    });
  });
});
