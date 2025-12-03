import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';
import { FormattedDate } from 'react-intl';

type Props = {
  children: React.ReactNode;
  clickable?: boolean;
  secondary?: React.ReactNode;
  className?: string;
};

export function ArticlePreTitle({ secondary, children, className, clickable }: Props) {
  return (
    <p
      className={cn(
        'g-flex g-items-center g-mt-2 g-mb-1 g-text-xs g-leading-6 g-font-semibold g-text-slate-700 g-uppercase',
        className
      )}
    >
      <Primary clickable={clickable}>{children}</Primary>{' '}
      {secondary && <Secondary>{secondary}</Secondary>}
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

function Primary({ children, clickable }: { children: React.ReactNode; clickable?: boolean }) {
  if (!clickable) {
    return <span>{children}</span>;
  }

  return (
    <span className="hover:g-text-[rgb(var(--preTitleSeparatorColor,var(--primary500)))]">
      {children}
    </span>
  );
}

function Secondary({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'g-ml-2 g-pl-2 g-border-l-2 g-border-l-[rgb(var(--preTitleSeparatorColor))] g-leading-4'
      )}
    >
      {children}
    </span>
  );
}

export function PreTitleDate({ date }: { date: Date | string }) {
  return <FormattedDate year="numeric" month="long" day="numeric" value={new Date(date)} />;
}
