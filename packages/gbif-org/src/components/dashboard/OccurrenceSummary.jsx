import { useDeepCompareEffectNoCheck as useDeepCompareEffect } from 'use-deep-compare-effect';
// import { FormattedMessage } from 'react-intl';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import { FormattedMessage } from 'react-intl';
import { ErrorBoundary } from '../ErrorBoundary';
import { Card, CardContent, CardTitle } from '../ui/smallCard';
import { CardHeader, FormattedNumber, Table } from './shared';

export function OccurrenceSummary({ predicate, q, checklistKey, ...props }) {
  const defaultChecklistKey = useChecklistKey();
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });

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
              <tbody
              // css={css`
              // >tr > td > div {
              //   display: flex;
              //   align-items: center;
              // }
              // `}
              >
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
                    <FormattedMessage
                      id="dashboard.distinctNames"
                      defaultMessage="Distinct names"
                    />
                  </td>
                  <td>
                    <FormattedNumber value={summary?.cardinality?.verbatimScientificName} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="dashboard.taxa" defaultMessage="Taxa" />
                  </td>
                  <td>
                    <FormattedNumber value={summary?.cardinality?.taxonKey} />
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
                          values={{ from: summary.stats.year.min, to: summary.stats.year.max }}
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
      taxonKey(checklistKey: $checklistKey)
      verbatimScientificName
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
