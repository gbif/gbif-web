import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'g-peer g-inline-flex g-h-5 g-w-9 g-shrink-0 g-cursor-pointer g-items-center g-rounded-full g-border-2 g-border-transparent g-shadow-sm g-transition-colors g-focus-visible:g-outline-none g-focus-visible:g-ring-2 g-focus-visible:g-ring-ring g-focus-visible:g-ring-offset-2 g-focus-visible:g-ring-offset-background g-disabled:g-cursor-not-allowed g-disabled:g-opacity-50 data-[state=checked]:g-bg-primary data-[state=unchecked]:g-bg-input',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'g-pointer-events-none g-block g-h-4 g-w-4 g-rounded-full g-bg-background g-shadow-lg g-ring-0 g-transition-transform data-[state=checked]:g-translate-x-4 data-[state=unchecked]:g-translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
