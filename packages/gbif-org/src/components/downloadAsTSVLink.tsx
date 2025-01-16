import { MdDownload } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

type Props = {
  tsvUrl: string;
};

export function DownloadAsTSVLink({ tsvUrl }: Props) {
  return (
    <a
      className="g-text-sm g-inline g-cursor-pointer hover:g-underline g-text-inherit"
      href={tsvUrl}
    >
      <MdDownload size={16} />
      <span className="g-ml-1">
        <FormattedMessage id="phrases.downloadAsTsv" defaultMessage="Download as TSV" />
      </span>
    </a>
  );
}
