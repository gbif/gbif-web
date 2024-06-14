import * as React from "react"
import { CheckIcon } from "@radix-ui/react-icons"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/utils/shadcn"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("g-grid g-gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "g-aspect-square g-h-4 g-w-4 g-rounded-full g-border g-border-primary g-text-primary g-shadow focus:g-outline-none focus-visible:g-ring-1 focus-visible:g-ring-ring disabled:g-cursor-not-allowed disabled:g-opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="g-flex g-items-center g-justify-center">
        <CheckIcon className="g-h-3.5 g-w-3.5 g-fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
