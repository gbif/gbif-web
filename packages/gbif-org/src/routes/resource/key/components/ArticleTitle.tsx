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
        'text-2xl sm:text-3xl inline-block font-extrabold text-slate-900 tracking-tight dark:text-slate-200',
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
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-4/6 h-8 mt-1" />
    </div>
  );
}
