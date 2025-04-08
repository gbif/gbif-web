import { FilterSetting } from '@/components/filters/filterTools';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { LuSettings2 as FilterIcon } from 'react-icons/lu';
import { MdLock, MdLockOpen } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import {
  ResetColumnVisibility,
  ToggleColumnVisibility,
  VisibleColumns,
} from '../../hooks/useColumnVisibility';
import { SetFirstColumnIsLocked } from '../../hooks/useFirstColumLock';
import { ColumnVisibilityPopover } from './columnVisibilityPopover';

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
  const AdditionalContent = column?.AdditionalContent;
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
      <div className="g-w-full">
        <div className="g-inline-flex g-items-center g-w-full">
          {isFirstColumn && !hideColumnVisibilityDropdown && (
            <div className="g-flex-0">
              <ColumnVisibilityPopover
                orderedColumns={orderedColumns}
                resetColumnVisibility={resetColumnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
                visibleColumns={visibleColumns}
              />
            </div>
          )}

          <div className="g-flex-1 g-pe-1 ">
            <FormattedMessage id={column.header} />
          </div>

          <div className="g-flex-0 g-inline-flex g-items-center g-gap-1">
            {filter && (
              <filter.Popover
                trigger={
                  <button className="g-ml-2">
                    <FilterIcon className="-g-mt-0.5" />
                  </button>
                }
              />
            )}
            {isFirstColumn && !hideFirstColumnLock && (
              <SimpleTooltip
                side="bottom"
                asChild
                i18nDefaultMessage={firstColumnIsLocked ? 'Unlock column' : 'Lock column'}
                i18nKey={
                  firstColumnIsLocked ? 'search.table.unlockColumn ' : 'search.table.lockColumn'
                }
              >
                <button onClick={() => setFirstColumnIsLocked((v) => !v)}>
                  {firstColumnIsLocked ? <MdLock /> : <MdLockOpen />}
                </button>
              </SimpleTooltip>
            )}
            {AdditionalContent && <AdditionalContent />}
          </div>
        </div>
      </div>
    </TableHead>
  );
}
