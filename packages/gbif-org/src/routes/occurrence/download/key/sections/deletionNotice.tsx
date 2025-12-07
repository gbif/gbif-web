import { defaultDateFormatProps } from '@/components/headerComponents';
import { HyperText } from '@/components/hyperText';
import { JazzIcon } from '@/components/JazzIcon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Download_Status, DownloadKeyQuery, UsersDownloadKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export function DeletionNotice({
  download,
  userDownload,
}: {
  download: DownloadKeyQuery['download'];
  userDownload: UsersDownloadKeyQuery['download'];
}) {
  const { user } = useUser();
  const { formatMessage, formatDate } = useIntl();
  // if the download is not successful or does not have an eraseAfter date, return null
  if (!download || download.status !== Download_Status.Succeeded || !download.eraseAfter) {
    return null;
  }

  const isUsersDownload = user && userDownload?.request?.creator === user.userName;

  const downloadDeletionWarning = formatMessage(
    { id: 'downloadKey.downloadDeletionWarning' },
    { DATE: formatDate(download.eraseAfter, defaultDateFormatProps) }
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

  return <TrustedSection>{content}</TrustedSection>;
}

function Actions({ userDownload }: { userDownload: UsersDownloadKeyQuery['download'] }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPostponing, setIsPostponing] = useState(false);
  const { willBeDeletedSoon, readyForDeletion } = userDownload ?? {};
  const { deleteDownload, postponeDownloadDeletion } = useUser();
  const { translatedToast } = useToast();

  const handleDeleteDownload = async () => {
    if (isDeleting || !userDownload?.key) return;

    setIsDeleting(true);
    try {
      await deleteDownload(userDownload?.key);
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

    setIsPostponing(true);
    try {
      await postponeDownloadDeletion(userDownload?.key);
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

export function TrustedSection({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  if (!user) return null;
  return (
    <div className="g-flex g-gap-4 g-mb-8">
      <DynamicLink
        pageId="user-profile"
        className="g-w-16 g-h-16 g-flex-none g-rounded-full g-hidden md:g-block"
      >
        {user?.photo ? (
          <img
            src={user.photo}
            alt={`${user.firstName} ${user.lastName}`}
            className="g-w-full g-h-full g-object-cover g-rounded-lg"
          />
        ) : (
          <JazzIcon
            seed={user?.userName ?? user?.email ?? 'unknown'}
            className="g-rounded-lg g-block"
          />
        )}
      </DynamicLink>
      <div className="g-flex-grow">{children}</div>
    </div>
  );
}
