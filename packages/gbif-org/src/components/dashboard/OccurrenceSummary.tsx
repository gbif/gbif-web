import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import { FormattedMessage } from 'react-intl';
import { useDeepCompareEffectNoCheck as useDeepCompareEffect } from 'use-deep-compare-effect';
import { ErrorBoundary } from '../ErrorBoundary';
import { Card, CardContent, CardTitle } from '../ui/smallCard';
import { CardHeader, FormattedNumber, Table } from './shared';

type OccurrenceStatsResponse = {
  occurrenceSearch?: {
    documents?: { total?: number };
    cardinality?: { speciesKey?: number };
    stats?: {
      year?: { min?: number; max?: number };
    };
  };
};

type OccurrenceSummaryProps = {
  predicate?: unknown;
  q?: string;
  checklistKey?: string;
  [key: string]: unknown;
};

export function OccurrenceSummary({
  predicate,
  q,
  checklistKey,
  ...props
}: OccurrenceSummaryProps) {
  const defaultChecklistKey = useChecklistKey();
  const { data, error, load } = useQuery<OccurrenceStatsResponse, Record<string, unknown>>(
    OCCURRENCE_STATS,
    { lazyLoad: true }
  );

  useDeepCompareEffect(() => {
    load({
      variables: {
        predicate,
        checklistKey: checklistKey ?? defaultChecklistKey,
        q,
      },
      queue: { name: 'dashboard' },
    });
  }, [predicate, q, load, checklistKey, defaultChecklistKey]);
  const summary = data?.occurrenceSearch;

  return (
    <Card {...props} loading={!summary} error={!!error}>
      <ErrorBoundary debugTitle="OccurrenceSummary" showReportButton={false} type="BLOCK">
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="dashboard.statistics" defaultMessage="Statistics" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Table>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <FormattedMessage
                        id="dashboard.occurrenceRecords"
                        defaultMessage="Occurrence records"
                      />
                    </div>
                  </td>
                  <td>
                    <FormattedNumber value={summary?.documents?.total} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="dashboard.species" defaultMessage="Species" />
                  </td>
                  <td>
                    <FormattedNumber value={summary?.cardinality?.speciesKey} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="dashboard.yearRange" defaultMessage="Year range" />
                  </td>
                  <td>
                    {summary?.stats?.year?.min ? (
                      <span>
                        <FormattedMessage
                          id="intervals.description.between"
                          values={{
                            from: summary.stats.year.min,
                            to: summary.stats.year.max,
                          }}
                        />
                      </span>
                    ) : (
                      <FormattedMessage id="dashboard.noData" />
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </CardContent>
      </ErrorBoundary>
    </Card>
  );
}

const OCCURRENCE_STATS = `
query summary($q: String, $predicate: Predicate, $checklistKey: ID){
  occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      speciesKey(checklistKey: $checklistKey)
    }

    stats {
      year {
        min
        max
      }
    }
  }
}
`;
