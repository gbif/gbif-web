import { TableBody, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { memo } from 'react';
import { ColumnDef } from '../..';
import { CreateRowLink } from '../../hooks/useRowLink';
import { Cell } from './cell';
import { InitialSkeletonTable } from './initialSkeletonTable';

type Props<T> = {
  loading: boolean;
  items: T[];
  keySelector(item: T): string;
  filteredColumns: ColumnDef<T>[];
  isHorizontallyScrolled: boolean;
  firstColumnIsLocked: boolean;
  createRowLink?: CreateRowLink<T>;
};

export default memo(Body) as typeof Body;
function Body<T>({
  loading,
  items,
  keySelector,
  filteredColumns,
  isHorizontallyScrolled,
  firstColumnIsLocked,
  createRowLink,
}: Props<T>) {
  const initialLoading = loading && items.length === 0;

  return (
    <TableBody>
      {initialLoading && <InitialSkeletonTable filteredColumns={filteredColumns} />}
      {initialLoading ||
        items.map((item) => {
          const linkData = createRowLink?.(item);

          return (
            <TableRow
              key={keySelector(item)}
              className={cn('g-border-b', {
                'g-group': typeof createRowLink === 'function',
                'g-pointer-events-none': loading,
              })}
            >
              {filteredColumns.map((column, idx) => (
                <Cell
                  key={column.id}
                  loading={loading}
                  isHorizontallyScrolled={isHorizontallyScrolled}
                  firstColumnIsLocked={firstColumnIsLocked}
                  isFirstColumn={idx === 0}
                  render={column.cell}
                  item={item}
                  linkData={linkData}
                />
              ))}
            </TableRow>
          );
        })}
    </TableBody>
  );
}
