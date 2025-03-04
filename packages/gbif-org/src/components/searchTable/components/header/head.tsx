import { SimpleTooltip } from '@/components/simpleTooltip';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { MdLock, MdLockOpen } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import {
  ResetColumnVisibility,
  ToggleColumnVisibility,
  VisibleColumns,
} from '../../hooks/useColumnVisibility';
import { SetFirstColumnIsLocked } from '../../hooks/useFirstColumLock';
import { ColumnVisibilityPopover } from './columnVisibilityPopover';
import { FilterSetting } from '@/components/filters/filterTools';
import { LuListFilter as FilterIcon } from 'react-icons/lu';
import { ColumnDef } from '../..';

type Props = {
  column: ColumnDef<unknown>;
  orderedColumns: ColumnDef<unknown>[];
  isHorizontallyScrolled: boolean;
  firstColumnIsLocked: boolean;
  hideFirstColumnLock: boolean;
  setFirstColumnIsLocked: SetFirstColumnIsLocked;
  isFirstColumn: boolean;
  resetColumnVisibility: ResetColumnVisibility;
  toggleColumnVisibility: ToggleColumnVisibility;
  visibleColumns: VisibleColumns;
  filter?: FilterSetting;
  hideColumnVisibilityDropdown: boolean;
};

export function Head({
  column,
  orderedColumns,
  isHorizontallyScrolled,
  firstColumnIsLocked,
  hideFirstColumnLock,
  setFirstColumnIsLocked,
  isFirstColumn,
  resetColumnVisibility,
  toggleColumnVisibility,
  visibleColumns,
  filter,
  hideColumnVisibilityDropdown,
}: Props) {
  return (
    <TableHead
      key={column.id}
      className={cn(
        'g-transition-colors g-sticky g-top-0 g-text-nowrap',
        firstColumnIsLocked && isFirstColumn
          ? 'g-left-0 g-z-20 g-box-shadow-br g-border-r-0'
          : 'g-box-shadow-b',
        isFirstColumn ? 'g-z-20' : 'g-z-10',
        // Darken the background color when the table is scrolled and the column is locked
        isHorizontallyScrolled && firstColumnIsLocked && !isFirstColumn
          ? 'g-bg-gray-50'
          : 'g-bg-white'
      )}
      style={{
        minWidth: column.minWidth ?? 'unset',
      }}
    >
      <div className="g-inline-flex g-items-center g-justify-between g-w-full">
        <div className="g-inline-flex">
          {isFirstColumn && !hideColumnVisibilityDropdown && (
            <ColumnVisibilityPopover
              orderedColumns={orderedColumns}
              resetColumnVisibility={resetColumnVisibility}
              toggleColumnVisibility={toggleColumnVisibility}
              visibleColumns={visibleColumns}
            />
          )}

          <FormattedMessage id={column.header} />

          {filter && (
            <filter.Popover
              trigger={
                <button className="g-ml-2">
                  <FilterIcon />
                </button>
              }
            />
          )}
        </div>

        {isFirstColumn && !hideFirstColumnLock && (
          <SimpleTooltip
            side="right"
            asChild
            i18nDefaultMessage={firstColumnIsLocked ? 'Unlock column' : 'Lock column'}
            i18nKey={firstColumnIsLocked ? 'search.table.unlockColumn ' : 'search.table.lockColumn'}
          >
            <button onClick={() => setFirstColumnIsLocked((v) => !v)}>
              {firstColumnIsLocked ? <MdLock /> : <MdLockOpen />}
            </button>
          </SimpleTooltip>
        )}
      </div>
    </TableHead>
  );
}
