import { FormattedMessage } from 'react-intl';
import { NoResultsImage } from './icons/icons';
import { cn } from '@/utils/shadcn';

type Props = {
  children?: React.ReactNode;
  messageId?: string;
  className?: string;
};

export function NoRecords({ messageId, children, className }: Props) {
  return (
    <div className={cn('g-text-center g-my-8', className)}>
      <NoResultsImage className="-g-mt-8" />
      <h3 dir="auto" className="g-font-bold g-text-slate-400/80 -g-mt-8">
        <FormattedMessage id={messageId ?? 'phrases.noRecords'} />
      </h3>
      {children}
    </div>
  );
}
