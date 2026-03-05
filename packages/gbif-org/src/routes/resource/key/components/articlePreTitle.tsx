import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';
import { LongDate } from '@/components/dateFormats';

type Props = {
  children: React.ReactNode;
  clickable?: boolean;
  secondary?: React.ReactNode;
  className?: string;
};

export function ArticlePreTitle({ secondary, children, className, clickable = false }: Props) {
  return (
    <p className={cn('g-flex g-items-center g-mt-2 g-mb-1 g-text-sm g-leading-6', className)}>
      <Primary clickable={clickable}>{children}</Primary>{' '}
      {secondary && (
        <>
          <Separator />
          <Secondary>{secondary}</Secondary>
        </>
      )}
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
  return (
    <span
      className={cn('g-text-primary-500 g-font-semibold', clickable && 'hover:g-text-primary-700')}
    >
      {children}
    </span>
  );
}

function Secondary({ children }: { children: React.ReactNode }) {
  return <span className="g-text-slate-500 g-font-medium">{children}</span>;
}

function Separator() {
  return (
    <span className="g-mx-2 g-block g-h-4 g-w-0.5 g-bg-[rgb(var(--preTitleSeparatorColor,_148_163_184))]" />
  );
}

export function PreTitleDate({ date }: { date: Date | string }) {
  return <LongDate value={date} />;
}
