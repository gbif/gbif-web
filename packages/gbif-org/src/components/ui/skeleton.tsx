import { cn } from '@/utils/shadcn';

export const skeletonClasses =
  'g-animate-pulse g-rounded-md g-bg-slate-900/10 g-text-transparent [&>*]:g-invisible';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn(skeletonClasses, className)} {...props} />;
}

export { Skeleton };
