import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { Skeleton } from '../ui/skeleton';
import { MdChevronLeft, MdChevronRight, MdFirstPage } from 'react-icons/md';
import { InitialSkeletonTable } from './components/initialSkeletonTable';
import { FooterButton } from './components/footerButton';
import { InlineSkeletonWrapper } from './components/inlineSkeletonWrapper';
import { Head } from './components/head';
import { FirstColumLockProvider } from './firstColumLock';
import { Cell } from './components/cell';
import { useEffect, useRef, useState } from 'react';

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
  lockColumnLocalStoreKey = 'searchTableLockColumn',
}: Props<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState(
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
    onColumnVisibilityChange: setColumnVisibility,
    // We use server side pagination and sorting
    manualPagination: true,
    manualSorting: true,
  });

  const initialLoading = data.length === 0;

  const tableRef = useRef<HTMLTableElement>(null);

  // Scroll to the top of the table when currentPage changes
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [pagination.pageIndex]);

  return (
    <FirstColumLockProvider lockColumnLocalStoreKey={lockColumnLocalStoreKey}>
      <div className="g-bg-gray-100 g-p-2 g-flex g-flex-col g-flex-1 g-min-h-0">
        {initialLoading && <Skeleton className="g-w-32 g-h-5 g-inline-block g-mb-1" />}
        {initialLoading || <p className="g-text-sm g-pb-1 g-text-gray-500">{rowCount} results</p>}

        <div className={cn('g-rounded-md g-border g-flex g-flex-col', className)}>
          <Table ref={tableRef}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Head
                      key={header.id}
                      table={table}
                      header={header}
                      resetColumnVisibility={() =>
                        setColumnVisibility(
                          createInitialColumnVisibilityState(
                            availableTableColumns,
                            defaultEnabledTableColumns
                          )
                        )
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
                    className="g-border-b"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Cell key={cell.id} cell={cell} loading={loading} />
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="g-flex g-justify-between g-items-center g-border-t g-px-2">
            <div className="g-flex g-flex-1">
              {table.getCanPreviousPage() && (
                <>
                  <FooterButton
                    onClick={table.firstPage}
                    icon={<MdFirstPage />}
                    toolTip={<span>First</span>}
                  />
                  <FooterButton
                    onClick={table.previousPage}
                    icon={<MdChevronLeft />}
                    toolTip={<span>Previous</span>}
                  />
                </>
              )}
            </div>
            <InlineSkeletonWrapper loading={initialLoading}>
              {/* TODO: Format numbers and translate */}
              <span className="g-text-xs">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
            </InlineSkeletonWrapper>
            <div className="g-flex g-flex-1 g-justify-end">
              {table.getCanNextPage() && (
                <FooterButton
                  onClick={table.nextPage}
                  icon={<MdChevronRight />}
                  toolTip={<span>Next</span>}
                />
              )}
            </div>
          </div>
        </div>
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
