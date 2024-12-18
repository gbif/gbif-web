import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
};

export function ArticlePreTitle({ secondary, children, className }: Props) {
  return (
    <p
      className={cn(
        'g-mb-1 g-text-sm g-leading-6 g-font-semibold g-text-primary-500 dark:g-text-primary-400',
        className
      )}
    >
      {children}{' '}
      {secondary && <span className="g-text-slate-500 g-font-normal g-ml-2">{secondary}</span>}
    </p>
  );
}

export function ArticlePreTitleSkeleton({ className }: Pick<Props, 'className'>) {
  return (
    <div className={className}>
      <Skeleton className="g-w-10 g-h-4" />
    </div>
  );
}
