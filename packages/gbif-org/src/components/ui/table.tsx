import * as React from 'react';
import { cn } from '@/utils/shadcn';
import { DynamicLink } from '@/reactRouterPlugins';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn('g-w-full g-caption-bottom g-text-sm', className)} {...props} />
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <thead ref={ref} className={className} {...props} />);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('g-overflow-y-auto', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('g-bg-primary g-font-medium g-text-primary-foreground', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('g-transition-colors data-[state=selected]:g-bg-muted', className)}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'g-h-10 g-px-2 g-text-left g-align-middle g-font-medium g-text-muted-foreground [&:has([role=checkbox])]:g-pr-0 [&>[role=checkbox]]:g-translate-y-[2px] g-border-r last:g-border-r-0',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { to?: string }
>(({ className, to, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      {
        'g-p-2 g-align-middle': !to,
      },
      'g-border-r [&:has([role=checkbox])]:g-pr-0 [&>[role=checkbox]]:g-translate-y-[2px]',
      className
    )}
    {...props}
  >
    {!to ? (
      children
    ) : (
      <DynamicLink className="g-p-2 g-flex g-h-full g-items-center" to={to}>
        {children}
      </DynamicLink>
    )}
  </td>
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('g-mt-4 g-text-sm g-text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
