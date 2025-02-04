import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'g-peer g-h-4 g-w-4 g-shrink-0 g-border-2 g-rounded g-border-slate-300 focus-visible:g-outline-none focus-visible:g-ring-1 focus-visible:g-ring-ring disabled:g-cursor-not-allowed disabled:g-opacity-50 data-[state=checked]:g-border-none data-[state=checked]:g-bg-primary data-[state=checked]:g-text-primaryContrast-500',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('g-flex g-items-center g-justify-center g-text-current')}
    >
      <CheckIcon className="g-h-4 g-w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
