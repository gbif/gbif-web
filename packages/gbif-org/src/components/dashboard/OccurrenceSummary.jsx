import useDeepCompareEffect from 'use-deep-compare-effect';
// import { FormattedMessage } from 'react-intl';
import useQuery from '@/hooks/useQuery';
import { FormattedMessage } from 'react-intl';
import { ErrorBoundary } from '../ErrorBoundary';
import { Card, CardContent, CardTitle } from '../ui/smallCard';
import { CardHeader, FormattedNumber, Table } from './shared';

export function OccurrenceSummary({ predicate, ...props }) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });

  useDeepCompareEffect(() => {
    load({
      variables: {
        predicate,
        hasSpeciesRank: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'gbifClassification_classification_rank',
              value: 'SPECIES',
            },
          ],
        },
        hasCoordinates: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'hasCoordinate',
              value: true,
            },
          ],
        },
        hasMedia: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'isNotNull',
              key: 'mediaType',
            },
          ],
        },
      },
      queue: { name: 'dashboard' },
    });
  }, [predicate]);
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
query summary($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      speciesKey
      taxonKey
      datasetKey
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
