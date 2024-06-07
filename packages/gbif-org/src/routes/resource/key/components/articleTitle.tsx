import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';

type Props = {
  children?: React.ReactNode;
  className?: string;
  dangerouslySetTitle?: { __html: string };
};

export function ArticleTitle({ dangerouslySetTitle, children, className }: Props) {
  return (
    <h1
      className={cn(
        'text-2xl md:text-3xl lg:text-4xl inline-block font-extrabold text-slate-900 tracking-tight dark:text-slate-200',
        className
      )}
    >
      {dangerouslySetTitle && <span dangerouslySetInnerHTML={dangerouslySetTitle} />}
      {children}
    </h1>
  );
}

export function ArticleTitleSkeleton({ className }: Pick<Props, 'className'>) {
  return (
    <div className={className}>
      <Skeleton className='g-w-full g-h-8' />
      <Skeleton className='g-w-4/6 g-h-8 g-mt-1' />
    </div>
  );
}
