import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { NetworkDatasetsQuery, NetworkDatasetsQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { usePartialDataNotification } from '@/routes/rootErrorPage';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

export function NetworkKeyDataset() {
  const { key } = useParams<{ key: string }>();
  const [offset, setOffset] = useIntParam({
    key: 'offset',
    defaultValue: 0,
    hideDefault: true,
    preventScrollReset: false,
  });

  const { data, error, load, loading } = useQuery<
    NetworkDatasetsQuery,
    NetworkDatasetsQueryVariables
  >(DATASET_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
  });
  const notifyOfPartialData = usePartialDataNotification();
  useEffect(() => {
    if (error && !data?.network?.constituents?.results) {
      throw error;
    } else if (error) {
      notifyOfPartialData();
    }
  }, [data, error, notifyOfPartialData]);

  useEffect(() => {
    // load datasets and refresh when pages change
    if (!key) return;

    load({
      variables: {
        network: key,
        limit: 25,
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

  const datasets = data?.network?.constituents;

  return (
    <PageContainer topPadded bottomPadded className="g-bg-slate-100">
      <ArticleTextContainer>
        {datasets?.count === 0 && (
          <>
            <NoRecords />
          </>
        )}
        {datasets && datasets.count > 0 && (
          <>
            <CardHeader id="datasets">
              <CardTitle>
                <FormattedMessage
                  id="counts.nParticipatingDatasets"
                  values={{ total: data?.network?.constituents?.count ?? 0 }}
                />
              </CardTitle>
            </CardHeader>
            {datasets &&
              datasets.results.map((item) => <DatasetResult key={item.key} dataset={item} />)}

            {datasets?.count && datasets?.count > datasets?.limit && (
              <PaginationFooter
                offset={datasets.offset}
                count={datasets.count}
                limit={datasets.limit}
                onChange={(x) => setOffset(x)}
              />
            )}
          </>
        )}
      </ArticleTextContainer>
    </PageContainer>
  );
}

const DATASET_QUERY = /* GraphQL */ `
  query NetworkDatasets($network: ID!, $limit: Int!, $offset: Int!) {
    network(key: $network) {
      constituents(limit: $limit, offset: $offset) {
        limit
        offset
        count
        endOfRecords
        results {
          ...DatasetResult
        }
      }
    }
  }
`;
