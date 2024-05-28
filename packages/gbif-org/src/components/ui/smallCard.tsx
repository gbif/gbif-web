import * as React from 'react';

import { cn } from '@/utils/shadcn';
import StripeLoader from '../StripeLoader';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { loading?: boolean; error?: boolean }
>(({ className, children, loading, error, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `rounded border bg-card text-card-foreground scroll-mt-24 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.1)] ${
        loading ? 'relative' : ''
      }`,
      className
    )}
    {...props}
  >
    {error && <CardContent className="p-2 md:p-4">
      <div className="flex items-center">
        <div
          style={{
            backgroundImage: 'url(https://graphql.gbif.org/images/error.svg)',
          }}
          className="hidden md:block flex-none w-32 h-32 bg-no-repeat bg-center bg-cover bg-contain"
        ></div>
        <div
        className="flex-auto flex flex-col px-2 md:px-4"
        >
          <h3 className="font-bold text-red-600 md:text-slate-800">Error</h3>
          <p className="text-slate-500">The card could not be loaded. Please try again later or report the issue.</p>
        </div>
      </div>
    </CardContent>}
    {loading && !error && (
      <div className="z-10 bg-white absolute text-center opacity-80 top-0 bottom-0 left-0 right-0">
        <StripeLoader active={true} />
      </div>
    )}
    {!error && children}
  </div>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-0.5 p-2 md:p-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn('text-l font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-2 md:p-4 pt-0 md:pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-2 md:p-4 pt-0 md:pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
