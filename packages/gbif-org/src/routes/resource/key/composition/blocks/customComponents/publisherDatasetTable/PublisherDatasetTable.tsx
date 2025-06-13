// this file was 99% written by an AI agent. I'm pressed for time and have only glanced at it. It looks reasonalbe and visually it does what i expect.
import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { PublisherDatasetTableQuery, PublisherDatasetTableQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { FormattedMessage, FormattedNumber } from 'react-intl';

const PUBLISHER_DATASET_TABLE_QUERY = /* GraphQL */ `
  query PublisherDatasetTable(
    $machineTagNamespace: String
    $machineTagName: String
    $country: Country
    $limit: Int
    $offset: Int
  ) {
    datasetList(
      machineTagNamespace: $machineTagNamespace
      machineTagName: $machineTagName
      limit: $limit
      offset: $offset
      country: $country
    ) {
      count
      offset
      limit
      results {
        key
        title
        publishingOrganization {
          title
          country
        }
        excerpt
        occurrenceCount
        literatureCount
        machineTags(namespace: $machineTagNamespace, name: $machineTagName) {
          name
          value
        }
      }
    }
    organizationSearch(
      machineTagNamespace: $machineTagNamespace
      machineTagName: $machineTagName
      limit: $limit
      offset: $offset
      country: $country
    ) {
      count
      offset
      limit
      results {
        key
        title
        excerpt
        country
        numPublishedDatasets
        occurrenceCount
        literatureCount
        machineTags(namespace: $machineTagNamespace, name: $machineTagName) {
          name
          value
        }
      }
    }
  }
`;

interface TableColumn {
  type: string;
  title: string;
  name?: string;
}

interface SummaryColumn {
  type: string;
  title: string;
}

interface TableSettings {
  machineTagNamespace?: string;
  machineTagName?: string;
  country?: string;
  limit?: number;
  tableStyle?: string;
  columns?: TableColumn[];
  summaryColumns?: SummaryColumn[];
  summaryTitle?: string;
  valueTranslations?: Record<string, string>;
}

interface TableRow {
  key: string;
  title?: string;
  excerpt?: string;
  country?: string;
  type: 'dataset' | 'organization';
  url: string;
  datasetCount: number;
  occurrenceCount?: number;
  literatureCount?: number;
  machineTags?: Array<{ name?: string; value?: string }>;
}

interface SummaryCounts {
  rowCount: number;
  datasetCount: number;
  occurrenceCount: number;
  literatureCount: number;
}

function sortRows(rows: TableRow[], sortKey: string | null, sortDir: 'asc' | 'desc'): TableRow[] {
  if (!sortKey) return rows;
  return [...rows].sort((a, b) => {
    let aValue: any = a[sortKey as keyof TableRow];
    let bValue: any = b[sortKey as keyof TableRow];

    // Handle machine tags specially
    if (sortKey === 'machineTags') {
      aValue = a.machineTags?.[0]?.value || '';
      bValue = b.machineTags?.[0]?.value || '';
    }

    // Numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Strings
    aValue = (aValue || '').toString().toLowerCase();
    bValue = (bValue || '').toString().toLowerCase();
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

// Map column types to TableRow property keys for sorting
const columnTypeToSortKey: Record<string, keyof TableRow> = {
  TITLE: 'title',
  COUNTRY: 'country',
  DATASET_COUNT: 'datasetCount',
  OCCURRENCE_COUNT: 'occurrenceCount',
  LITERATURE_COUNT: 'literatureCount',
  NAMESPACE: 'machineTags',
  // Add more mappings if needed
};

export function PublisherDatasetTable({
  settings,
  title,
  className,
}: {
  settings?: TableSettings;
  title?: string;
  className?: string;
}) {
  const { data, error, loading, load } = useQuery<
    PublisherDatasetTableQuery,
    PublisherDatasetTableQueryVariables
  >(PUBLISHER_DATASET_TABLE_QUERY, { lazyLoad: true });

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const config = settings || {};
  const limit = config.limit || 20;
  const offset = (currentPage - 1) * limit;

  useEffect(() => {
    load({
      variables: {
        machineTagNamespace: config.machineTagNamespace,
        machineTagName: config.machineTagName,
        country: config.country as any,
        limit,
        offset,
      },
    });
  }, [load, config.machineTagNamespace, config.machineTagName, config.country, limit, offset]);

  const isLoading = loading || (!data && !error);

  if (error) {
    return (
      <div className="g-prose">
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  // Combine datasets and organizations into unified structure
  const datasets: TableRow[] = (data?.datasetSearch?.results || []).map((d) => ({
    key: d.key,
    title: d.title,
    excerpt: d.excerpt,
    country: d.publishingOrganization?.country,
    type: 'dataset' as const,
    url: `/dataset/${d.key}`,
    datasetCount: 1,
    occurrenceCount: d.occurrenceCount,
    literatureCount: d.literatureCount,
    machineTags: d.machineTags,
  }));

  const organizations: TableRow[] = (data?.organizationSearch?.results || []).map((o) => ({
    key: o.key,
    title: o.title,
    excerpt: o.excerpt,
    country: o.country,
    type: 'organization' as const,
    url: `/publisher/${o.key}`,
    datasetCount: o.numPublishedDatasets || 0,
    occurrenceCount: o.occurrenceCount,
    literatureCount: o.literatureCount,
    machineTags: o.machineTags,
  }));

  const allResults = [...datasets, ...organizations].sort((a, b) =>
    (a.title || '').localeCompare(b.title || '')
  );

  const sortedResults = sortRows(allResults, sortKey, sortDir);

  const totalCount = (data?.datasetSearch?.count || 0) + (data?.organizationSearch?.count || 0);
  const maxCount = Math.max(data?.datasetSearch?.count || 0, data?.organizationSearch?.count || 0);

  // Calculate summary counts
  const summaryCounts: SummaryCounts = {
    rowCount: allResults.length,
    datasetCount: allResults.reduce((sum, row) => sum + row.datasetCount, 0),
    occurrenceCount: allResults.reduce((sum, row) => sum + (row.occurrenceCount || 0), 0),
    literatureCount: allResults.reduce((sum, row) => sum + (row.literatureCount || 0), 0),
  };

  const translatedValue = (value: string) => {
    return config.valueTranslations?.[value] || value;
  };

  function handleSort(columnType: string) {
    const mappedSortKey = columnTypeToSortKey[columnType];
    if (!mappedSortKey) return; // Do not sort if mapping is not defined
    if (sortKey === mappedSortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(mappedSortKey);
      setSortDir('asc');
    }
  }

  const renderCellContent = (row: TableRow, column: TableColumn) => {
    switch (column.type) {
      case 'TITLE':
        return (
          <DynamicLink
            pageId={row.type === 'dataset' ? 'datasetKey' : 'publisherKey'}
            variables={{ key: row.key }}
            className="g-underline"
          >
            {row.title}
          </DynamicLink>
        );
      case 'COUNTRY':
        return (
          <FormattedMessage id={`enums.countryCode.${row.country}`} defaultMessage={row.country} />
        );
      case 'DATASET_COUNT':
        return (
          <div className="g-text-right">
            <FormattedNumber value={row.datasetCount} />
          </div>
        );
      case 'OCCURRENCE_COUNT':
        return (
          <div className="g-text-right">
            <FormattedNumber value={row.occurrenceCount || 0} />
          </div>
        );
      case 'LITERATURE_COUNT':
        return (
          <div className="g-text-right">
            <FormattedNumber value={row.literatureCount || 0} />
          </div>
        );
      case 'NAMESPACE':
        return row.machineTags?.map((tag, index) => (
          <span key={index} className="g-mr-1">
            {translatedValue(tag.value || '')}
          </span>
        ));
      default:
        return null;
    }
  };

  const renderSummaryCell = (column: SummaryColumn) => {
    switch (column.type) {
      case 'ROWS':
        return <FormattedNumber value={summaryCounts.rowCount} />;
      case 'DATASET_COUNT':
        return <FormattedNumber value={summaryCounts.datasetCount} />;
      case 'OCCURRENCE_COUNT':
        return <FormattedNumber value={summaryCounts.occurrenceCount} />;
      case 'LITERATURE_COUNT':
        return <FormattedNumber value={summaryCounts.literatureCount} />;
      default:
        return null;
    }
  };

  const totalPages = Math.ceil(maxCount / limit);

  return (
    <div className={cn('g-max-w-full g-m-auto', className)}>
      {/* Summary Table */}
      {config.summaryColumns && config.summaryColumns.length > 0 && !isLoading && (
        <div className="g-mb-10">
          {config.summaryTitle && (
            <h4 className="g-text-lg g-font-semibold g-mb-4">{config.summaryTitle}</h4>
          )}
          <Card>
            <div className="g-overflow-auto">
              <table className="g-w-full g-text-sm">
                <thead className="g-shadow-sm">
                  <tr>
                    {config.summaryColumns.map((col, index) => (
                      <th
                        key={index}
                        className="g-p-4 g-text-left g-whitespace-nowrap g-text-right"
                        style={{ width: `${100 / config.summaryColumns!.length}%` }}
                      >
                        {col.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="g-font-bold">
                    {config.summaryColumns.map((col, index) => (
                      <td
                        key={index}
                        className="g-p-4 g-text-right"
                        style={{ width: `${100 / config.summaryColumns!.length}%` }}
                      >
                        {renderSummaryCell(col)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Main Table */}
      {!isLoading && (
        <>
          {title && <h4 className="g-text-lg g-font-semibold g-mb-4">{title}</h4>}
          <Card>
            <div
              className="g-overflow-auto"
              style={config.tableStyle ? { ...JSON.parse(`{${config.tableStyle}}`) } : {}}
            >
              <table className="g-w-full g-text-sm">
                <thead className="g-sticky g-top-0 g-bg-white g-shadow-sm g-z-10">
                  <tr>
                    {config.columns?.map((col, index) => (
                      <th
                        key={index}
                        className="g-p-4 g-text-left g-whitespace-nowrap g-cursor-pointer hover:g-bg-gray-100"
                        onClick={() => handleSort(col.type)}
                      >
                        <span className="g-inline-block g-text-nowrap">
                          <span>{col.title}</span>
                          {sortKey === columnTypeToSortKey[col.type] && (
                            <span className="g-ml-1">
                              {sortDir === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((row) => (
                    <tr
                      key={row.key}
                      className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900"
                    >
                      {config.columns?.map((col, index) => (
                        <td key={index} className="g-p-4">
                          {renderCellContent(row, col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {maxCount > limit && (
            <div className="g-flex g-justify-center g-mt-4">
              <div className="g-flex g-items-center g-space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="g-px-3 g-py-1 g-border g-rounded g-disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="g-px-3 g-py-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="g-px-3 g-py-1 g-border g-rounded g-disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <div className="g-overflow-auto">
            <table className="g-w-full g-text-sm">
              <thead className="g-bg-gray-50">
                <tr>
                  {config.columns?.map((col, index) => (
                    <th key={index} className="g-p-4 g-text-left g-whitespace-nowrap">
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="g-border-t g-border-gray-100">
                    {config.columns?.map((col, colIndex) => (
                      <td key={colIndex} className="g-p-4">
                        <Skeleton className="g-w-32 g-h-4">Loading</Skeleton>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && allResults.length === 0 && (
        <div className="g-prose">
          <p>No results found.</p>
        </div>
      )}
    </div>
  );
}
