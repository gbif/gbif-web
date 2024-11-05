import { SimpleTooltip } from '@/components/simpleTooltip';
import React from 'react';

type Props = {
  value: null | undefined | React.ReactNode;
};

export function SetAsFilter({ value }: Props) {
  if (!value) return null;

  return (
    <SimpleTooltip title="Set as filter" side="right">
      <span
        // Buttons can't be displayed inline
        role="button"
        className="g-inline g-text-left hover:g-bg-primary-300 g-whitespace-normal g-box-decoration-clone g-p-0.5 -g-ml-0.5"
        // TODO: Open filter
        onClick={(e) => e.preventDefault()}
      >
        {value}
      </span>
    </SimpleTooltip>
  );
}
