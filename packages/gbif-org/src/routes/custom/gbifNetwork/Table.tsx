import { cn } from '@/utils/shadcn';
import React from 'react';
import { MdArrowDownward, MdArrowUpward, MdSort } from 'react-icons/md';

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
      className={cn('g-text-left g-whitespace-nowrap', className)}
      onClick={() => sortable && field && onSort && onSort(field)}
    >
      <div className="g-flex g-items-center g-gap-2">
        {children}
        {sortable && field && (
          <>
            {sortField === field ? (
              sortDirection === 'asc' ? (
                <MdArrowUpward className="g-h-4 g-w-4" />
              ) : (
                <MdArrowDownward className="g-h-4 g-w-4" />
              )
            ) : (
              <MdSort className="g-h-4 g-w-4 g-text-gray-400" />
            )}
          </>
        )}
      </div>
    </th>
  );
}
