import { CountProps, getCount } from '@/components/count';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
type CountTagProps = CountProps & {
  message?: string;
};

export function CountTag({
  v1Endpoint,
  params,
  message = 'counts.nRecords',
  property,
}: CountTagProps) {
  const { count } = getCount({ v1Endpoint, params, property });

  if (typeof count === 'number' && count > 0) {
    return <Tag>
    <FormattedMessage id={message} values={{ total: count }} />
  </Tag>
  }

  return false
}

export function Tag({ children, className }: { children: React.ReactNode, className?: string}) {
  return (
    <span className={cn('g-align-middle g-bg-slate-300/50 g-text-slate-800 g-text-xs g-font-medium g-px-2.5 g-py-0.5 g-m-1 g-mb-0 g-rounded', className)}>
      {children}
    </span>
  );
}