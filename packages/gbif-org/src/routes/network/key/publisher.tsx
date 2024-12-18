import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { NetworkPublishersQuery, NetworkPublishersQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { PublisherResult } from '@/routes/publisher/publisherResult';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

export function NetworkKeyPublisher() {
  const { key } = useParams<{ key: string }>();
  const [offset, setOffset] = useState(0);

  const { data, error, load, loading } = useQuery<
    NetworkPublishersQuery,
    NetworkPublishersQueryVariables
  >(DATASET_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

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
  }, [key, offset]);

  if (loading || !data)
    return (
      <ArticleContainer className="g-bg-slate-100">
        <ArticleTextContainer>
          <CardListSkeleton />
        </ArticleTextContainer>
      </ArticleContainer>
    );

  const publishers = data?.network?.organizations;

  return (
    <ArticleContainer className="g-bg-slate-100">
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
                onChange={(x) => setOffset(x)}
                anchor="publishers"
              />
            )}
          </>
        )}
      </ArticleTextContainer>
    </ArticleContainer>
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
