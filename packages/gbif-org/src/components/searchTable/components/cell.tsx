import { TableCell } from '@/components/ui/table';
import { InlineSkeletonWrapper } from './inlineSkeletonWrapper';
import { flexRender, Cell as CellType } from '@tanstack/react-table';
import { useFirstColumLock } from '../firstColumLock';
import { cn } from '@/utils/shadcn';

type Props<TData> = {
  loading: boolean;
  cell: CellType<TData, unknown>;
  to?: string;
};

export function Cell<TData>({ loading, cell, to }: Props<TData>) {
  const { locked } = useFirstColumLock();

  return (
    <TableCell
      to={to}
      className={cn({
        'g-left-0 g-z-10 g-sticky g-bg-white g-border-r-0 g-box-shadow-r':
          locked && cell.column.getIsFirstColumn(),
        'g-p-0': cell.column.columnDef.meta?.noCellPadding,
      })}
    >
      <InlineSkeletonWrapper loading={loading}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </InlineSkeletonWrapper>
    </TableCell>
  );
}
