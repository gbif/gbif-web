import { TableCell } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { Cell as CellType, flexRender } from '@tanstack/react-table';
import { InlineSkeletonWrapper } from './inlineSkeletonWrapper';
import { DynamicLinkProps } from '@/reactRouterPlugins/dynamicLink';
import { Link } from 'react-router-dom';

type Props<TData> = {
  loading: boolean;
  cell: CellType<TData, unknown>;
  linkProps?: DynamicLinkProps<typeof Link>;
  isScrolled: boolean;
  firstColumnIsLocked: boolean;
};

export function Cell<TData>({
  loading,
  cell,
  linkProps,
  isScrolled,
  firstColumnIsLocked,
}: Props<TData>) {
  return (
    <TableCell
      linkProps={linkProps}
      className={cn(
        'g-transition-colors',
        // Darken the background color when the table is scrolled and the column is locked
        isScrolled && firstColumnIsLocked && !cell.column.getIsFirstColumn()
          ? 'g-bg-gray-50'
          : 'g-bg-white',
        {
          'g-left-0 g-z-10 g-sticky g-border-r-0 g-box-shadow-r':
            firstColumnIsLocked && cell.column.getIsFirstColumn(),
          'group-hover:g-bg-gray-100': linkProps != null,
        }
      )}
    >
      <InlineSkeletonWrapper loading={loading}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </InlineSkeletonWrapper>
    </TableCell>
  );
}
