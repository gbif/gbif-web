import { TableCell } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { InlineSkeletonWrapper } from '../inlineSkeletonWrapper';
import { MemorizedValue } from './memorizedValue';
import { LinkData } from '@/reactRouterPlugins/dynamicLink';
import { ColumnDef } from '../..';

type Props<T> = {
  loading: boolean;
  isHorizontallyScrolled: boolean;
  firstColumnIsLocked: boolean;
  isFirstColumn: boolean;
  render: ColumnDef<T>['cell'];
  item: T;
  linkData?: LinkData;
};

export function Cell<T>({
  loading,
  isHorizontallyScrolled,
  firstColumnIsLocked,
  isFirstColumn,
  render,
  item,
  linkData,
}: Props<T>) {
  return (
    <TableCell
      linkData={linkData}
      className={cn(
        'g-transition-colors',
        // Darken the background color when the table is scrolled and the column is locked
        isHorizontallyScrolled && firstColumnIsLocked && !isFirstColumn
          ? 'g-bg-gray-50'
          : 'g-bg-white',
        {
          'g-left-0 g-z-10 g-sticky g-border-r-0 g-box-shadow-r':
            firstColumnIsLocked && isFirstColumn,
          'group-hover:g-bg-gray-100': linkData != null,
        }
      )}
    >
      <InlineSkeletonWrapper loading={loading}>
        <MemorizedValue render={render} item={item} />
      </InlineSkeletonWrapper>
    </TableCell>
  );
}
