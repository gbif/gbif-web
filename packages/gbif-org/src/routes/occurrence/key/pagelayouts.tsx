import { cn } from '@/utils/shadcn';
import { HTMLAttributes, ReactNode } from 'react';

export function SidebarLayout({
  children,
  className,
  reverse,
  stack,
  ...props
}: {
  children: ReactNode;
  reverse?: boolean;
  stack?: boolean;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const sizes = reverse
    ? 'grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)]'
    : 'grid-cols-[minmax(0,1fr)_300px] md:grid-cols-[minmax(0,1fr)_350px]';
  return (
    <div
      className={cn(
        'g-grid g-gap-x-4',
        sizes,
        className,
        stack
          ? 'g-grid-cols-1 sm:g-grid-cols-1 md:g-grid-cols-1 lg:g-grid-cols-1 xl:g-grid-cols-1'
          : ''
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Aside({
  children,
  className,
  ...props
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <aside className={cn('g-h-full', className)} {...props}>
      {children}
    </aside>
  );
}

export function AsideSticky({
  children,
  className,
  ...props
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('g-sticky g-top-[var(--stickyOffset)] g-pt-4 -g-mt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
