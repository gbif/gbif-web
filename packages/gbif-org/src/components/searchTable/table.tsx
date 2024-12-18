import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { useIsElementHorizontallyScrolled } from '@/hooks/useIsElementHorizontallyScrolled';
import { interopDefault } from '@/utils/interopDefault';
import { cn } from '@/utils/shadcn';
import {
    ColumnDef,
    getCoreRowModel,
    PaginationState,
    Row,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';
import { memo, useEffect, useRef } from 'react';
import _useLocalStorage from 'use-local-storage';
import { Cell } from './components/cell';
import { Head } from './components/head';
import { InitialSkeletonTable } from './components/initialSkeletonTable';
import { TableFooter } from './components/tableFooter';
import { FirstColumLockProvider } from './firstColumLock';
// Used to import commonjs module as es6 module
const useLocalStorage = interopDefault(_useLocalStorage);

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  loading: boolean;
  rowCount?: number;
  pagination: PaginationState;
  setPaginationState: React.Dispatch<React.SetStateAction<PaginationState>>;
  availableTableColumns: string[];
  defaultEnabledTableColumns: string[];
  lockColumnLocalStoreKey?: string;
  selectedColumnsLocalStoreKey?: string;
  createRowLink?: (row: Row<TData>) => string;
}

export default memo(SearchTable) as typeof SearchTable;
function SearchTable<TData, TValue>({
  columns,
  data,
  className,
  loading,
  rowCount,
  pagination,
  setPaginationState,
  availableTableColumns,
  defaultEnabledTableColumns,
  createRowLink,
  lockColumnLocalStoreKey = 'searchTableLockColumn',
  selectedColumnsLocalStoreKey = 'selectedColumnsLocalStoreKey',
}: Props<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    selectedColumnsLocalStoreKey,
    createInitialColumnVisibilityState(availableTableColumns, defaultEnabledTableColumns)
  );

  const table = useReactTable({
    data: data ?? [],
    columns: columns.filter((column) => availableTableColumns.includes(column.id!)),
    getCoreRowModel: getCoreRowModel(),
    rowCount: rowCount,
    onPaginationChange: setPaginationState,
    initialState: {
      columnOrder: availableTableColumns,
    },
    state: {
      pagination,
      columnVisibility,
    },
    // @ts-ignore
    onColumnVisibilityChange: setColumnVisibility,
    // We use server side pagination and sorting
    manualPagination: true,
    manualSorting: true,
  });

  const initialLoading = loading && data.length === 0;

  // Scroll to the top of the table when pagination.pageIndex changes
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tableWrapperRef.current) {
      tableWrapperRef.current.scrollTop = 0;
    }
  }, [data]);

  const isHorizontallyScrolled = useIsElementHorizontallyScrolled(tableWrapperRef);

  return (
    <FirstColumLockProvider lockColumnLocalStoreKey={lockColumnLocalStoreKey}>
      <div
        className={cn(
          'g-bg-white g-flex-1 g-border g-basis-full g-h-1 g-flex g-flex-col',
          className
        )}
      >
        <div ref={tableWrapperRef} className="g-relative g-w-full g-overflow-auto g-h-full">
          {/* https://limebrains.com/blog/2021-03-02T13:00-heigh-100-inside-table-td/ */}
          {/* Without this 1px height the a tags in the table cells won't be able to match the height of the td with height: 100% */}
          <Table className="g-h-1">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Head
                      key={header.id}
                      table={table}
                      header={header}
                      isScrolled={isHorizontallyScrolled}
                    />
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {initialLoading && <InitialSkeletonTable table={table} />}
              {initialLoading ||
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn('g-border-b', {
                      'g-group': typeof createRowLink === 'function',
                    })}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Cell
                        to={createRowLink?.(row)}
                        key={cell.id}
                        cell={cell}
                        loading={loading}
                        isScrolled={isHorizontallyScrolled}
                      />
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <TableFooter table={table} loading={loading} />
      </div>
    </FirstColumLockProvider>
  );
}

function createInitialColumnVisibilityState(
  availableTableColumns: string[],
  defaultEnabledTableColumns: string[]
): VisibilityState {
  const defaultEnabledTableColumnsSet = new Set(defaultEnabledTableColumns);

  return availableTableColumns.reduce<VisibilityState>((record, columnName) => {
    record[columnName] = defaultEnabledTableColumnsSet.has(columnName);
    return record;
  }, {});
}
