import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { dir?: 'ltr' | 'rtl' }
>(({ className, value, dir, ...props }, ref) => {
  const offset = 100 - (value || 0);
  const transform = dir === 'rtl' ? `translateX(${offset}%)` : `translateX(-${offset}%)`;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      dir={dir}
      className={cn('g-relative g-h-2 g-overflow-hidden g-rounded g-bg-primary/20', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="g-h-full g-w-full g-flex-1 g-bg-primary g-transition-all"
        style={{ transform }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
