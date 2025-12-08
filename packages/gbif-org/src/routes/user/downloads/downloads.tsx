import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useUser } from '@/contexts/UserContext';
import { UserDownloadsQuery, UserDownloadsQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { DownloadResult } from './downloadResult';

export function Downloads() {
  const [offset, setOffset] = useIntParam({
    key: 'offset',
    defaultValue: 0,
    hideDefault: true,
    preventScrollReset: false,
  });

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

  if (loading || !data || !user) return <CardListSkeleton />;

  const downloads = data?.userDownloads;

  return (
    <section>
      {downloads?.count === 0 && (
        <>
          <NoRecords messageId="profile.noDownloads" />
        </>
      )}
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
  }
`;
