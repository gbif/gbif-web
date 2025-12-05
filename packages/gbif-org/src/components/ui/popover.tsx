import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '@/utils/shadcn';
import { getPortalContainer } from '@/utils/getPortalContainer';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, style, ...props }, ref) => (
  <PopoverPrimitive.Portal container={getPortalContainer()}>
    <div
      className="gbif"
      style={{
        background: '#00000012',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        style={{
          // in theory adding this would make the popover scrollable, but it doesn't work since then we cut of dropdowns within the popover as well
          // maxHeight: `var(--radix-popover-content-available-height)`,
          // overflow: "auto",
          ...style,
        }}
        className={cn(
          'g-z-50 g-rounded-md g-border g-border-solid g-bg-popover g-p-4 g-text-popover-foreground g-outline-none ',
          'gbif-small-scrollbar',
          className
        )}
        {...props}
      />
    </div>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverContent, PopoverTrigger };
