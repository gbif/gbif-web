import { TableHeader, TableRow } from '@/components/ui/table';
import {
  ResetColumnVisibility,
  ToggleColumnVisibility,
  VisibleColumns,
} from '../../hooks/useColumnVisibility';
import { SetFirstColumnIsLocked } from '../../hooks/useFirstColumLock';
import { Head } from './head';
import { memo } from 'react';
import { Filters } from '@/routes/occurrence/search/filters';
import { ColumnDef } from '../..';

type Props = {
  filters?: Filters;
  filteredColumns: ColumnDef<unknown>[];
  orderedColumns: ColumnDef<unknown>[];
  isHorizontallyScrolled: boolean;
  firstColumnIsLocked: boolean;
  hideFirstColumnLock: boolean;
  setFirstColumnIsLocked: SetFirstColumnIsLocked;
  resetColumnVisibility: ResetColumnVisibility;
  toggleColumnVisibility: ToggleColumnVisibility;
  visibleColumns: VisibleColumns;
  hideColumnVisibilityDropdown: boolean;
};

export default memo(Header);
function Header({
  filteredColumns,
  orderedColumns,
  isHorizontallyScrolled,
  firstColumnIsLocked,
  hideFirstColumnLock,
  setFirstColumnIsLocked,
  resetColumnVisibility,
  toggleColumnVisibility,
  visibleColumns,
  filters,
  hideColumnVisibilityDropdown,
}: Props) {
  return (
    <>
      {/* https://limebrains.com/blog/2021-03-02T13:00-heigh-100-inside-table-td/ */}
      {/* Without this 1px height the a tags in the table cells won't be able to match the height of the td with height: 100% */}
      <TableHeader className="g-h-1">
        <TableRow>
          {filteredColumns.map((col, idx) => (
            <Head
              filter={filters?.[col.filterKey ?? col.id]}
              key={col.id}
              column={col}
              orderedColumns={orderedColumns}
              isHorizontallyScrolled={isHorizontallyScrolled}
              firstColumnIsLocked={firstColumnIsLocked}
              hideFirstColumnLock={hideFirstColumnLock}
              setFirstColumnIsLocked={setFirstColumnIsLocked}
              isFirstColumn={idx === 0}
              resetColumnVisibility={resetColumnVisibility}
              toggleColumnVisibility={toggleColumnVisibility}
              visibleColumns={visibleColumns}
              hideColumnVisibilityDropdown={hideColumnVisibilityDropdown}
            />
          ))}
        </TableRow>
      </TableHeader>
    </>
  );
}
