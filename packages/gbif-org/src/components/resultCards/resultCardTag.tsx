import { cn } from '@/utils/shadcn';
import React from 'react';

type Props = {
  children: React.ReactElement;
  onClick?: () => void;
};

const baseClasses =
  'g-text-nowrap g-align-middle g-bg-slate-300/50 g-text-slate-800 g-text-xs g-font-medium g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300';

export function ResultCardTag({ children, onClick }: Props) {
  if (!onClick) return <span className={baseClasses}>{children}</span>;

  return (
    <button className={cn(baseClasses, 'hover:g-bg-primary-300')} onClick={onClick}>
      {children}
    </button>
  );
}
