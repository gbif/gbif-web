import { TableCell } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { Cell as CellType, flexRender } from '@tanstack/react-table';
import { useFirstColumLock } from '../firstColumLock';
import { InlineSkeletonWrapper } from './inlineSkeletonWrapper';

type Props<TData> = {
  loading: boolean;
  cell: CellType<TData, unknown>;
  to?: string;
  isScrolled?: boolean;
};

export function Cell<TData>({ loading, cell, to, isScrolled }: Props<TData>) {
  const { locked } = useFirstColumLock();

  return (
    <TableCell
      to={to}
      className={cn(
        'g-transition-colors',
        // Darken the background color when the table is scrolled and the column is locked
        isScrolled && locked && !cell.column.getIsFirstColumn() ? 'g-bg-gray-50' : 'g-bg-white',
        {
          'g-left-0 g-z-10 g-sticky g-border-r-0 g-box-shadow-r':
            locked && cell.column.getIsFirstColumn(),
          'group-hover:g-bg-gray-100': to,
        }
      )}
    >
      <InlineSkeletonWrapper loading={loading}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </InlineSkeletonWrapper>
    </TableCell>
  );
}
