import { useIsElementHorizontallyScrolled } from '@/hooks/useIsElementHorizontallyScrolled';
import { Filters } from '@/routes/occurrence/search/filters';
import { cn } from '@/utils/shadcn';
import { memo, useEffect, useMemo, useRef } from 'react';
import { ColumnDef } from '.';
import { Table } from '../ui/table';
import Body from './components/body/body';
import { Footer } from './components/footer/footer';
import Header from './components/header/header';
import { useColumnVisibility } from './hooks/useColumnVisibility';
import { useFirstColumLock } from './hooks/useFirstColumLock';
import { useOrderedColumns } from './hooks/useOrderedColumns';
import { PaginationState } from './hooks/usePaginationState';
import { CreateRowLink } from './hooks/useRowLink';

interface Props<T> {
  columns: ColumnDef<T>[];
  data: T[];
  className?: string;
  loading: boolean;
  rowCount?: number;
  paginationState: PaginationState;
  setPaginationState: React.Dispatch<React.SetStateAction<PaginationState>>;
  availableTableColumns: string[];
  defaultEnabledTableColumns: string[];
  lockColumnLocalStoreKey?: string;
  selectedColumnsLocalStoreKey?: string;
  keySelector(item: T): string;
  createRowLink?: CreateRowLink<T>;
  filters?: Filters;
  hideColumnVisibilityDropdown?: boolean;
}

export default memo(SearchTable) as typeof SearchTable;
function SearchTable<T>({
  columns,
  data,
  className,
  loading,
  rowCount,
  paginationState,
  setPaginationState,
  availableTableColumns,
  defaultEnabledTableColumns,
  keySelector,
  lockColumnLocalStoreKey = 'searchTableLockColumn',
  selectedColumnsLocalStoreKey = 'selectedColumnsLocalStoreKey',
  createRowLink,
  filters,
  hideColumnVisibilityDropdown = false,
}: Props<T>) {
  const { visibleColumns, resetColumnVisibility, toggleColumnVisibility } = useColumnVisibility({
    selectedColumnsLocalStoreKey,
    defaultEnabledTableColumns,
    availableTableColumns,
  });

  const orderedColumns = useOrderedColumns({
    columns,
    availableTableColumns,
  });

  const filteredColumns = useMemo(
    () => orderedColumns.filter((col) => visibleColumns.has(col.id)),
    [orderedColumns, visibleColumns]
  );

  const { firstColumnIsLocked, setFirstColumnIsLocked, hideFirstColumnLock } =
    useFirstColumLock(lockColumnLocalStoreKey);

  // Scroll to the top of the table when pagination.pageIndex changes
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tableWrapperRef.current) {
      tableWrapperRef.current.scrollTop = 0;
    }
  }, [data]);

  const isHorizontallyScrolled = useIsElementHorizontallyScrolled(tableWrapperRef);

  return (
    <div
      className={cn('g-bg-white g-flex-1 g-border g-basis-full g-h-1 g-flex g-flex-col', className)}
    >
      <div
        ref={tableWrapperRef}
        className="g-relative g-w-full g-overflow-auto g-h-full g-bg-slate-50"
      >
        {/* https://limebrains.com/blog/2021-03-02T13:00-heigh-100-inside-table-td/ */}
        {/* Without this 1px height the a tags in the table cells won't be able to match the height of the td with height: 100% */}
        <Table className="g-h-1">
          <Header
            filters={filters}
            filteredColumns={filteredColumns}
            orderedColumns={orderedColumns}
            isHorizontallyScrolled={isHorizontallyScrolled}
            firstColumnIsLocked={firstColumnIsLocked}
            hideFirstColumnLock={hideFirstColumnLock}
            setFirstColumnIsLocked={setFirstColumnIsLocked}
            hideColumnVisibilityDropdown={hideColumnVisibilityDropdown}
            resetColumnVisibility={resetColumnVisibility}
            toggleColumnVisibility={toggleColumnVisibility}
            visibleColumns={visibleColumns}
          />
          <Body
            items={data}
            loading={loading}
            filteredColumns={filteredColumns}
            isHorizontallyScrolled={isHorizontallyScrolled}
            firstColumnIsLocked={firstColumnIsLocked}
            keySelector={keySelector}
            createRowLink={createRowLink}
          />
        </Table>
      </div>
      <Footer
        loading={loading}
        paginationState={paginationState}
        setPaginationState={setPaginationState}
        rowCount={rowCount}
      />
    </div>
  );
}

export function SearchTableServerFallback() {
  return <div className="g-bg-white g-flex-1 g-border g-basis-full g-h-1 g-flex g-flex-col" />;
}
