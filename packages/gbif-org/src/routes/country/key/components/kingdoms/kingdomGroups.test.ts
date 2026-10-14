import { describe, expect, it } from 'vitest';
import { getLegacyKingdomId, groupKingdoms } from './kingdomGroups';

describe('getLegacyKingdomId', () => {
  it('maps main kingdoms and ignores authorship', () => {
    expect(getLegacyKingdomId('Plantae')).toBe(6);
    expect(getLegacyKingdomId('Bacillati (Gibbons & Murray, 1978) Oren & Göker 2024')).toBe(3);
    expect(getLegacyKingdomId('Orthornavirae')).toBe(8);
    expect(getLegacyKingdomId('Something else')).toBeUndefined();
  });
});

describe('groupKingdoms', () => {
  it('merges COL kingdoms that share a legacy kingdom', () => {
    const groups = groupKingdoms([
      { key: 'N', count: 10, name: 'Animalia' },
      { key: 'CTJFC', count: 5, name: 'Bacillati (Gibbons & Murray, 1978) Oren & Göker 2024' },
      { key: 'CTJJY', count: 2, name: 'Pseudomonadati (Gibbons & Murray, 1978) Oren & Göker 2024' },
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[1]).toMatchObject({ legacyId: 3, keys: ['CTJFC', 'CTJJY'], count: 7 });
  });

  it('keeps unknown kingdoms separate and falls back to the key without a name', () => {
    const groups = groupKingdoms([
      { key: 'X1', count: 1, name: 'Mystica' },
      { key: 'X2', count: 1 },
    ]);
    expect(groups.map((g) => g.name)).toEqual(['Mystica', 'X2']);
  });
});
