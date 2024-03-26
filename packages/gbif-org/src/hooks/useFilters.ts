import { TableFilter } from '@/components/tableFilters/types';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export type SetFilter = (update: { id: string; values: string | string[] }) => void;

export function useFilters(
  filterDefinitions: Array<Omit<TableFilter, 'selectedValues'>>
): [TableFilter[], SetFilter] {
  const [searchParams, setSearchParams] = useSearchParams();

  const tableFilters = React.useMemo(() => {
    return filterDefinitions.map((filterDefinition) => {
      const values = searchParams.get(filterDefinition.id)?.split(',') ?? [];
      return {
        ...filterDefinition,
        selectedValues: values,
      };
    });
  }, [filterDefinitions, searchParams]);

  const setFilter: SetFilter = React.useCallback(
    (update) => {
      setSearchParams((prev) => {
        const clone = new URLSearchParams(prev);

        // Handle delete
        if (update.values.length === 0) {
          clone.delete(update.id);
          return clone;
        }

        // Handle create or update
        clone.set(
          update.id,
          Array.isArray(update.values) ? update.values.join(',') : update.values
        );
        return clone;
      });
    },
    [setSearchParams]
  );

  return [tableFilters, setFilter];
}
