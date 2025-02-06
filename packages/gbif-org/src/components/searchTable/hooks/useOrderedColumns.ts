import { toRecord } from '@/utils/toRecord';
import { useMemo } from 'react';
import { ColumnDef } from '..';

type Options<T> = {
  availableTableColumns: string[];
  columns: ColumnDef<T>[];
};

export function useOrderedColumns<T>({
  columns,
  availableTableColumns,
}: Options<T>): ColumnDef<T>[] {
  return useMemo(() => {
    const columnsRecord = toRecord(columns, (col) => col.id);

    const results: ColumnDef<T>[] = [];

    for (const id of availableTableColumns) {
      const column = columnsRecord[id];

      if (!column) {
        console.warn(`tried to get column ${id}, but no such column is defined`);
      } else {
        results.push(column);
      }
    }

    return results;
  }, [availableTableColumns, columns]);
}
