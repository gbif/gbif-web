import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';

type Props = {
  children?: React.ReactNode;
  className?: string;
  dangerouslySetTitle?: { __html: string };
  testId?: string;
};

export function ArticleTitle({ dangerouslySetTitle, children, className, testId }: Props) {
  return (
    <h1
      data-cy={testId}
      className={cn(
        'g-text-2xl md:g-text-3xl lg:g-text-4xl g-inline-block g-font-extrabold g-text-slate-900 g-tracking-tight dark:g-text-slate-200',
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
      <Skeleton className="g-w-full g-h-8" />
      <Skeleton className="g-w-4/6 g-h-8 g-mt-1" />
    </div>
  );
}
