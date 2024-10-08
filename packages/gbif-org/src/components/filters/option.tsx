import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';
import React from 'react';

export const Option = React.forwardRef(
  (
    {
      className,
      helpText,
      checked,
      onClick,
      children,
      onKeyDown,
    }: {
      helpText?: string;
      checked?: boolean;
      children: React.ReactNode;
      onClick: (checked: boolean) => void;
      className?: string;
      onKeyDown?: (e: React.KeyboardEvent) => void;
    },
    ref
  ) => {
    // const Icon = checked ? MdOutlineRemoveCircle : MdOutlineAddCircle;
    return (
      <label className={cn('g-flex g-w-full', className)}>
        <Checkbox
          ref={ref}
          className="g-flex-none g-me-2 g-mt-0.5"
          checked={checked}
          onClick={() => {
            onClick(!checked);
          }}
          onKeyDown={onKeyDown}
        />
        {/* <MdAddCircleOutline className="g-flex-none g-me-2 g-mt-1" /> */}
        {/* <Icon className="g-flex-none g-me-2 g-mt-1 g-text-primary-500" /> */}
        <div className="g-flex-auto g-overflow-hidden">
          <div className="">{children}</div>
          {helpText && <div className="g-text-slate-400 g-text-sm">{helpText}</div>}
        </div>
      </label>
    );
  }
);

export function SkeletonOption({className}: {className?: string}) {
  return (
    <div className={cn("g-flex g-flex-nowrap", className)}>
      <Skeleton className="g-w-none g-w-4 g-me-2 g-inline-block g-h-4"> </Skeleton>
      <Skeleton className="g-flex-auto g-w-24 g-inline-block g-h-4"> </Skeleton>
    </div>
  );
}
