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
      className={cn('g-text-lg g-text-slate-600 dark:g-text-slate-300', className)}
      dangerouslySetInnerHTML={dangerouslySetIntro}
      {...props}
    />
  );
}

export function ArticleIntroSkeleton({ className }: Pick<Props, 'className'>) {
  return (
    <div className={className}>
      <Skeleton className='g-w-full g-h-6' />
      <Skeleton className='g-w-5/6 g-h-6 g-mt-1' />
      <Skeleton className='g-w-2/6 g-h-6 g-mt-1' />
    </div>
  );
}
