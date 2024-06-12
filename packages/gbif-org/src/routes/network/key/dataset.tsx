import { CardListSkeleton } from '@/components/skeletonLoaders';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NetworkDatasetsQuery, NetworkDatasetsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { PaginationFooter } from '@/components/pagination';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { NoRecords } from '@/components/noDataMessages';

export function NetworkKeyDataset() {
  const { key } = useParams<{ key: string }>();
  const [offset, setOffset] = useState(0);

  const { data, error, load, loading } = useQuery<
    NetworkDatasetsQuery,
    NetworkDatasetsQueryVariables
  >(DATASET_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

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
  }, [key, offset]);

  if (loading || !data)
    return (
      <ArticleContainer className="bg-slate-100">
        <ArticleTextContainer>
          <CardListSkeleton />
        </ArticleTextContainer>
      </ArticleContainer>
    );

  const datasets = data?.network?.constituents;

  return (
    <ArticleContainer className="bg-slate-100">
      <ArticleTextContainer>
        { datasets?.count === 0 && <>
          <NoRecords />
        </>}
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
                anchor="datasets"
              />
            )}
          </>
        )}
      </ArticleTextContainer>
    </ArticleContainer>
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
