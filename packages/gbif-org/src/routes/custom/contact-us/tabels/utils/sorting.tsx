import { useMemo, useState } from 'react';

type BaseRow = Record<string, any>;
export type SortDirection = 'asc' | 'desc';

export type SortingRules<T extends BaseRow> = Partial<Record<keyof T, (a: T, b: T) => number>>;

type UseSortedItemsOptions<T extends BaseRow> = {
  items: T[];
  sortField: keyof T | null;
  sortDirection: SortDirection;
  sortingRules: SortingRules<T>;
};

export function useSortedItems<T extends BaseRow>(options: UseSortedItemsOptions<T>): T[] {
  const { items, sortField, sortDirection, sortingRules } = options;

  return useMemo(() => {
    if (!sortField) return items;

    const rule = sortingRules[sortField];
    if (!rule) return items;

    return [...items].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return rule(a, b) * multiplier;
    });
  }, [items, sortField, sortDirection, sortingRules]);
}

type UseSortingOptions<T extends BaseRow> = {
  initialSortField: keyof T;
  initialSortDirection?: SortDirection;
};

type UseSortingResult<T extends BaseRow> = {
  sortField: keyof T | null;
  sortDirection: SortDirection;
  handleSort: (field: keyof T) => void;
};

export function useSorting<T extends BaseRow>(options?: UseSortingOptions<T>): UseSortingResult<T> {
  const [sortField, setSortField] = useState<keyof T | null>(options?.initialSortField ?? null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    options?.initialSortDirection ?? 'asc'
  );

  const handleSort = (field: keyof T) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return { sortField, sortDirection, handleSort };
}
