import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  Row,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { ViewHeader } from '../ViewHeader';
import { Cell } from './components/cell';
import { Head } from './components/head';
import { InitialSkeletonTable } from './components/initialSkeletonTable';
import { TableFooter } from './components/tableFooter';
import { FirstColumLockProvider } from './firstColumLock';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';

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
  createRowLink?: (row: Row<TData>) => string;
}

export function SearchTable<TData, TValue>({
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
}: Props<TData, TValue>) {
  const initialColumnVisibility = useRef(
    createInitialColumnVisibilityState(availableTableColumns, defaultEnabledTableColumns)
  );

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility.current);

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

  return (
    <>
      <ViewHeader total={rowCount} loading={loading} message="counts.nResults" />
      <FirstColumLockProvider lockColumnLocalStoreKey={lockColumnLocalStoreKey}>
        <DynamicHeightDiv
          minPxHeight={500}
          className={cn('g-rounded-md g-border g-relative g-bg-white', className)}
        >
          <div className="g-flex g-flex-col g-h-full">
            <div ref={tableWrapperRef} className="g-relative g-w-full g-overflow-auto g-h-full">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Head
                          key={header.id}
                          table={table}
                          header={header}
                          resetColumnVisibility={() =>
                            setColumnVisibility(initialColumnVisibility.current)
                          }
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
                          'hover:g-bg-gray-50': typeof createRowLink === 'function',
                        })}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Cell
                            to={createRowLink?.(row)}
                            key={cell.id}
                            cell={cell}
                            loading={loading}
                          />
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <TableFooter table={table} loading={loading} />
          </div>
        </DynamicHeightDiv>
      </FirstColumLockProvider>
    </>
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