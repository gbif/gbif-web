import { SimpleTooltip } from '@/components/simpleTooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TableHead } from '@/components/ui/table';
import { Setter } from '@/types';
import { cn } from '@/utils/shadcn';
import { Column, Header, Table } from '@tanstack/react-table';
import { LuListFilter as FilterIcon } from 'react-icons/lu';
import { MdLock, MdLockOpen } from 'react-icons/md';
import { SlOptionsVertical } from 'react-icons/sl';
import { FormattedMessage } from 'react-intl';

type Props<TData> = {
  header: Header<TData, unknown>;
  table: Table<TData>;
  isScrolled: boolean;
  orderedColumns: Column<TData, unknown>[];
  firstColumnIsLocked: boolean;
  hideFirstColumnLock: boolean;
  setFirstColumnIsLocked: Setter<boolean>;
};

export function Head<TData>({
  header,
  table,
  isScrolled,
  orderedColumns,
  firstColumnIsLocked,
  hideFirstColumnLock,
  setFirstColumnIsLocked,
}: Props<TData>) {
  const filter = header.column.columnDef.meta?.filter;
  const isFirstColumn = header.column.getIsFirstColumn();

  return (
    <TableHead
      key={header.id}
      className={cn(
        'g-transition-colors g-sticky g-top-0 g-text-nowrap',
        firstColumnIsLocked && isFirstColumn
          ? 'g-left-0 g-z-20 g-box-shadow-br g-border-r-0'
          : 'g-box-shadow-b',
        isFirstColumn ? 'g-z-20' : 'g-z-10',
        // Darken the background color when the table is scrolled and the column is locked
        isScrolled && firstColumnIsLocked && !isFirstColumn ? 'g-bg-gray-50' : 'g-bg-white'
      )}
      style={{
        minWidth: header.column.columnDef.minSize ?? 'unset',
      }}
    >
      <div className="g-inline-flex g-items-center g-justify-between g-w-full">
        <div className="g-inline-flex">
          {isFirstColumn && (
            <ColumnVisibilityPopover orderedColumns={orderedColumns} table={table} />
          )}

          {!header.isPlaceholder && (
            <FormattedMessage id={headerIsString(header.column.columnDef.header)} />
          )}

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
            <button onClick={() => setFirstColumnIsLocked?.((v) => !v)}>
              {firstColumnIsLocked ? <MdLock /> : <MdLockOpen />}
            </button>
          </SimpleTooltip>
        )}
      </div>
    </TableHead>
  );
}

function ColumnVisibilityPopover<TData>({
  table,
  orderedColumns,
}: Pick<Props<TData>, 'table' | 'orderedColumns'>) {
  return (
    <Popover>
      <SimpleTooltip i18nKey="search.table.columnVisibility" asChild side="right">
        <PopoverTrigger className="g-pr-3 g-pl-1 hover:g-text-primary-500">
          {/* This 16px width match the drawer icon in the left most cell */}
          <div className="g-w-[16px]">
            <SlOptionsVertical size={14} />
          </div>
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className="g-p-3 g-flex g-flex-col g-gap-3 g-overflow-y-scroll g-max-h-96">
        {/* TODO: This only shows the headers that are visible, wich makes it useless */}
        {orderedColumns.map((column) => (
          <div key={column.id} className="g-flex g-items-center g-gap-2">
            <Checkbox
              checked={column.getIsVisible()}
              disabled={!column.getCanHide()}
              onCheckedChange={() => column.toggleVisibility()}
              id={column.id}
            />
            <label
              htmlFor={column.id}
              className="g-cursor-pointer g-text-sm g-font-medium peer-disabled:g-cursor-not-allowed peer-disabled:g-opacity-70"
            >
              <FormattedMessage id={headerIsString(column.columnDef.header)} />
            </label>
          </div>
        ))}
        <button
          onClick={() => table.resetColumnVisibility()}
          className="g-text-primary-500 g-font-medium g-text-sm"
        >
          <FormattedMessage id="search.table.resetColumnVisibility" />
        </button>
      </PopoverContent>
    </Popover>
  );
}

// The tanstack table api can't display all headers including the ones that are not visible,
// therefore we have to get the header from the columnDef, which doesn't allow us to use the flexRender that can handle header functions
// We don't use header functions, so we just don't support the flexRender and give an error if the header is not a string
function headerIsString(header: unknown) {
  if (typeof header === 'string') return header;

  console.error('Header is not a string', header);
  return 'Error';
}
