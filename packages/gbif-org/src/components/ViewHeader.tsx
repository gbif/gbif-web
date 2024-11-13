import { FormattedMessage } from 'react-intl';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/utils/shadcn';

export const ViewHeader = ({
  children,
  total,
  loading,
  message,
  className,
  ...props
}: {
  children?: React.ReactNode;
  total?: number;
  loading?: boolean;
  message?: string;
  className?: string;
}) => {
  const showSkeleton = loading || typeof total !== 'number';

  return (
    <div className={cn('g-text-xs g-me-1 g-mb-1 g-text-slate-400', className)} {...props}>
      {showSkeleton && <Skeleton style={{ width: 100 }} />}
      {!showSkeleton && <FormattedMessage id={message || 'counts.nResults'} values={{ total }} />}
      {children}
    </div>
  );
};
