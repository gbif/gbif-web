import { cn } from '@/utils/shadcn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-slate-50', className)} {...props} />;
}

export { Skeleton };
