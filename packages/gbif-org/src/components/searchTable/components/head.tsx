import { TableHead } from '@/components/ui/table';
import { flexRender, Header, Table } from '@tanstack/react-table';
import { MdLock, MdLockOpen } from 'react-icons/md';
import { useFirstColumLock } from '../firstColumLock';
import { cn } from '@/utils/shadcn';
import { SlOptionsVertical } from 'react-icons/sl';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { LuListFilter as FilterIcon } from 'react-icons/lu';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { FormattedMessage } from 'react-intl';

type Props<TData> = {
  header: Header<TData, unknown>;
  table: Table<TData>;
  resetColumnVisibility: () => void;
};

export function Head<TData>({ header, table, resetColumnVisibility }: Props<TData>) {
  const { locked, setLocked, hideLock } = useFirstColumLock();
  const filter = header.column.columnDef.meta?.filter;

  return (
    <TableHead
      key={header.id}
      className={cn(
        'g-sticky g-top-0 g-bg-white g-z-10 g-text-nowrap',
        locked && header.column.getIsFirstColumn()
          ? 'g-left-0 g-z-20 g-box-shadow-br g-border-r-0'
          : 'g-box-shadow-b'
      )}
      style={{
        minWidth: header.column.columnDef.minSize ?? 'unset',
      }}
    >
      <div className="g-inline-flex g-items-center g-justify-between g-w-full">
        <div className="g-inline-flex">
          {header.column.getIsFirstColumn() && (
            <ColumnVisibilityPopover table={table} resetColumnVisibility={resetColumnVisibility} />
          )}

          {!header.isPlaceholder && <HeaderTitle header={header} />}

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

        {header.column.getIsFirstColumn() && !hideLock && (
          <SimpleTooltip
            title={
              <FormattedMessage
                id={locked ? 'search.table.unlockColumn ' : 'search.table.lockColumn'}
              />
            }
          >
            <button onClick={() => setLocked((v) => !v)}>
              {locked ? <MdLock /> : <MdLockOpen />}
            </button>
          </SimpleTooltip>
        )}
      </div>
    </TableHead>
  );
}

function ColumnVisibilityPopover<TData>({
  table,
  resetColumnVisibility,
}: Pick<Props<TData>, 'table' | 'resetColumnVisibility'>) {
  return (
    <Popover>
      <SimpleTooltip title="search.table.columnVisibility">
        <PopoverTrigger className="g-pr-3 g-pl-1 hover:g-text-primary-500">
          {/* This 16px width match the drawer icon in the left most cell */}
          <div className="g-w-[16px]">
            <SlOptionsVertical size={14} />
          </div>
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className="g-p-3 g-flex g-flex-col g-gap-3 g-overflow-y-scroll g-max-h-96">
        {/* TODO: This only shows the headers that are visible, wich makes it useless */}
        {table.getFlatHeaders().map((header) => (
          <div key={header.id} className="g-flex g-items-center g-gap-2">
            <Checkbox
              checked={header.column.getIsVisible()}
              disabled={!header.column.getCanHide()}
              onCheckedChange={() => header.column.toggleVisibility()}
              id={header.id}
            />
            <label
              htmlFor={header.id}
              className="g-cursor-pointer g-text-sm g-font-medium peer-disabled:g-cursor-not-allowed peer-disabled:g-opacity-70"
            >
              <HeaderTitle header={header} />
            </label>
          </div>
        ))}
        <button
          onClick={() => resetColumnVisibility()}
          className="g-text-primary-500 g-font-medium g-text-sm"
        >
          <FormattedMessage id="search.table.resetColumnVisibility" />
        </button>
      </PopoverContent>
    </Popover>
  );
}

function HeaderTitle<TData>({ header }: Pick<Props<TData>, 'header'>) {
  if (typeof header.column.columnDef.header === 'string') {
    return <FormattedMessage id={header.column.columnDef.header} />;
  }

  return flexRender(header.column.columnDef.header, header.getContext());
}
