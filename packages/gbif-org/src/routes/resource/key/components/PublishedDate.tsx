import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';
import { FormattedDate, FormattedMessage } from 'react-intl';

type Props = {
  date: Date | string;
  className?: string;
};

export function PublishedDate({ date, className }: Props) {
  return (
    <p className={cn('text-slate-500 dark:text-gray-400 mt-2 text-sm font-medium', className)}>
      <FormattedMessage id="cms.resource.published" /> <FormattedDate value={new Date(date)} />
    </p>
  );
}

export function PublishedDateSkeleton({ className }: Pick<Props, 'className'>) {
  return <Skeleton className={cn('w-32 h-6', className)} />;
}
