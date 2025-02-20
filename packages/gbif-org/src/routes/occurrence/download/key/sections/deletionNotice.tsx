import { defaultDateFormatProps } from '@/components/headerComponents';
import { HyperText } from '@/components/hyperText';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download_Status, DownloadKeyQuery } from '@/gql/graphql';
import { FormattedMessage, useIntl } from 'react-intl';

export function DeletionNotice({ download }: { download: DownloadKeyQuery['download'] }) {
  const { formatMessage, formatDate } = useIntl();
  // if the download is not successful or does not have an eraseAfter date, return null
  if (!download || download.status !== Download_Status.Succeeded || !download.eraseAfter) {
    return null;
  }

  const downloadDeletionWarning = formatMessage(
    { id: 'downloadKey.downloadDeletionWarning' },
    { DATE: formatDate(download.eraseAfter, defaultDateFormatProps) }
  );

  const isUsersDownload = false; // TODO: check if the user is the creator of the download

  return (
    <Alert variant="warning" className="g-mb-4">
      <AlertDescription>
        <HyperText
          className="[&_a]:g-underline [&_a]:g-text-inherit"
          text={downloadDeletionWarning}
          sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }}
        />
        {isUsersDownload && (
          <div className="g-flex g-gap-8">
            <Button className="g-mt-2 g-flex-none" variant="outline">
              <FormattedMessage id="downloadKey.postpone" />
            </Button>
            <Button className="g-mt-2 g-flex-none" variant="outline">
              <FormattedMessage id="downloadKey.tellUs" />
            </Button>
            <div className="g-flex-grow"></div>
            <Button variant="destructive" className="g-mt-2 g-flex-none">
              <FormattedMessage id="downloadKey.deleteDownload" />
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
