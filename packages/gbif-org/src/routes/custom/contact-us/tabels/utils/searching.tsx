import { matchSorter } from 'match-sorter';
import { useMemo } from 'react';

type Options<T> = {
  q: string;
  searchKeys: string[];
  items: T[] | Record<string, T>;
  fuzzySearch?: boolean;
};

export function useFilteredItems<T>({
  q,
  searchKeys,
  items,
  fuzzySearch = false,
}: Options<T>): T[] {
  return useMemo(() => {
    let results = Array.isArray(items) ? items : Object.values(items);

    if (q) {
      if (fuzzySearch) {
        results = matchSorter(results, q, {
          keys: searchKeys,
          // No need to sort based on best match when using table sorting
          sorter: (x) => x,
        });
      } else {
        results = results.filter((item) =>
          searchKeys.some((key) =>
            item[key as keyof T]?.toString().toLowerCase().includes(q.toLowerCase())
          )
        );
      }
    }

    return results;
  }, [items, q, searchKeys, fuzzySearch]);
}
