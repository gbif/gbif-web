import { SimpleTooltip } from '@/components/simpleTooltip';
import { FilterContext } from '@/contexts/filter';
import React, { useContext } from 'react';

type Props = {
  filterIsActive: boolean;
  children: null | undefined | React.ReactNode;
  field: string;
  value: any;
};

export function SetAsFilter({ filterIsActive, children, field, value }: Props) {
  const { add } = useContext(FilterContext);
  if (!children) return null;
  if (!filterIsActive) return <>{children}</>;

  return (
    <SimpleTooltip title="filterSupport.setFilter" side="right">
      <span
        // Buttons can't be displayed inline
        role="button"
        className="g-inline g-text-left hover:g-bg-primary-300 g-whitespace-normal g-box-decoration-clone g-p-0.5 -g-ml-0.5"
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
