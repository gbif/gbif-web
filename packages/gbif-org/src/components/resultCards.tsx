import { CountProps, getCount } from '@/components/count';
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

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium px-2.5 py-0.5 m-1 mb-0 rounded dark:bg-red-900 dark:text-red-300">
      {children}
    </span>
  );
}