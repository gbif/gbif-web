import { ColumnDef } from '../..';
import { Skeleton } from '../../../ui/skeleton';
import { TableCell, TableRow } from '../../../ui/table';

type Props = {
  filteredColumns: ColumnDef<unknown>[];
};

export function InitialSkeletonTable({ filteredColumns }: Props) {
  return (
    <>
      {Array(20)
        .fill(null)
        .map((_, rowIdx) => (
          <TableRow key={rowIdx} className="g-border-b g-bg-white">
            {filteredColumns.map((_, colIdx) => (
              <TableCell key={`${rowIdx}-${colIdx}`} colSpan={1}>
                <Skeleton className="g-h-6 g-w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
    </>
  );
}
