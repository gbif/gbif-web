import * as React from "react"

import { cn } from "@/utils/shadcn"

const CardSmall = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded border bg-card text-card-foreground scroll-mt-24 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.1)]",
      className
    )}
    {...props}
  />
))
CardSmall.displayName = "CardSmall"

const CardHeaderSmall = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-0.5 p-2 md:p-4", className)}
    {...props}
  />
))
CardHeaderSmall.displayName = "CardHeader"

const CardTitleSmall = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-l font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitleSmall.displayName = "CardTitle"

const CardDescriptionSmall = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescriptionSmall.displayName = "CardDescription"

const CardContentSmall = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2 md:p-4 pt-0 md:pt-0", className)} {...props} />
))
CardContentSmall.displayName = "CardContent"

const CardFooterSmall = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-2 md:p-4 pt-0 md:pt-0", className)}
    {...props}
  />
))
CardFooterSmall.displayName = "CardFooter"

export { CardSmall, CardHeaderSmall, CardFooterSmall, CardTitleSmall, CardDescriptionSmall, CardContentSmall }
