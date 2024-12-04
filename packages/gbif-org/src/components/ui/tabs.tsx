import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/utils/shadcn"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "g-inline-flex g-items-center  g-rounded-lg g-bg-muted g-p-1 g-text-muted-foreground g-flex-wrap",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "g-inline-flex g-items-center g-justify-center g-whitespace-nowrap g-rounded-md g-px-3 g-py-1 g-text-sm g-font-medium", 
      "g-ring-offset-background g-transition-all focus-visible:g-outline-none focus-visible:g-ring-2 focus-visible:g-ring-ring",
      "focus-visible:g-ring-offset-2 disabled:g-pointer-events-none disabled:g-opacity-50",
      "data-[state=active]:g-bg-white data-[state=active]:g-text-foreground data-[state=active]:g-shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "g-mt-2 g-ring-offset-background focus-visible:g-outline-none focus-visible:g-ring-2 focus-visible:g-ring-ring focus-visible:g-ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
