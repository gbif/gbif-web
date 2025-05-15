import { FilterSetting } from '@/components/filters/filterTools';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { FaSortUp as SortAscIcon, FaSortDown as SortDescIcon } from 'react-icons/fa6';
import { LuSettings2 as FilterIcon } from 'react-icons/lu';
import { FormattedMessage } from 'react-intl';
import {
  ResetColumnVisibility,
  ToggleColumnVisibility,
  VisibleColumns,
} from '../../hooks/useColumnVisibility';
import { SetFirstColumnIsLocked } from '../../hooks/useFirstColumLock';
import { ColumnVisibilityPopover } from './columnVisibilityPopover';

import { useToast } from '@/components/ui/use-toast';
import useLocalStorage from 'use-local-storage';
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

export type ActionsProps = {
  firstColumnIsLocked: boolean;
  hideFirstColumnLock: boolean;
  setFirstColumnIsLocked: SetFirstColumnIsLocked;
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
  const Actions = column?.Actions;
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

          <div className="g-flex-0 g-pe-1 ">
            <FormattedMessage id={column.header} />
          </div>
          <div className="g-flex-1">
            {column.sort?.sortBy && (
              <Sort
                sortByField={column.sort?.sortBy}
                message={column.sort.message}
                localStorageKey={column.sort.localStorageKey}
              />
            )}
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
            {Actions && (
              <Actions
                firstColumnIsLocked={firstColumnIsLocked}
                hideFirstColumnLock={hideFirstColumnLock}
                setFirstColumnIsLocked={setFirstColumnIsLocked}
              />
            )}
          </div>
        </div>
      </div>
    </TableHead>
  );
}

function Sort({
  sortByField,
  message,
  localStorageKey,
}: {
  sortByField: string;
  message: React.ReactNode;
  localStorageKey: string;
}) {
  const { toast } = useToast();
  const [sorter, setSorter] = useLocalStorage(localStorageKey, {
    sortOrder: 'ASC',
    sortBy: '',
  });
  const { sortBy, sortOrder } = sorter;

  return (
    <span
      className="g-relative -g-mt-1 g-me-2 g-text-slate-200"
      onClick={() => {
        if (sortByField === sortBy) {
          if (sortOrder === 'ASC') {
            setSorter({
              sortOrder: 'DESC',
              sortBy: sortBy,
            });
          } else {
            setSorter({
              sortOrder: 'ASC',
              sortBy: '',
            });
          }
        } else {
          setSorter({
            sortOrder: 'ASC',
            sortBy: sortByField,
          });

          if (message) {
            toast({
              title: message,
              variant: 'default',
            });
          }
        }
      }}
    >
      <SortAscIcon
        className={cn({
          'g-text-slate-600': sortOrder === 'ASC' && sortByField === sortBy,
        })}
      />
      <SortDescIcon
        className={cn('g-absolute g-left-0 g-bottom-0', {
          'g-text-slate-600': sortOrder === 'DESC' && sortByField === sortBy,
        })}
      />
    </span>
  );
}
