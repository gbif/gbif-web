import { cn } from '@/utils/shadcn';
import { memo } from 'react';

export const LineNumberGutter = memo(function LineNumberGutter({
  lineCount,
  className,
}: {
  lineCount: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'g-flex-none g-sticky g-start-0 g-ps-4 g-pe-3 g-text-end g-select-none g-text-slate-400 dark:g-text-slate-500',
        className
      )}
    >
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
});
