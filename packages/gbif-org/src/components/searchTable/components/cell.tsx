import { TableCell } from '@/components/ui/table';
import { InlineSkeletonWrapper } from './inlineSkeletonWrapper';
import { flexRender, Cell as CellType } from '@tanstack/react-table';
import { useFirstColumLock } from '../firstColumLock';
import { cn } from '@/utils/shadcn';

type Props<TData> = {
  loading: boolean;
  cell: CellType<TData, unknown>;
  isFirstHead: boolean;
};

export function Cell<TData>({ loading, cell, isFirstHead }: Props<TData>) {
  const { locked } = useFirstColumLock();

  return (
    <TableCell
      className={cn({
        'g-left-0 g-z-10 g-sticky g-bg-white': locked && isFirstHead,
        'g-p-0': cell.column.columnDef.meta?.noCellPadding,
      })}
    >
      <InlineSkeletonWrapper loading={loading}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </InlineSkeletonWrapper>
    </TableCell>
  );
}
