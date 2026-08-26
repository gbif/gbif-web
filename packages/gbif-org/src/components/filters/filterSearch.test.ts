import { describe, expect, it } from 'vitest';
import { filterSearchScore, getFilterSearchValue } from './filterSearch';

const basisOfRecord = getFilterSearchValue({
  translatedFilterName: 'Basis of record',
  aliases: 'record type, evidence, specimen, observation',
  group: 'Record',
});
const occurrenceId = getFilterSearchValue({ translatedFilterName: 'Occurrence ID' });

describe('filterSearchScore', () => {
  it('keeps everything when nothing is searched for', () => {
    expect(filterSearchScore(basisOfRecord, '')).toBe(1);
    expect(filterSearchScore(basisOfRecord, '  ')).toBe(1);
  });

  it('does not match the middle of a word', () => {
    // "id" used to match "evidence"
    expect(filterSearchScore(basisOfRecord, 'id')).toBe(0);
    expect(filterSearchScore(basisOfRecord, 'cord')).toBe(0);
  });

  it('matches the start of a word', () => {
    expect(filterSearchScore(occurrenceId, 'id')).toBeGreaterThan(0);
    expect(filterSearchScore(basisOfRecord, 'rec')).toBeGreaterThan(0);
    expect(filterSearchScore(basisOfRecord, 'spec')).toBeGreaterThan(0);
  });

  it('matches aliases', () => {
    expect(filterSearchScore(basisOfRecord, 'observation')).toBeGreaterThan(0);
  });

  it('requires all words in the search to match', () => {
    expect(filterSearchScore(basisOfRecord, 'rec typ')).toBeGreaterThan(0);
    expect(filterSearchScore(basisOfRecord, 'record elevation')).toBe(0);
  });

  it('ignores case, diacritics and punctuation', () => {
    expect(filterSearchScore(basisOfRecord, 'RECORD')).toBeGreaterThan(0);
    expect(filterSearchScore('Année', 'annee')).toBeGreaterThan(0);
    expect(filterSearchScore(basisOfRecord, 'record,')).toBeGreaterThan(0);
  });

  it('matches when the spaces are left out', () => {
    expect(filterSearchScore(basisOfRecord, 'basisofrecord')).toBeGreaterThan(0);
    expect(filterSearchScore(occurrenceId, 'occurrenceid')).toBeGreaterThan(0);
    expect(filterSearchScore(basisOfRecord, 'basisofelevation')).toBe(0);
  });

  it('ranks a hit in the name above a hit in an alias', () => {
    const name = getFilterSearchValue({ translatedFilterName: 'Specimen', aliases: 'preserved' });
    expect(filterSearchScore(name, 'specimen')).toBeGreaterThan(
      filterSearchScore(basisOfRecord, 'specimen')
    );
  });
});
