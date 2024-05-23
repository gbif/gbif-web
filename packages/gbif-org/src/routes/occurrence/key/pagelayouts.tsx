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
    ? 'grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr]'
    : 'grid-cols-[1fr_300px] md:grid-cols-[1fr_350px]';
  return (
    <div className={cn('grid gap-x-4', sizes, className, stack ? 'grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1' : '')} {...props}>
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
    <aside className={cn('h-full', className)} {...props}>
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
    <div className={cn('sticky top-[var(--stickyOffset)]', className)} {...props}>
      {children}
    </div>
  );
}
