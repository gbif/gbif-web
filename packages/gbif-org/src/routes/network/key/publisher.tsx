import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { NetworkPublishersQuery, NetworkPublishersQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { PublisherResult } from '@/routes/publisher/publisherResult';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

export function NetworkKeyPublisher() {
  const { key } = useParams<{ key: string }>();
  const [offset, setOffset] = useIntParam({ key: 'offset', defaultValue: 0, hideDefault: true });

  const { data, load, loading } = useQuery<NetworkPublishersQuery, NetworkPublishersQueryVariables>(
    DATASET_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    // load publishers and refresh when pages change
    if (!key) return;

    load({
      variables: {
        network: key,
        limit: 20,
        offset,
      },
    });
  }, [key, offset, load]);

  if (loading || !data)
    return (
      <PageContainer topPadded bottomPadded className="g-bg-slate-100">
        <ArticleTextContainer>
          <CardListSkeleton />
        </ArticleTextContainer>
      </PageContainer>
    );

  const publishers = data?.network?.organizations;

  return (
    <PageContainer topPadded bottomPadded className="g-bg-slate-100">
      <ArticleTextContainer>
        {publishers?.count === 0 && (
          <>
            <NoRecords />
          </>
        )}
        {publishers && publishers.count > 0 && (
          <>
            <CardHeader id="publishers">
              <CardTitle>
                <FormattedMessage
                  id="counts.nParticipatingPublishers"
                  values={{ total: data?.network?.organizations?.count ?? 0 }}
                />
              </CardTitle>
            </CardHeader>
            {publishers &&
              publishers.results.map((item) => <PublisherResult key={item.key} publisher={item} />)}

            {publishers?.count && publishers?.count > publishers?.limit && (
              <PaginationFooter
                offset={publishers.offset}
                count={publishers.count}
                limit={publishers.limit}
                onChange={(x) => {
                  setOffset(x);
                }}
              />
            )}
          </>
        )}
      </ArticleTextContainer>
    </PageContainer>
  );
}

const DATASET_QUERY = /* GraphQL */ `
  query NetworkPublishers($network: ID!, $limit: Int!, $offset: Int!) {
    network(key: $network) {
      organizations(limit: $limit, offset: $offset) {
        limit
        count
        offset
        results {
          key
          title
          created
          country
          logoUrl
          excerpt
        }
      }
    }
  }
`;
