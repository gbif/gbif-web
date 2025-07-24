import * as React from 'react';

import { cn } from '@/utils/shadcn';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'g-rounded g-border g-border-solid g-border-slate-100 g-bg-card g-text-card-foreground g-scroll-mt-24 g-shadow-[0_10px_40px_-12px_rgba(0,0,0,0.1)]',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('g-flex g-flex-col g-space-y-1.5 g-p-4 md:g-p-8 g-scroll-mt-24', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('g-text-2xl g-font-semibold g-leading-none g-tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('g-text-sm g-text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  topPadding?: boolean;
  bottomPadding?: boolean;
};

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, topPadding = false, bottomPadding = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'g-p-4 md:g-p-8',
        { 'g-pt-0 md:g-pt-0': !topPadding, 'g-pb-0 md:g-pb-0': !bottomPadding },
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('g-flex g-items-center g-p-4 md:g-p-8 g-pt-0 md:g-pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
