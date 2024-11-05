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
import { FilterSetting } from '@/components/filters/filterTools';

type Props<TData> = {
  isFirstHead: boolean;
  header: Header<TData, unknown>;
  table: Table<TData>;
  resetColumnVisibility: () => void;
  filters: Record<string, FilterSetting>;
};

export function Head<TData>({
  isFirstHead,
  header,
  table,
  resetColumnVisibility,
  filters,
}: Props<TData>) {
  const { locked, setLocked, hidden } = useFirstColumLock();

  const filter = filters[header.column.id];

  return (
    <TableHead
      key={header.id}
      className={cn('g-sticky g-top-0 g-bg-white box-shadow-b g-z-10 g-text-nowrap', {
        'g-left-0 g-z-20': locked && isFirstHead,
      })}
      style={{
        minWidth: header.column.columnDef.minSize ?? 'unset',
      }}
    >
      <div className="g-inline-flex g-items-center g-justify-between g-w-full">
        <div className="g-inline-flex">
          {isFirstHead && (
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

        {isFirstHead && !hidden && (
          <SimpleTooltip title={locked ? 'Unlock column' : 'Lock column'}>
            <button onClick={() => setLocked((v) => !v)}>
              {locked && <MdLock />}
              {locked || <MdLockOpen />}
            </button>
          </SimpleTooltip>
        )}
      </div>
    </TableHead>
  );
}
