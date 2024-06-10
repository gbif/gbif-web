import { cn } from '@/utils/shadcn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn('g-animate-pulse g-rounded-md g-bg-slate-100 g-text-transparent', className)} {...props} />;
}

export { Skeleton };
