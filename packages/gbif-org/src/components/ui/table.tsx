import { DynamicLinkPresentation, LinkData } from '@/reactRouterPlugins/dynamicLink';
import { cn } from '@/utils/shadcn';
import * as React from 'react';

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
      'g-h-10 g-px-2 g-text-left g-align-middle g-font-medium g-text-muted-foreground g-border-r last:g-border-r-0',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { linkData?: LinkData }
>(({ className, linkData, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('g-p-2 last:g-border-r-0 g-border-r g-relative g-align-top', className)}
    {...props}
  >
    {linkData && (
      <DynamicLinkPresentation
        linkData={linkData}
        preventScrollReset={linkData.to?.includes('entity=')}
        className="g-absolute g-top-0 g-left-0 g-w-full g-h-full"
      />
    )}
    <div className="g-pointer-events-none g-relative">{children}</div>
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
