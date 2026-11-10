// occurrenceStatus was renamed from PRESENT/ABSENT to DETECTED/NOT_DETECTED
// https://github.com/gbif/gbif-web/issues/2077
// Old links, bookmarks and download predicates can still carry the old values.
const OLD_TO_NEW: Record<string, string> = {
  PRESENT: 'DETECTED',
  ABSENT: 'NOT_DETECTED',
};

export function normalizeOccurrenceStatus<T>(value: T): T | string {
  if (typeof value !== 'string') return value;
  return OLD_TO_NEW[value.trim().toUpperCase()] ?? value;
}
