import { MdOutlineRssFeed } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { BaseHeaderActionLink } from './baseHeaderActionLink';

type Props = {
  rssUrl: string;
};

export function RssLink({ rssUrl }: Props) {
  return (
    <BaseHeaderActionLink icon={MdOutlineRssFeed} url={rssUrl}>
      {/* TODO translate */}
      <FormattedMessage id="phrases.rss" defaultMessage="RSS" />
    </BaseHeaderActionLink>
  );
}
