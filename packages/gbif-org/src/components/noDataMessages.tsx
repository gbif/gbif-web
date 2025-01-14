import { FormattedMessage } from 'react-intl';
import { NoResultsImage } from './icons/icons';

type Props = {
  children?: React.ReactNode;
};

export function NoRecords({ children }: Props) {
  return (
    <div className="g-text-center g-my-8">
      <NoResultsImage className="-g-mt-8" />
      <h3 className="g-font-bold g-text-slate-400/80 -g-mt-8">
        <FormattedMessage id="phrases.noRecords" />
      </h3>
      {children}
    </div>
  );
}
