import { PaginationFooter } from '@/components/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { DownloadKeyDatasetsQuery, DownloadKeyDatasetsQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { notNull } from '@/utils/notNull';
import { useEffect, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

const OCCURRENCE_DATASET_QUERY = /* GraphQL */ `
  query DownloadKeyDatasets($key: ID!, $limit: Int, $offset: Int) {
    datasetsByDownload(key: $key, limit: $limit, offset: $offset) {
      limit
      offset
      endOfRecords
      count
      results {
        datasetKey
        datasetTitle
        numberRecords
      }
    }
  }
`;

const EVENT_DATASET_QUERY = /* GraphQL */ `
  query EventDownloadKeyDatasets($key: ID!, $limit: Int, $offset: Int) {
    datasetsByEventDownload(key: $key, limit: $limit, offset: $offset) {
      limit
      offset
      endOfRecords
      count
      results {
        datasetKey
        datasetTitle
        numberRecords
      }
    }
  }
`;

type DatasetListResult = NonNullable<DownloadKeyDatasetsQuery['datasetsByDownload']>;

function SkeletonTable({ rows, columns }: { rows: number; columns: number }) {
  return (
    <table className="g-w-full g-text-sm g-text-left rtl:g-text-right g-text-gray-500 dark:g-text-gray-400">
      <thead className="g-text-slate-500 g-font-light g-bg-gray-50 dark:g-bg-gray-700 dark:g-text-gray-400 g-border-b">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="g-px-4 md:g-px-8 g-py-3 g-font-normal">
              <Skeleton className="g-w-12">&nbsp;</Skeleton>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr
            key={i}
            className="g-bg-white g-border-b last:g-border-0 dark:g-bg-gray-800 dark:g-border-gray-700"
          >
            {Array.from({ length: columns }).map((_, j) => (
              <td key={j} className="g-px-4 md:g-px-8 g-py-3">
                <Skeleton className="g-w-24">&nbsp;</Skeleton>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export type DatasetTableProps = {
  downloadKey: string;
  initialDatasets: DatasetListResult['results'];
  limit: number;
  count: number;
};

function DatasetTableCore({
  downloadKey,
  initialDatasets,
  limit: initialLimit,
  count: initialCount,
  query,
  extractResults,
}: DatasetTableProps & {
  query: string;
  extractResults: (data: Record<string, DatasetListResult | null | undefined>) => DatasetListResult | null | undefined;
}) {
  const [offset, setOffset] = useIntParam({ key: 'offset', defaultValue: 0, hideDefault: true });
  const [limit] = useState(initialLimit);
  const { data, load, loading } = useQuery<
    Record<string, DatasetListResult | null | undefined>,
    DownloadKeyDatasetsQueryVariables
  >(query, { lazyLoad: true, throwAllErrors: true });

  useEffect(() => {
    load({ variables: { key: downloadKey, limit, offset } });
  }, [downloadKey, load, limit, offset]);

  if (loading) {
    return <SkeletonTable rows={5} columns={2} />;
  }

  const pageData = data ? extractResults(data) : undefined;
  if (initialDatasets.length === 0) return null;

  const datasets = (pageData?.results ?? initialDatasets).filter(notNull);

  return (
    <>
      <table className="g-w-full g-text-sm g-text-left rtl:g-text-right g-text-gray-500 dark:g-text-gray-400">
        <thead className="g-text-slate-500 g-font-light g-bg-gray-50 dark:g-bg-gray-700 dark:g-text-gray-400 g-border-b">
          <tr>
            <th scope="col" className="g-px-4 md:g-px-8 g-py-3 g-font-normal">
              <FormattedMessage id="downloadKey.title" />
            </th>
            <th
              scope="col"
              className="g-px-4 md:g-px-8 g-py-3 g-font-normal g-text-right rtl:g-text-left"
            >
              <FormattedMessage id="downloadKey.records" />
            </th>
          </tr>
        </thead>
        <tbody>
          {datasets?.map((dataset) => {
            return (
              <tr
                key={dataset.datasetKey}
                className="g-bg-white g-border-b last:g-border-0 dark:g-bg-gray-800 dark:g-border-gray-700"
              >
                <td
                  scope="row"
                  className="g-px-4 md:g-px-8 g-py-3 g-font-medium g-text-slate-900 dark:g-text-white g-min-w-80"
                >
                  <DynamicLink
                    className="g-underline"
                    to={`/dataset/${dataset.datasetKey}`}
                    pageId="datasetKey"
                    variables={{ key: dataset.datasetKey }}
                  >
                    {dataset.datasetTitle}
                  </DynamicLink>{' '}
                </td>
                <td className="g-px-4 md:g-px-8 g-py-3 g-text-right rtl:g-text-left">
                  <FormattedNumber value={dataset?.numberRecords} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {initialCount > limit && (
        <PaginationFooter
          offset={offset || 0}
          count={initialCount}
          limit={limit || 0}
          onChange={(x) => setOffset(x)}
        />
      )}
    </>
  );
}

export function DatasetTable(props: DatasetTableProps) {
  return (
    <DatasetTableCore
      {...props}
      query={OCCURRENCE_DATASET_QUERY}
      extractResults={(d) => d?.datasetsByDownload}
    />
  );
}

export function EventDatasetTable(props: DatasetTableProps) {
  return (
    <DatasetTableCore
      {...props}
      query={EVENT_DATASET_QUERY}
      extractResults={(d) => d?.datasetsByEventDownload}
    />
  );
}
