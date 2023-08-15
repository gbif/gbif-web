import { jsx, css } from '@emotion/react';
import React from 'react';
import { useDeepCompareEffect } from 'react-use';
import { useQuery } from '../../dataManagement/api';
import { Skeleton } from '../../components';
// import { FormattedMessage } from 'react-intl';
import { Card, CardTitle, Table, FormattedNumber } from './shared';

export function OccurrenceSummary({
  predicate,
  ...props
}) {
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
              value: 'SPECIES'
            }
          ]
        },
        hasCoordinates: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'hasCoordinate',
              value: true
            }
          ]
        },
        hasMedia: {
          type: 'and',
          predicates: [
            predicate,
            {
              "type": "isNotNull",
              "key": "mediaType"
            }
          ]
        },
      },
      queue: { name: 'dashboard' }
    });
  }, [predicate]);

  const total = data?.occurrenceSearch?.documents?.total;

  if (error) return <span>Failure</span>

  const summary = data?.occurrenceSearch;

  return <Card {...props}>
    <CardTitle>Statistics</CardTitle>
    <div>
      <Table>
        <tbody css={css`
            >tr > td > div {
              display: flex;
              align-items: center;
            }
            /* td, td > div {
              text-overflow: ellipsis;
              white-space: nowrap;
            } */
            `}>
          <tr>
            <td><div>Occurrence records</div></td>
            <td><FormattedNumber value={summary?.documents?.total} /></td>
          </tr>
          <tr>
            <td>Species</td>
            <td><FormattedNumber value={summary?.cardinality?.speciesKey} /></td>
          </tr>
          <tr>
            <td>Taxa</td>
            <td><FormattedNumber value={summary?.cardinality.taxonKey} /></td>
          </tr>
          <tr>
            <td>Year range</td>
            <td>{summary ? <span>{summary.stats.year.min} - {summary.stats.year.max}</span> : <Skeleton width="70px" />}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  </Card>
};

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

