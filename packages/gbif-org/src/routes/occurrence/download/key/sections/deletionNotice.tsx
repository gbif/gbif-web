import { longDateFormatProps } from '@/components/dateFormats';
import { HyperText } from '@/components/hyperText';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UserAvatarSection } from '@/components/userAvatarSection';
import { useUser } from '@/contexts/UserContext';
import { Download_Status, UsersDownloadKeyQuery } from '@/gql/graphql';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Download } from '../downloadKey';

export function DeletionNotice({
  download,
  userDownload,
}: {
  download: Download;
  userDownload: UsersDownloadKeyQuery['download'];
}) {
  const { user } = useUser();
  const { formatMessage, formatDate } = useIntl();
  const eraseAfter = userDownload?.eraseAfter ?? download.eraseAfter;
  // if the download is not successful or does not have an eraseAfter date, return null
  if (download.status !== Download_Status.Succeeded || !eraseAfter) {
    return null;
  }

  const isUsersDownload = user && userDownload?.request?.creator === user.userName;

  const downloadDeletionWarning = formatMessage(
    { id: 'downloadKey.downloadDeletionWarning' },
    { DATE: formatDate(eraseAfter, longDateFormatProps) }
  );

  const content = (
    <Alert variant="warning" className="g-mb-4">
      <AlertDescription>
        <HyperText
          className="[&_a]:g-underline [&_a]:g-text-inherit"
          text={downloadDeletionWarning}
          sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }}
        />
        {isUsersDownload && <Actions userDownload={userDownload} />}
      </AlertDescription>
    </Alert>
  );

  if (!isUsersDownload) return content;

  return <UserAvatarSection>{content}</UserAvatarSection>;
}

function Actions({ userDownload }: { userDownload: UsersDownloadKeyQuery['download'] }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPostponing, setIsPostponing] = useState(false);
  const { willBeDeletedSoon, readyForDeletion } = userDownload ?? {};
  const { deleteDownload, postponeDownloadDeletion } = useUser();
  const { translatedToast } = useToast();

  const handleDeleteDownload = async () => {
    if (isDeleting || !userDownload?.key) return;
    const type = userDownload.request?.type || 'OCCURRENCE';

    setIsDeleting(true);
    try {
      await deleteDownload(userDownload?.key, type);
      window.location.reload();
    } catch (error) {
      translatedToast({
        titleKey: 'error.genericRequestFailed',
        descriptionKey: 'error.genericDescription',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePostponeDeletion = async () => {
    if (isPostponing || !userDownload?.key) return;
    const type = userDownload.request?.type || 'OCCURRENCE';

    setIsPostponing(true);
    try {
      await postponeDownloadDeletion(userDownload?.key, type);
      window.location.reload();
    } catch (error) {
      translatedToast({
        titleKey: 'error.genericRequestFailed',
        descriptionKey: 'error.genericDescription',
        variant: 'destructive',
      });
    } finally {
      setIsPostponing(false);
    }
  };

  return (
    <div className="md:g-flex g-gap-2">
      {willBeDeletedSoon && (
        <Button
          onClick={handlePostponeDeletion}
          disabled={isPostponing}
          className="g-mt-2 g-flex-none g-w-full md:g-w-auto"
          variant="outline"
        >
          <FormattedMessage id="downloadKey.postpone" />
        </Button>
      )}
      {/* TODO: we should add https://github.com/gbif/gbif-web/issues/1312 */}
      {/* <Button className="g-mt-2 g-flex-none g-w-full md:g-w-auto" variant="outline">
        <FormattedMessage id="downloadKey.tellUs" />
      </Button> */}
      <div className="g-flex-grow"></div>
      {!readyForDeletion && (
        <Button
          onClick={handleDeleteDownload}
          disabled={isDeleting}
          variant="destructive"
          className="g-mt-2 g-flex-none g-w-full md:g-w-auto"
        >
          <FormattedMessage id="downloadKey.deleteDownload" />
        </Button>
      )}
    </div>
  );
}
