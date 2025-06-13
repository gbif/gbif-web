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
      isNegated,
    }: {
      helpText?: string | React.ReactNode;
      checked?: boolean;
      children: React.ReactNode;
      onClick: (checked: boolean) => void;
      className?: string;
      onKeyDown?: (e: React.KeyboardEvent) => void;
      isNegated?: boolean;
    },
    ref
  ) => {
    // const Icon = checked ? MdOutlineRemoveCircle : MdOutlineAddCircle;
    return (
      <label className={cn('g-flex g-w-full g-cursor-pointer', className)}>
        <Checkbox
          ref={ref}
          className={cn(
            'g-flex-none g-me-2 g-mt-0.5',
            isNegated && 'data-[state=checked]:g-bg-orange-500 data-[state=checked]:g-text-white'
          )}
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
          {helpText && <div className="g-text-slate-500 g-text-sm">{helpText}</div>}
        </div>
      </label>
    );
  }
);

export function SkeletonOption({ className }: { className?: string }) {
  return (
    <div className={cn('g-flex g-flex-nowrap', className)}>
      <Skeleton className="g-w-none g-w-4 g-me-2 g-inline-block g-h-4"> </Skeleton>
      <Skeleton className="g-flex-auto g-w-24 g-inline-block g-h-4"> </Skeleton>
    </div>
  );
}
