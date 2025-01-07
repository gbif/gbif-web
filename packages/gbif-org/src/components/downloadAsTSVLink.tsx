import { MdDownload } from 'react-icons/md';
import { Button } from './ui/button';
import { FormattedMessage } from 'react-intl';

type Props = {
  tsvUrl: string;
};

export function DownloadAsTSVLink({ tsvUrl }: Props) {
  return (
    <Button size="sm" className="g-p-0" variant="link" asChild>
      <a className="g-inline g-cursor-pointer hover:g-underline" href={tsvUrl}>
        <MdDownload size={16} />
        <span className="g-ml-1">
          <FormattedMessage id="phrases.downloadAsTsv" defaultMessage="Download as TSV" />
        </span>
      </a>
    </Button>
  );
}
