import useDeepCompareEffect from 'use-deep-compare-effect'
import { FormattedMessage } from 'react-intl';
import { Table, BarItem, FormattedNumber, CardHeader } from './shared';
import useQuery from '@/hooks/useQuery';
import { Card, CardContent, CardTitle } from '../ui/smallCard';

export function DataQuality({ predicate, ...props }) {
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
        hasCollector: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'isNotNull',
              key: 'recordedBy',
            },
          ],
        },
        hasYear: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'isNotNull',
              key: 'year',
            },
          ],
        },
        hasSequence: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'isSequenced',
              value: true
            },
          ],
        },
      },
      queue: { name: 'dashboard' },
    });
  }, [predicate]);

  const noData = !data || loading;
  const summary = data?.occurrenceSearch;
  const total = summary?.documents?.total;

  return (
    <Card {...props} loading={noData} error={!!error}>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="dashboard.richness" defaultMessage="Data richness" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Table removeBorder>
            <tbody
            // css={css`
            //   >tr > td > div {
            //     display: flex;
            //     align-items: center;
            //   }
            //   /* td, td > div {
            //     text-overflow: ellipsis;
            //     white-space: nowrap;
            //   } */
            //   tr {
            //     td:last-of-type {
            //       /* width: 80px; */
            //       text-align: end;
            //     }
            //   }
            //   `}
            >
              <tr>
                <td>
                  <BarItem percent={(100 * data?.rank?.documents?.total) / total}>
                    <FormattedMessage
                      id="dashboard.identifiedToSpecies"
                      defaultMessage="Identified to species"
                    />
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.rank?.documents?.total} />
                </td>
                {/* <td>
              <Progress percent={100 * data?.rank?.documents?.total / summary.documents.total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td> */}
              </tr>
              <tr>
                <td>
                  <BarItem percent={(100 * data?.hasCoordinates?.documents?.total) / total}>
                    <FormattedMessage id="dashboard.withCoordinates" />
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.hasCoordinates?.documents?.total} />
                </td>
                {/* <td>
              <Progress percent={100 * data?.hasCoordinates?.documents?.total / total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td> */}
              </tr>
              <tr>
                <td>
                  <BarItem percent={(100 * data?.hasYear?.documents?.total) / total}>
                    <FormattedMessage id="dashboard.withYear" />
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.hasYear?.documents?.total} />
                </td>
                {/* <td>
              <Progress percent={100 * data?.rank?.documents?.total / total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td> */}
              </tr>
              <tr>
                <td>
                  <BarItem percent={(100 * data?.hasCollector?.documents?.total) / total}>
                    <FormattedMessage id="dashboard.withCollector" />
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.hasCollector?.documents?.total} />
                </td>
                {/* <td>
              <Progress percent={100 * data?.hasCollector?.documents?.total / total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td> */}
              </tr>
              <tr>
                {/* <td><div>With media</div></td> */}
                <td>
                  <BarItem percent={(100 * data?.hasMedia?.documents?.total) / total}>
                    <FormattedMessage id="dashboard.withMedia" />
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.hasMedia?.documents?.total} />
                </td>
                {/* <td>
              <Progress percent={100 * data?.hasMedia?.documents?.total / total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td> */}
              </tr>
              <tr>
                {/* <td><div>With media</div></td> */}
                <td>
                  <BarItem percent={(100 * data?.hasSequence?.documents?.total) / total}>
                    <FormattedMessage id="dashboard.withSequence" />
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.hasSequence?.documents?.total} />
                </td>
                {/* <td>
              <Progress percent={100 * data?.hasMedia?.documents?.total / total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td> */}
              </tr>
            </tbody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

const OCCURRENCE_STATS = `
query summary($predicate: Predicate, $hasSpeciesRank: Predicate, $hasCoordinates: Predicate, $hasMedia: Predicate, $hasCollector: Predicate, $hasYear: Predicate, $hasSequence: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
  }
  rank: occurrenceSearch(predicate: $hasSpeciesRank) {
    documents(size: 0) {
      total
    }
  }
  hasCoordinates: occurrenceSearch(predicate: $hasCoordinates) {
    documents(size: 0) {
      total
    }
  }
  hasMedia: occurrenceSearch(predicate: $hasMedia) {
    documents(size: 0) {
      total
    }
  }
  hasCollector: occurrenceSearch(predicate: $hasCollector) {
    documents(size: 0) {
      total
    }
  }
  hasYear: occurrenceSearch(predicate: $hasYear) {
    documents(size: 0) {
      total
    }
  }
  hasSequence: occurrenceSearch(predicate: $hasSequence) {
    documents(size: 0) {
      total
    }
  }
}
`;
