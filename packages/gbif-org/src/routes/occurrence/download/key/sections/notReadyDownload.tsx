import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Download_Status } from '@/gql/graphql';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export function NotReadyDownload({
  status,
  notificationAddresses,
  downloadKey,
}: {
  status: Download_Status;
  notificationAddresses?: string[] | null;
  downloadKey?: string | null;
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const { translatedToast } = useToast();
  const { cancelDownload } = useUser();

  const handleCancelDownload = async () => {
    if (isCancelling || !downloadKey) return;

    setIsCancelling(true);
    try {
      await cancelDownload(downloadKey);
      window.location.reload();
    } catch (error) {
      translatedToast({
        titleKey: 'error.genericRequestFailed',
        descriptionKey: 'error.genericDescription',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  let Message = <FormattedMessage id={`downloadKey.downloadKilled`} />;
  let variant = 'destructive';
  if (status === 'FAILED' || status === 'KILLED') {
    Message = <FormattedMessage id={`downloadKey.downloadKilled`} />;
  } else if (status === 'CANCELLED') {
    Message = <FormattedMessage id={`downloadKey.downloadCancelled`} />;
  } else if (status === 'SUSPENDED') {
    Message = <FormattedMessage id={`downloadKey.downloadSuspended`} />;
    variant = 'warning';
  } else if (status === 'PREPARING' || status === 'RUNNING') {
    return (
      <>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id={`downloadKey.downloadStarted`} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div>
              <FormattedMessage id={`downloadKey.downloadExpectTime`} />
            </div>
            {notificationAddresses && notificationAddresses.length > 0 && (
              <div className="g-mt-2">
                <FormattedMessage id={`downloadKey.notificationEmailAddresses`} />
                {notificationAddresses?.map((email, index) => (
                  <span key={index} className="g-mx-2">
                    {email}
                  </span>
                ))}
                <div className="g-mt-8">
                  <Button
                    variant="destructive"
                    onClick={handleCancelDownload}
                    disabled={isCancelling}
                    className="g-mt-2 g-flex-none g-w-full md:g-w-auto"
                  >
                    <FormattedMessage id="downloadKey.cancel" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <Alert variant={variant} className="g-mb-4">
        <AlertDescription>{Message}</AlertDescription>
      </Alert>
    </>
  );
}

/*
possible states
[
// changing
"PREPARING",
"RUNNING",
"SUSPENDED",
// final
"SUCCEEDED",
"KILLED",
"FAILED",
"CANCELLED",
"FILE_ERASED" // i guess this means succeeded and then later deleted
]
*/
