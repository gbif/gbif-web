import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Download_Status } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';

export function NotReadyDownload({
  status,
  notificationAddresses,
}: {
  status: Download_Status;
  notificationAddresses?: string[];
}) {
  notificationAddresses = notificationAddresses || ['sdf'];
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
                  <Button variant="destructive">
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
