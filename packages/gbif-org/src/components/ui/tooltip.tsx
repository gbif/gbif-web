import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'g-z-50 g-overflow-hidden g-rounded-md g-bg-slate-950 g-text-white dark:g-bg-slate-800 dark:g-text-white g-px-3 g-py-1.5 g-text-xs g-animate-in g-fade-in-0 g-zoom-in-95 data-[state=closed]:g-animate-out data-[state=closed]:g-fade-out-0 data-[state=closed]:g-zoom-out-95 data-[side=bottom]:g-slide-in-from-top-2 data-[side=left]:g-slide-in-from-right-2 data-[side=right]:g-slide-in-from-left-2 data-[side=top]:g-slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
