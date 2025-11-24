import { matchSorter } from 'match-sorter';
import { useMemo } from 'react';

type Options<T> = { q: string; searchKeys: string[]; items: T[] | Record<string, T> };

export function useFilteredItems<T>({ q, searchKeys, items }: Options<T>): T[] {
  return useMemo(() => {
    let results = Array.isArray(items) ? items : Object.values(items);

    if (q) {
      results = matchSorter(results, q, {
        keys: searchKeys,
        // No need to sort based on best match when using table sorting
        sorter: (x) => x,
      });
    }

    return results;
  }, [items, q, searchKeys]);
}
