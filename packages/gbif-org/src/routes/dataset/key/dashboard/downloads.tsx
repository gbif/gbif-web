import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useUser } from '@/contexts/UserContext';
import { DatasetDownloadsQuery, DatasetDownloadsQueryVariables, DatasetQuery } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { DownloadResult } from '@/routes/user/downloads/downloadResult';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDatasetKeyLoaderData } from '..';
import { DownloadAsTSVLink } from '@/components/cardHeaderActions/downloadAsTSVLink';

export function Downloads() {
  const { data: parentData } = useDatasetKeyLoaderData() as { data: DatasetQuery };
  const dataset = parentData?.dataset;
  const datasetKey = dataset?.key;
  const [offset, setOffset] = useIntParam({
    key: 'offset',
    defaultValue: 0,
    hideDefault: true,
    preventScrollReset: false,
  });

  const { data, load, loading } = useQuery<DatasetDownloadsQuery, DatasetDownloadsQueryVariables>(
    DOWNLOADS_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    if (!datasetKey) {
      return;
    }
    load({
      variables: {
        datasetKey,
        limit: 20,
        offset,
      },
    });
  }, [offset, load, datasetKey]);

  if (loading || !data) return <CardListSkeleton />;

  const downloads = data?.datasetDownloads;

  return (
    <section>
      {downloads?.count === 0 && (
        <>
          <NoRecords messageId="dataset.noDownloads" />
        </>
      )}
      {downloads && downloads.count > 0 && (
        <>
          <CardHeader
            id="downloads"
            className="g-flex-col md:g-flex-row g-items-start md:g-items-center g-justify-between"
          >
            <CardTitle>
              <FormattedMessage id="counts.nDownloads" values={{ total: downloads.count }} />
            </CardTitle>
            <DownloadAsTSVLink
              tsvUrl={`${
                import.meta.env.PUBLIC_API_V1
              }/occurrence/download/statistics/export?datasetKey=${datasetKey}`}
            />
          </CardHeader>

          {downloads.results.map((download) => (
            <div>
              <div className="g-text-end g-mb-2 g-text-sm g-text-slate-600">
                <FormattedMessage
                  id="dataset.nFromDataset"
                  values={{ total: download?.numberRecords || 0 }}
                />
              </div>
              <DownloadResult key={download?.download?.key} download={download?.download} />
            </div>
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
  query DatasetDownloads($datasetKey: ID!, $limit: Int, $offset: Int) {
    datasetDownloads(datasetKey: $datasetKey, limit: $limit, offset: $offset) {
      limit
      offset
      count
      endOfRecords
      results {
        numberRecords
        download {
          ...DownloadResult
        }
      }
    }
  }
`;
