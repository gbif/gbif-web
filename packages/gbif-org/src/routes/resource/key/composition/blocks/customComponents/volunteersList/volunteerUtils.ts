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
