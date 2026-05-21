import { MAX_NAMES, ParsedName, SortDirection } from './types';

export function parseNameInput(input: string): string[] | { error: string } {
  // Match the legacy behaviour: split on pipe OR newline — whichever yields more entries.
  const pipeDelimited = input
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
  const newLineDelimited = input
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const names =
    pipeDelimited.length > newLineDelimited.length ? pipeDelimited : newLineDelimited;

  if (names.length === 0) {
    return { error: 'No names found — paste names (one per line) or upload a text file' };
  }
  if (names.length > MAX_NAMES) {
    return {
      error: `Too many names (maximum ${MAX_NAMES.toLocaleString()}) — try using our APIs instead`,
    };
  }
  return names;
}

export function buildCsv(
  names: ParsedName[],
  fields: readonly string[],
  excludeUnparsed: boolean
): string {
  const rows = excludeUnparsed ? names.filter((n) => n.parsed) : names;
  let csv = fields.join(',') + '\n';
  rows.forEach((row) => {
    csv +=
      fields
        .map((f) => {
          const val = (row as Record<string, unknown>)[f];
          if (val === undefined || val === null || val === '') return '';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(',') + '\n';
  });
  return csv;
}

export function sortNames(
  names: ParsedName[],
  column: string | undefined,
  direction: SortDirection
): ParsedName[] {
  if (!column) return names;
  const sorted = [...names];
  sorted.sort((a, b) => {
    const av = (a as Record<string, unknown>)[column];
    const bv = (b as Record<string, unknown>)[column];
    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;
    if (typeof av === 'boolean' && typeof bv === 'boolean') {
      return av === bv ? 0 : av ? -1 : 1;
    }
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    if (as < bs) return -1;
    if (as > bs) return 1;
    return 0;
  });
  if (direction === 'desc') sorted.reverse();
  return sorted;
}
