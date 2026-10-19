import type { CSSProperties } from 'react';

// Contentful's `tablestyle` setting is the body of a JSON object, e.g. `"maxWidth": "800px"`
export function parseTableStyle(tableStyle?: string | null): CSSProperties {
  if (!tableStyle) return {};
  try {
    return JSON.parse(`{${tableStyle}}`);
  } catch {
    return {};
  }
}

export function sortRows<T>(
  rows: T[],
  sortKey: string,
  sortDir: 'asc' | 'desc',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValue: (row: any, key: string) => any = (row, key) => row?.[key]
): T[] {
  if (!sortKey) return rows;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [...rows].sort((a: any, b: any) => {
    let aValue = getValue(a, sortKey);
    let bValue = getValue(b, sortKey);
    if (sortKey === 'year') {
      aValue = a.roles?.[0]?.term?.start || '';
      bValue = b.roles?.[0]?.term?.start || '';
    }
    if (sortKey === 'start' || sortKey === 'end' || sortKey === 'createdAt') {
      aValue = aValue || '';
      bValue = bValue || '';
      return sortDir === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
    }
    aValue = (aValue || '').toString().toLowerCase();
    bValue = (bValue || '').toString().toLowerCase();
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}
