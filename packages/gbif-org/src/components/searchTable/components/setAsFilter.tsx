import { SimpleTooltip } from '@/components/simpleTooltip';
import { FilterContext } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import React, { useContext } from 'react';

type Props = {
  filterIsActive: boolean;
  children: null | undefined | React.ReactNode;
  field: string;
  value: any;
  className?: string;
};

export function SetAsFilter({ filterIsActive, children, field, value, className }: Props) {
  const { add } = useContext(FilterContext);
  if (!children) return null;
  if (!filterIsActive) return <span className={className}>{children}</span>;

  return (
    <SimpleTooltip title="filterSupport.setFilter" side="right">
      <span
        // Buttons can't be displayed inline
        role="button"
        className={cn(
          'g-inline g-text-left hover:g-bg-primary-300 g-whitespace-normal g-box-decoration-clone g-p-0.5 -g-ml-0.5',
          className
        )}
        onClick={(e) => {
          // Prevent links that span an entire cell from being triggered
          e.preventDefault();
          add(field, value);
        }}
      >
        {children}
      </span>
    </SimpleTooltip>
  );
}
