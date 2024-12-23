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
    <SimpleTooltip i18nKey="filterSupport.setFilter" side="right" asChild>
      <span
        // Buttons can't be displayed inline
        role="button"
        className={cn(
          'hover:g-bg-primary-300 g-box-decoration-clone g-p-0.5 -g-ml-0.5 g-pointer-events-auto',
          className
        )}
        onClick={() => add(field, value)}
      >
        {children}
      </span>
    </SimpleTooltip>
  );
}
