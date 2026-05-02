import { Button } from '@/components/ui/button';
import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useUser } from '@/contexts/UserContext';
import { UserDownloadsQuery, UserDownloadsQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { DownloadResult } from './downloadResult';

type DownloadType = 'occurrences' | 'events';

export function Downloads() {
  const [offset, setOffset] = useIntParam({
    key: 'offset',
    defaultValue: 0,
    hideDefault: true,
    preventScrollReset: false,
  });

  const [downloadType, setDownloadType] = useState<DownloadType | null>(null);

  const { user } = useUser();
  const { data, load, loading } = useQuery<UserDownloadsQuery, UserDownloadsQueryVariables>(
    DOWNLOADS_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    const username = user?.userName;
    if (!username || !user?.graphqlToken) {
      return;
    }
    load(
      {
        variables: {
          username,
          limit: 20,
          offset,
        },
      },
      { authorization: `Bearer ${user?.graphqlToken}` }
    );
  }, [offset, load, user?.graphqlToken, user?.userName]);

  // Set default type once data is available for the first time
  useEffect(() => {
    if (!data || downloadType !== null) return;
    const occurrenceCount = data.userDownloads?.count ?? 0;
    setDownloadType(occurrenceCount > 0 ? 'occurrences' : 'events');
  }, [data, downloadType]);

  if (loading || !data || !user || downloadType === null) return <CardListSkeleton />;

  const occurrenceDownloads = data.userDownloads;
  const eventDownloads = data.userEventDownloads;
  const downloads = downloadType === 'occurrences' ? occurrenceDownloads : eventDownloads;

  function handleTypeSelect(value: string | null) {
    const next: DownloadType = value === 'events' ? 'events' : 'occurrences';
    if (next !== downloadType) {
      setDownloadType(next);
      setOffset(0);
    }
  }

  return (
    <section>
      {(eventDownloads?.count ?? 0) > 0 && (
        <div className="g-flex g-flex-wrap g-gap-2 g-mb-4">
          <Button
            variant={downloadType === 'occurrences' ? 'default' : 'primaryOutline'}
            onClick={() => handleTypeSelect('occurrences')}
          >
            <FormattedMessage id="downloadType.occurrences" defaultMessage="Occurrences" />
          </Button>
          <Button
            variant={downloadType === 'events' ? 'default' : 'primaryOutline'}
            onClick={() => handleTypeSelect('events')}
          >
            <FormattedMessage id="downloadType.events" defaultMessage="Events" />
          </Button>
        </div>
      )}
      {downloads?.count === 0 && <NoRecords messageId="profile.noDownloads" />}
      {downloads && downloads.count > 0 && (
        <>
          <CardHeader id="downloads">
            <CardTitle>
              <FormattedMessage id="counts.nDownloads" values={{ total: downloads.count }} />
            </CardTitle>
          </CardHeader>
          {downloads.results.map((download) => (
            <DownloadResult key={download.key} download={download} />
          ))}
          {downloads.count > downloads.limit && (
            <PaginationFooter
              offset={downloads.offset}
              count={downloads.count}
              limit={downloads.limit}
              onChange={(x) => setOffset(x)}
            />
          )}
        </>
      )}
    </section>
  );
}

const DOWNLOADS_QUERY = /* GraphQL */ `
  query UserDownloads($username: String!, $limit: Int!, $offset: Int!) {
    userDownloads(username: $username, limit: $limit, offset: $offset) {
      limit
      offset
      count
      endOfRecords
      results {
        ...DownloadResult
      }
    }
    userEventDownloads(username: $username, limit: $limit, offset: $offset) {
      limit
      offset
      count
      endOfRecords
      results {
        ...DownloadResult
      }
    }
  }
`;
