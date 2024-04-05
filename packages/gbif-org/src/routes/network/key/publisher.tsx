import { CardListSkeleton } from '@/components/skeletonLoaders';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NetworkPublishersQuery, NetworkPublishersQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { PaginationFooter } from '@/components/pagination';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { NoRecords } from '@/components/noDataMessages';
import { PublisherResult } from '@/routes/publisher/publisherResult';

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
      <ArticleContainer className="bg-slate-100">
        <ArticleTextContainer>
          <CardListSkeleton />
        </ArticleTextContainer>
      </ArticleContainer>
    );

  const publishers = data?.network?.organizations;

  return (
    <ArticleContainer className="bg-slate-100">
      <ArticleTextContainer>
        { publishers?.count === 0 && <>
          <NoRecords />
        </>}
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
