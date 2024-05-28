import { cn } from '@/utils/shadcn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn('animate-pulse rounded-md bg-slate-100 text-transparent', className)} {...props} />;
}

export { Skeleton };
