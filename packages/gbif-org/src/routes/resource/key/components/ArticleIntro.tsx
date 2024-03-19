import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';

type Props = {
  dangerouslySetIntro?: { __html: string };
  children?: React.ReactNode;
  className?: string;
};

export function ArticleIntro({ dangerouslySetIntro, className, ...props }: Props) {
  return (
    <div
      className={cn('text-lg text-slate-600 dark:text-slate-300', className)}
      dangerouslySetInnerHTML={dangerouslySetIntro}
      {...props}
    />
  );
}

export function ArticleIntroSkeleton({ className }: Pick<Props, 'className'>) {
  return (
    <div className={className}>
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-5/6 h-6 mt-1" />
      <Skeleton className="w-2/6 h-6 mt-1" />
    </div>
  );
}
