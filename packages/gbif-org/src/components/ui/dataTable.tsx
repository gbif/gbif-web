import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils/shadcn';
import { Skeleton } from './skeleton';
import { ConditionalWrapper } from '../conditionalWrapper';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';
import { useTablePagination } from '@/hooks/useTablePagination';
import { DynamicLink, useI18n } from '@/reactRouterPlugins';
import { MdChevronLeft, MdChevronRight, MdFirstPage } from 'react-icons/md';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  className?: string;
  loading: boolean;
  pageSize?: number;
  currentPageNumber?: number;
  totalPagesCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  loading,
  pageSize = 20,
  currentPageNumber,
  totalPagesCount,
}: DataTableProps<TData, TValue>) {
  const { locale } = useI18n();
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const { previousLink, nextLink, firstLink } = useTablePagination({ pageSize });

  return (
    <div className={cn('g-rounded-md g-border g-flex g-flex-col', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="g-sticky g-top-0 g-bg-white g-rounded-t-md box-shadow-b g-z-10"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isNoneEmptyArray(table.getRowModel().rows) ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="g-border-b"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <ConditionalWrapper
                      condition={loading}
                      wrapper={(children) => <Skeleton className="g-inline">{children}</Skeleton>}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </ConditionalWrapper>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <InitialSkeletonTable columns={columns} />
          )}
        </TableBody>
      </Table>
      <div className="g-flex g-justify-between g-items-center g-border-t g-px-2">
        <div className="g-flex g-flex-1">
          {firstLink && (
            <FooterButton to={firstLink} icon={<MdFirstPage />} toolTip={<span>First</span>} />
          )}
          {previousLink && (
            <FooterButton
              to={previousLink}
              icon={<MdChevronLeft />}
              toolTip={<span>Previous</span>}
            />
          )}
        </div>
        <ConditionalWrapper
          condition={loading}
          wrapper={(children) => <Skeleton className="g-inline">{children}</Skeleton>}
        >
          {/* TODO: Format numbers and translate */}
          <span className="g-text-xs">
            Page {currentPageNumber} of {totalPagesCount?.toLocaleString(locale.code)}
          </span>
        </ConditionalWrapper>
        <div className="g-flex g-flex-1 g-justify-end">
          {nextLink && (
            <FooterButton to={nextLink} icon={<MdChevronRight />} toolTip={<span>Next</span>} />
          )}
        </div>
      </div>
    </div>
  );
}

type SkeletonProps = {
  columns: ColumnDef<any, any>[];
};

function InitialSkeletonTable({ columns }: SkeletonProps) {
  return (
    <>
      {Array(20)
        .fill(null)
        .map((_, rowIdx) => (
          <TableRow key={rowIdx} className="g-border-b">
            {Array(columns.length)
              .fill(null)
              .map((_, colIdx) => (
                <TableCell key={`${rowIdx}-${colIdx}`} colSpan={1}>
                  <Skeleton className="g-h-6" />
                </TableCell>
              ))}
          </TableRow>
        ))}
    </>
  );
}

type FooterButtonProps = {
  to: string;
  icon: React.ReactNode;
  toolTip: React.ReactNode;
};

function FooterButton({ to, icon, toolTip }: FooterButtonProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <Button asChild variant="ghost" className="g-h-8 g-w-8 g-p-0">
            <DynamicLink to={to}>{icon}</DynamicLink>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{toolTip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
