"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/shadcn"

const toggleVariants = cva(
  "g-border-e last:g-border-none g-bg-gray-200 g-bg-white disabled:g-opacity-50 data-[state=on]:g-bg-accent data-[state=on]:g-text-accent-foreground first:g-rounded-s last:g-rounded-e g-px-4 g-py-2 g-text-sm g-font-medium g-text-gray-900 hover:g-bg-gray-100 hover:g-text-blue-700 focus:g-z-10 focus:g-ring-2 focus:g-ring-blue-700 focus:g-text-blue-700 dark:g-bg-gray-800 dark:g-border-gray-700 dark:g-text-white dark:hover:g-text-white dark:hover:g-bg-gray-700 dark:focus:g-ring-blue-500 dark:g-focus:text-white",
  {
    variants: {
      variant: {
        default: "g-bg-transparent",
        primary: "data-[state=on]:g-border-primary-600 data-[state=on]:g-bg-primary-500 data-[state=on]:g-text-primaryContrast-500 hover:g-bg-primary-50 hover:g-text-primaryContrast-100"
      },
      size: {
        default: "g-h-9 g-px-2 g-min-w-9",
        sm: "g-h-8 g-px-1.5 g-min-w-8",
        lg: "g-h-10 g-px-2.5 g-min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
