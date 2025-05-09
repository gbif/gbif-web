import * as React from 'react';

import { cn } from '@/utils/shadcn';
import StripeLoader from '../stripeLoader';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { loading?: boolean; error?: boolean }
>(({ className, children, loading, error, style }, ref) => (
  <div
    ref={ref}
    className={cn(
      `g-rounded g-border g-border-slate-100 g-bg-card g-text-card-foreground g-scroll-mt-24 g-shadow-[0_10px_40px_-12px_rgba(0,0,0,0.1)] ${
        loading ? 'g-relative' : ''
      }`,
      className
    )}
    style={style}
  >
    {error && (
      <CardContent className="g-p-2 md:g-p-4">
        <div className="g-flex g-items-center">
          <div
            style={{
              backgroundImage: 'url(https://graphql.gbif.org/images/error.svg)',
            }}
            className="g-hidden md:g-block g-flex-none g-w-32 g-h-32 g-bg-no-repeat g-bg-center g-bg-contain"
          ></div>
          <div className="g-flex-auto g-flex g-flex-col g-px-2 md:g-px-4">
            <h3 className="g-font-bold g-text-red-600 md:g-text-slate-800">Error</h3>
            <p className="g-text-slate-500">
              The card could not be loaded. Please try again later or report the issue.
            </p>
          </div>
        </div>
      </CardContent>
    )}
    {loading && !error && (
      <div className="g-z-10 g-bg-white g-absolute g-text-center g-opacity-80 g-top-0 g-bottom-0 g-left-0 g-right-0">
        <StripeLoader active={true} />
      </div>
    )}
    {!error && children}
  </div>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('g-flex g-flex-col g-space-y-0.5 g-p-2 md:g-p-4', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn('g-text-base g-font-semibold g-leading-none g-tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('g-text-sm g-text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  topPadding?: boolean;
};

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, topPadding = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('g-p-2 md:g-p-4', { 'g-pt-0 md:g-pt-0': !topPadding }, className)}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('g-flex g-items-center g-p-2 md:g-p-4 g-pt-0 md:g-pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
