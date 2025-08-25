import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import { ResultCardTag } from './resultCardTag';

type Props = {
  title: React.ReactNode;
  link: string;
  contentType?: string;
};

export function ResultCardHeader({ title, link, contentType }: Props) {
  return (
    <ResultCardHeaderBasic messageId={contentType}>
      <DynamicLink to={link}>
        {title ?? (
          <span className="g-text-slate-400">
            <FormattedMessage id="error.unknown" />
          </span>
        )}
      </DynamicLink>
    </ResultCardHeaderBasic>
  );
}

export function ResultCardHeaderBasic({
  messageId,
  children,
}: {
  messageId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="g-flex g-items-start">
      <h3 className="g-flex-auto g-text-base g-font-semibold g-mb-2">{children}</h3>
      {messageId && (
        <ResultCardTag>
          <FormattedMessage id={messageId} />
        </ResultCardTag>
      )}
    </div>
  );
}
