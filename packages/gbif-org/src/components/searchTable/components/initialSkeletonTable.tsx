import { Table } from '@tanstack/react-table';
import { TableCell, TableRow } from '../../ui/table';
import { Skeleton } from '../../ui/skeleton';

type Props<TData> = {
  table: Table<TData>;
};

export function InitialSkeletonTable<TData>({ table }: Props<TData>) {
  return (
    <>
      {Array(20)
        .fill(null)
        .map((_, rowIdx) => (
          <TableRow key={rowIdx} className="g-border-b">
            {table.getVisibleLeafColumns().map((_, colIdx) => (
              <TableCell key={`${rowIdx}-${colIdx}`} colSpan={1}>
                <Skeleton className="g-h-6" />
              </TableCell>
            ))}
          </TableRow>
        ))}
    </>
  );
}
