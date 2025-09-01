import { MdDownload } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { BaseHeaderActionLink } from './baseHeaderActionLink';

type Props = {
  tsvUrl: string;
  className?: string;
};

export function DownloadAsTSVLink({ tsvUrl, className }: Props) {
  return (
    <BaseHeaderActionLink icon={MdDownload} url={tsvUrl} className={className}>
      <FormattedMessage id="phrases.downloadAsTsv" defaultMessage="Download as TSV" />
    </BaseHeaderActionLink>
  );
}
