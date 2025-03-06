import { SimpleTooltip } from '@/components/simpleTooltip';
import { useConfig } from '@/config/config';
import { AddFilterEvent } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import React from 'react';

type Props = {
  children: null | undefined | React.ReactNode;
  field: string;
  value: any;
  className?: string;
};

export function SetAsFilter({ children, field, value, className }: Props) {
  const { disableInlineTableFilterButtons } = useConfig();
  if (!children) return null;
  if (disableInlineTableFilterButtons) return <span className={className}>{children}</span>;

  return (
    <SimpleTooltip i18nKey="filterSupport.setFilter" side="right" asChild>
      <span
        // Buttons can't be displayed inline
        role="button"
        className={cn(
          'hover:g-bg-primary-300 hover:g-text-primaryContrast-400 g-box-decoration-clone g-p-0.5 -g-ml-0.5 g-pointer-events-auto',
          className
        )}
        onClick={() => window.dispatchEvent(new AddFilterEvent(field, value))}
      >
        {children}
      </span>
    </SimpleTooltip>
  );
}
