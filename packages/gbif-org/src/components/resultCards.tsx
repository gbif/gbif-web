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
    <span className={cn(`align-middle bg-slate-300/50 text-slate-800 text-xs font-medium px-2.5 py-0.5 m-1 mb-0 rounded`, className)}>
      {children}
    </span>
  );
}