import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import { ResultCardTag } from './resultCardTag';

type Props = {
  title: React.ReactNode;
  link: string;
  contentType: string;
};

export function ResultCardHeader({ title, link, contentType }: Props) {
  return (
    <div className="g-flex g-items-start">
      <h3 className="g-flex-auto g-text-base g-font-semibold g-mb-2">
        <DynamicLink to={link}>{title}</DynamicLink>
      </h3>
      <ResultCardTag>
        <FormattedMessage id={`cms.contentType.${contentType}`} />
      </ResultCardTag>
    </div>
  );
}
