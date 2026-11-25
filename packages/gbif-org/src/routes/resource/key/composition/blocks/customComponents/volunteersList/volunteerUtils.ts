export type Badge = { title?: string | null; year?: number | null };

/**
 * Years of the badges that count for a list: the badge title must match the configured badge type
 * (case insensitive) and the year must be within the last `maxAgeYears` calendar years,
 * counting the current year (5 in 2026 gives 2022-2026). Newest year first, without duplicates.
 */
export function getBadgeYears({
  badges,
  badgeType,
  maxAgeYears,
  currentYear = new Date().getFullYear(),
}: {
  badges?: (Badge | null)[] | null;
  badgeType?: string | null;
  maxAgeYears?: number | null;
  currentYear?: number;
}): number[] {
  const type = badgeType?.trim().toLowerCase();
  if (!type) return [];
  const years = (badges ?? [])
    .filter((b): b is Badge => !!b && typeof b.year === 'number')
    .filter((b) => b.title?.trim().toLowerCase() === type)
    .map((b) => b.year as number)
    .filter((year) => maxAgeYears == null || year > currentYear - maxAgeYears);
  return [...new Set(years)].sort((a, b) => b - a);
}

// Contentful settings are free-form JSON, so numbers and booleans may arrive as strings.
export function parsePositiveInt(value: unknown): number | undefined {
  const n = typeof value === 'string' ? parseInt(value, 10) : value;
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : undefined;
}

export function parseBoolean(value: unknown): boolean {
  return value === true || (typeof value === 'string' && value.trim().toLowerCase() === 'true');
}

// Same rule as the API: no end date, or an end date of today or later, means the term is active.
export function isActiveTerm(
  term?: { end?: string | null } | null,
  now: Date = new Date()
): boolean {
  const end = term?.end;
  if (!end) return true;
  return String(end).slice(0, 10) >= now.toISOString().slice(0, 10);
}

export const LEGACY_VOLUNTEER_ROLES: Record<string, string | undefined> = {
  translatorsList: 'TRANSLATOR',
  ambassadorsList: 'AMBASSADOR',
  mentorsList: 'MENTOR',
};

// Block settings win over the legacy default role, but an empty or null role in the settings does not.
export function resolveVolunteerSettings<T extends Record<string, unknown>>(
  componentType: string,
  settings?: T | null
): Omit<T, 'role'> & { role?: string } {
  const role = typeof settings?.role === 'string' ? settings.role.trim() : '';
  return { ...settings, role: role || LEGACY_VOLUNTEER_ROLES[componentType] } as Omit<T, 'role'> & {
    role?: string;
  };
}
