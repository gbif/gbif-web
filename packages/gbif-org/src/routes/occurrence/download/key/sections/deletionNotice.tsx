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

  return (
    <div className="g-flex g-gap-4 g-mb-8">
      {isUsersDownload && (
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
      )}
      <div className="g-flex-grow">
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
      </div>
    </div>
  );
}

function Actions({ userDownload }: { userDownload: UsersDownloadKeyQuery['download'] }) {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPostponing, setIsPostponing] = useState(false);
  const { willBeDeletedSoon, readyForDeletion } = userDownload ?? {};
  const { deleteDownload, postponeDownloadDeletion } = useUser();
  const toast = useToast();

  const messages = {
    error: intl.formatMessage({
      id: 'downloadKey.error',
      defaultMessage: 'Error.',
    }),
    deletionFailed: intl.formatMessage({
      id: 'downloadKey.deletionFailed',
      defaultMessage: 'Failed to delete download. Please try again later.',
    }),
  };

  const handleDeleteDownload = async () => {
    if (isDeleting || !userDownload?.key) return;

    setIsDeleting(true);
    try {
      await deleteDownload(userDownload?.key);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete download:', error);
      toast.toast({
        title: messages.error,
        description: messages.deletionFailed,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePostponeDeletion = async () => {
    if (isPostponing) return;

    setIsPostponing(true);
    try {
      await postponeDownloadDeletion(userDownload?.key);
      window.location.reload();
    } catch (error) {
      console.error('Failed to postpone deletion:', error);
      toast.toast({
        title: messages.error,
        description: messages.deletionFailed,
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
      <Button className="g-mt-2 g-flex-none g-w-full md:g-w-auto" variant="outline">
        <FormattedMessage id="downloadKey.tellUs" />
      </Button>
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
