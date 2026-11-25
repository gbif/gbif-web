import { describe, expect, it } from 'vitest';
import {
  getBadgeYears,
  isActiveTerm,
  parseBoolean,
  parsePositiveInt,
  resolveVolunteerSettings,
} from './volunteerUtils';

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

describe('isActiveTerm', () => {
  const now = new Date('2026-06-15T12:00:00Z');
  it('hides ended terms only', () => {
    expect(isActiveTerm(null, now)).toBe(true);
    expect(isActiveTerm({ end: null }, now)).toBe(true);
    expect(isActiveTerm({ end: '2026-06-15' }, now)).toBe(true);
    expect(isActiveTerm({ end: '2026-06-14' }, now)).toBe(false);
  });
});

describe('resolveVolunteerSettings', () => {
  it('defaults the role of the legacy block types', () => {
    expect(resolveVolunteerSettings('translatorsList', { tablestyle: 'x' }).role).toBe(
      'TRANSLATOR'
    );
    expect(resolveVolunteerSettings('ambassadorsList', null).role).toBe('AMBASSADOR');
    expect(resolveVolunteerSettings('mentorsList', undefined).role).toBe('MENTOR');
  });

  it('lets a role in the settings win, but not an empty or null one', () => {
    expect(resolveVolunteerSettings('translatorsList', { role: 'REVIEWER' }).role).toBe('REVIEWER');
    expect(resolveVolunteerSettings('translatorsList', { role: null }).role).toBe('TRANSLATOR');
    expect(resolveVolunteerSettings('translatorsList', { role: '  ' }).role).toBe('TRANSLATOR');
    expect(resolveVolunteerSettings('translatorsList', { role: 5 }).role).toBe('TRANSLATOR');
  });

  it('has no role for the generic block type unless configured', () => {
    expect(resolveVolunteerSettings('volunteersList', {}).role).toBeUndefined();
    expect(resolveVolunteerSettings('volunteersList', { role: 'TRAINER' }).role).toBe('TRAINER');
  });

  it('keeps the other settings', () => {
    expect(
      resolveVolunteerSettings('volunteersList', { role: 'TRAINER', badgeType: 'Trainer' })
    ).toMatchObject({ badgeType: 'Trainer' });
  });
});
