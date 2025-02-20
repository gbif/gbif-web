import { MdDownload } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { BaseHeaderActionLink } from './baseHeaderActionLink';

type Props = {
  tsvUrl: string;
};

export function DownloadAsTSVLink({ tsvUrl }: Props) {
  return (
    <BaseHeaderActionLink icon={MdDownload} url={tsvUrl}>
      <FormattedMessage id="phrases.downloadAsTsv" defaultMessage="Download as TSV" />
    </BaseHeaderActionLink>
  );
}
