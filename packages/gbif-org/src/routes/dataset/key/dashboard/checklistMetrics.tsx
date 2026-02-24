import { useEffect, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/largeCard';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { prettifyEnum } from '@/components/filters/displayNames';
import { CardListSkeleton } from '@/components/skeletonLoaders';

interface DatasetMetrics {
  key?: number;
  datasetKey?: string;
  usagesCount?: number;
  synonymsCount?: number;
  distinctNamesCount?: number;
  nubMatchingCount?: number;
  colMatchingCount?: number;
  nubCoveragePct?: number;
  colCoveragePct?: number;
  countByKingdom?: Record<string, number>;
  countByRank?: Record<string, number>;
  countByOrigin?: Record<string, number>;
  countByIssue?: Record<string, number>;
  downloaded?: string;
}

interface ChecklistMetricsProps {
  datasetKey: string;
}

export function ChecklistMetrics({ datasetKey }: ChecklistMetricsProps) {
  const [metrics, setMetrics] = useState<DatasetMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${import.meta.env.PUBLIC_API_V1}/dataset/${datasetKey}/metrics`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.status}`);
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        console.error('Error fetching dataset metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    if (datasetKey) {
      fetchMetrics();
    }
  }, [datasetKey]);

  if (loading) {
    return <CardListSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="warning" className="g-mb-4">
        <AlertTitle>
          <FormattedMessage
            id="dataset.metricsTab.checklist.notAvailable"
            defaultMessage="Checklist metrics is not available for this dataset."
          />
        </AlertTitle>
      </Alert>
    );
  }

  if (!metrics) {
    return null;
  }

  // Sort entries by count (descending)
  const sortByCount = (obj?: Record<string, number>) => {
    if (!obj) return [];
    return Object.entries(obj).sort(([, a], [, b]) => b - a);
  };

  return (
    <>
      {/* Overview Card */}
      <Card className="g-mb-4">
        <CardHeader className="gbif-word-break">
          <CardTitle>
            <FormattedMessage
              id="dataset.metricsTab.checklist.overview"
              defaultMessage="Checklist Overview"
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage
              id="dataset.metricsTab.checklist.overviewDescription"
              defaultMessage="Summary statistics for this checklist dataset"
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="g-w-full g-max-w-full g-overflow-auto g-pb-2">
            <table className="gbif-table-style g-text-sm">
              <tbody>
                {metrics.usagesCount !== undefined && (
                  <tr className="hover:g-bg-slate-50">
                    <td className="g-font-medium">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.colCoveragePct"
                        defaultMessage="COL coverage"
                      />
                    </td>
                    <td className="g-text-end">
                      <FormattedNumber value={metrics.usagesCount} />
                    </td>
                  </tr>
                )}
                {metrics.distinctNamesCount !== undefined && (
                  <tr className="hover:g-bg-slate-50">
                    <td className="g-font-medium">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.distinctNamesCount"
                        defaultMessage="Distinct names"
                      />
                    </td>
                    <td className="g-text-end">
                      <FormattedNumber value={metrics.distinctNamesCount} />
                    </td>
                  </tr>
                )}
                {metrics.synonymsCount !== undefined && (
                  <tr className="hover:g-bg-slate-50">
                    <td className="g-font-medium">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.synonymsCount"
                        defaultMessage="Synonyms"
                      />
                    </td>
                    <td className="g-text-end">
                      <FormattedNumber value={metrics.synonymsCount} />
                    </td>
                  </tr>
                )}
                {metrics.nubMatchingCount !== undefined && (
                  <tr className="hover:g-bg-slate-50">
                    <td className="g-font-medium">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.nubMatchingCount"
                        defaultMessage="GBIF Backbone matches"
                      />
                    </td>
                    <td className="g-text-end">
                      <FormattedNumber value={metrics.nubMatchingCount} />
                    </td>
                  </tr>
                )}
                {metrics.nubCoveragePct !== undefined && (
                  <tr className="hover:g-bg-slate-50">
                    <td className="g-font-medium">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.nubCoveragePct"
                        defaultMessage="GBIF Backbone coverage"
                      />
                    </td>
                    <td className="g-text-end">
                      <FormattedNumber value={metrics.nubCoveragePct} />%
                    </td>
                  </tr>
                )}
                {metrics.colMatchingCount !== undefined && (
                  <tr className="hover:g-bg-slate-50">
                    <td className="g-font-medium">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.colMatchingCount"
                        defaultMessage="COL matches"
                      />
                    </td>
                    <td className="g-text-end">
                      <FormattedNumber value={metrics.colMatchingCount} />
                    </td>
                  </tr>
                )}
                {metrics.colCoveragePct !== undefined && (
                  <tr className="hover:g-bg-slate-50">
                    <td className="g-font-medium">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.colCoveragePct"
                        defaultMessage="COL coverage"
                      />
                    </td>
                    <td className="g-text-end">
                      <FormattedNumber value={metrics.colCoveragePct} />%
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Count by Kingdom */}
      {metrics.countByKingdom && Object.keys(metrics.countByKingdom).length > 0 && (
        <Card className="g-mb-4">
          <CardHeader className="gbif-word-break">
            <CardTitle>
              <FormattedMessage
                id="dataset.metricsTab.checklist.countByKingdom"
                defaultMessage="Count by Kingdom"
              />
            </CardTitle>
            <CardDescription>
              <FormattedMessage
                id="dataset.metricsTab.checklist.countByKingdomDescription"
                defaultMessage="Distribution of name usages across kingdoms"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="g-w-full g-max-w-full g-overflow-auto g-pb-2">
              <table className="gbif-table-style g-text-sm">
                <thead>
                  <tr>
                    <th className="g-min-w-48">
                      <FormattedMessage id="filters.kingdomKey.name" defaultMessage="Kingdom" />
                    </th>
                    <th className="g-text-end">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.count"
                        defaultMessage="Count"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortByCount(metrics.countByKingdom).map(([kingdom, count]) => (
                    <tr key={kingdom} className="hover:g-bg-slate-50">
                      <td>{prettifyEnum(kingdom)}</td>
                      <td className="g-text-end">
                        <FormattedNumber value={count} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Count by Rank */}
      {metrics.countByRank && Object.keys(metrics.countByRank).length > 0 && (
        <Card className="g-mb-4">
          <CardHeader className="gbif-word-break">
            <CardTitle>
              <FormattedMessage
                id="dataset.metricsTab.checklist.countByRank"
                defaultMessage="Count by Rank"
              />
            </CardTitle>
            <CardDescription>
              <FormattedMessage
                id="dataset.metricsTab.checklist.countByRankDescription"
                defaultMessage="Distribution of name usages across taxonomic ranks"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="g-w-full g-max-w-full g-overflow-auto g-pb-2">
              <table className="gbif-table-style g-text-sm">
                <thead>
                  <tr>
                    <th className="g-min-w-48">
                      <FormattedMessage id="filters.rank.name" defaultMessage="Rank" />
                    </th>
                    <th className="g-text-end">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.count"
                        defaultMessage="Count"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortByCount(metrics.countByRank).map(([rank, count]) => (
                    <tr key={rank} className="hover:g-bg-slate-50">
                      <td>
                        <FormattedMessage id={`enums.taxonRank.${rank}`} defaultMessage={rank} />
                      </td>
                      <td className="g-text-end">
                        <FormattedNumber value={count} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Count by Origin */}
      {metrics.countByOrigin && Object.keys(metrics.countByOrigin).length > 0 && (
        <Card className="g-mb-4">
          <CardHeader className="gbif-word-break">
            <CardTitle>
              <FormattedMessage
                id="dataset.metricsTab.checklist.countByOrigin"
                defaultMessage="Count by Origin"
              />
            </CardTitle>
            <CardDescription>
              <FormattedMessage
                id="dataset.metricsTab.checklist.countByOriginDescription"
                defaultMessage="Distribution of name usages by their origin"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="g-w-full g-max-w-full g-overflow-auto g-pb-2">
              <table className="gbif-table-style g-text-sm">
                <thead>
                  <tr>
                    <th className="g-min-w-48">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.origin"
                        defaultMessage="Origin"
                      />
                    </th>
                    <th className="g-text-end">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.count"
                        defaultMessage="Count"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortByCount(metrics.countByOrigin).map(([origin, count]) => (
                    <tr key={origin} className="hover:g-bg-slate-50">
                      <td>{prettifyEnum(origin)}</td>
                      <td className="g-text-end">
                        <FormattedNumber value={count} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Count by Issue */}
      {metrics.countByIssue && Object.keys(metrics.countByIssue).length > 0 && (
        <Card className="g-mb-4">
          <CardHeader className="gbif-word-break">
            <CardTitle>
              <FormattedMessage
                id="dataset.metricsTab.checklist.countByIssue"
                defaultMessage="Count by Issue"
              />
            </CardTitle>
            <CardDescription>
              <FormattedMessage
                id="dataset.metricsTab.checklist.countByIssueDescription"
                defaultMessage="Distribution of data quality issues"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="g-w-full g-max-w-full g-overflow-auto g-pb-2">
              <table className="gbif-table-style g-text-sm">
                <thead>
                  <tr>
                    <th className="">
                      <FormattedMessage id="occurrenceFieldNames.issue" defaultMessage="Issue" />
                    </th>
                    <th className="g-text-end">
                      <FormattedMessage
                        id="dataset.metricsTab.checklist.count"
                        defaultMessage="Count"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortByCount(metrics.countByIssue).map(([issue, count]) => (
                    <tr key={issue} className="hover:g-bg-slate-50">
                      <td>
                        <FormattedMessage
                          id={`enums.nameUsageIssue.${issue}`}
                          defaultMessage={issue}
                        />
                      </td>
                      <td className="g-text-end">
                        <FormattedNumber value={count} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
