import { describe, expect, it } from 'vitest';
import { getBadgeYears, parseBoolean, parsePositiveInt } from './volunteerUtils';

const badges = [
  { title: 'Translator', year: 2026 },
  { title: 'translator ', year: 2023 },
  { title: 'Translator', year: 2023 },
  { title: 'Translator', year: 2021 },
  { title: 'Mentor', year: 2025 },
  { title: 'Translator', year: null },
  null,
];

describe('getBadgeYears', () => {
  it('keeps only badges of the configured type within the last years, newest first', () => {
    expect(
      getBadgeYears({ badges, badgeType: 'Translator', maxAgeYears: 5, currentYear: 2026 })
    ).toEqual([2026, 2023]);
  });

  it('shows all years without an age limit', () => {
    expect(getBadgeYears({ badges, badgeType: 'translator', currentYear: 2026 })).toEqual([
      2026, 2023, 2021,
    ]);
  });

  it('shows nothing without a badge type or badges', () => {
    expect(getBadgeYears({ badges, currentYear: 2026 })).toEqual([]);
    expect(getBadgeYears({ badges: null, badgeType: 'Translator' })).toEqual([]);
  });
});

describe('settings parsing', () => {
  it('parses numbers and booleans from contentful strings', () => {
    expect(parsePositiveInt('5')).toBe(5);
    expect(parsePositiveInt(3)).toBe(3);
    expect(parsePositiveInt('x')).toBeUndefined();
    expect(parsePositiveInt(0)).toBeUndefined();
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean('no')).toBe(false);
    expect(parseBoolean(undefined)).toBe(false);
  });
});
