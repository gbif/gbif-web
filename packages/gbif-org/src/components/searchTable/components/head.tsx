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

          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}

          {filter && (
            <SimpleTooltip title="Filter">
              <div>
                <filter.Popover
                  trigger={
                    <button className="g-ml-2">
                      <FilterIcon />
                    </button>
                  }
                />
              </div>
            </SimpleTooltip>
          )}
        </div>

        {header.column.getIsFirstColumn() && !hideLock && (
          <SimpleTooltip title={locked ? 'Unlock column' : 'Lock column'}>
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
      <SimpleTooltip title="Visible column settings">
        <PopoverTrigger className="g-pr-3 g-pl-1 hover:g-text-primary-500">
          {/* This 16px width match the drawer icon in the left most cell */}
          <div className="g-w-[16px]">
            <SlOptionsVertical size={14} />
          </div>
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className="g-p-3 g-flex g-flex-col g-gap-3">
        {table.getAllColumns().map((column) => (
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
              {/* TODO: This could fail because header can i a component. Should we handle components here or restrict the type? */}
              {column.columnDef.header?.toString()}
            </label>
          </div>
        ))}
        <button
          onClick={() => resetColumnVisibility()}
          className="g-text-primary-500 g-font-medium g-text-sm"
        >
          Reset
        </button>
      </PopoverContent>
    </Popover>
  );
}
