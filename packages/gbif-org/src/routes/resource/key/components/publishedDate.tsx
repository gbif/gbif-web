import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';
import { FormattedDate, FormattedMessage } from 'react-intl';

type Props = {
  date: Date | string;
  className?: string;
};

export function PublishedDate({ date, className }: Props) {
  return (
    <p
      className={cn(
        'g-text-slate-500 dark:g-text-gray-400 g-mt-2 g-text-sm g-font-medium',
        className
      )}
    >
      <FormattedMessage id="cms.resource.published" /> <FormattedDate value={new Date(date)} />
    </p>
  );
}

export function PublishedDateSkeleton({ className }: Pick<Props, 'className'>) {
  return <Skeleton className={cn('g-w-32 g-h-6', className)} />;
}
