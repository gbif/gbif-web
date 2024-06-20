import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/utils/shadcn"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <div className="gbif">
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      style={{maxWidth: 'calc(100vw'}}
      className={cn('g-z-50 g-rounded-md g-border g-bg-popover g-p-4 g-text-popover-foreground g-shadow-md g-outline-none data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-fade-out-0 data-[state=open]:g-fade-in-0 data-[state=closed]:g-zoom-out-95 data-[state=open]:g-zoom-in-95 data-[side=bottom]:g-slide-in-from-top-2 data-[side=left]:g-slide-in-from-right-2 data-[side=right]:g-slide-in-from-left-2 data-[side=top]:g-slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
    </div>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
