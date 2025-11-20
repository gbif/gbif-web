import { cn } from '@/utils/shadcn';
import React from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Skeleton } from './ui/skeleton';

interface SortableProps {
  sortable?: boolean;
  sortField?: string;
  field?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export function Th({
  children,
  className = '',
  sortable,
  sortField,
  field,
  sortDirection,
  onSort,
}: {
  children: React.ReactNode;
  className?: string;
} & SortableProps) {
  return (
    <th
      scope="col"
      className={cn('g-text-left g-whitespace-nowrap', { 'g-cursor-pointer': sortable }, className)}
      onClick={() => sortable && field && onSort && onSort(field)}
    >
      <div className="g-flex g-items-center g-gap-2">
        {children}
        {sortable && field && (
          <>
            {sortField === field ? (
              sortDirection === 'asc' ? (
                <FaCaretUp className="g-h-4 g-w-4" />
              ) : (
                <FaCaretDown className="g-h-4 g-w-4" />
              )
            ) : null}
          </>
        )}
      </div>
    </th>
  );
}

type TableProps = {
  children: React.ReactNode;
  className?: string;
};

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn('g-max-w-full g-m-auto', className)}>
      <div className="g-overflow-auto">
        <table className="g-w-full">{children}</table>
      </div>
    </div>
  );
}

type SkeletonBodyProps = {
  rows: number;
  columns: number;
};

export function SkeletonBody({ rows, columns }: SkeletonBodyProps) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: columns }).map((_, index) => (
            <td key={index}>
              <Skeleton className="g-w-4/5 g-h-4" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function MaybeList({ items }: { items: string[] }) {
  return items.length > 1 ? (
    <ul className="g-space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : (
    items[0]
  );
}
