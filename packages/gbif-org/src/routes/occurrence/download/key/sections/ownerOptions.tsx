import { JazzIcon } from '@/components/JazzIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/largeCard';
import { useUser } from '@/contexts/UserContext';
import { DownloadKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';

export function OwnerOptions({
  download,
  creator,
}: {
  download: DownloadKeyQuery['download'];
  creator?: string | null;
}) {
  const { user } = useUser();
  if (!user || creator !== user.userName) {
    return null;
  }
  if (download?.status !== 'SUCCEEDED' && !download?.eraseAfter) {
    return null;
  }
  return (
    <div className="g-flex g-gap-4">
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
          <JazzIcon seed={user?.userName || user.email} className="g-rounded-lg g-block" />
        )}
      </DynamicLink>
      <div className="g-flex-grow">
        <Card className="g-mb-4">
          <CardContent className="g-p-4 md:g-p-8">
            <div>
              <FormattedMessage id="downloadKey.downloadDeletionWarning" />
              <FormattedMessage id="downloadKey.aboutDeletionPolicy" />
              <div>
                Unless GBIF discovers citations of this download, the data file is eligible for
                deletion after June 19, 2025. Read more about our deletion policy.
              </div>
              {download.status !== 'FILE_ERASED' && (
                <div className="g-flex g-gap-4 g-mt-4 g-items-center">
                  <Button variant="destructive" className="g-mt-4">
                    <FormattedMessage id="downloadKey.deleteDownload" />
                  </Button>
                  <Button variant="destructive" className="g-mt-4">
                    <FormattedMessage id="downloadKey.deleteDownload" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
