import { jsx, css } from '@emotion/react';
import React from 'react';
import { useDeepCompareEffect } from 'react-use';
import { useQuery } from '../../dataManagement/api';
import { Skeleton } from '../../components';
// import { FormattedMessage } from 'react-intl';
import { Card, CardTitle, Table, FormattedNumber } from './shared';
import { FormattedMessage } from 'react-intl';

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
    <CardTitle><FormattedMessage id="dashboard.statistics" defaultMessage="Statistics"/></CardTitle>
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
            <td><div><FormattedMessage id="dashboard.occurrenceRecords" defaultMessage="Occurrence records"/></div></td>
            <td><FormattedNumber value={summary?.documents?.total} /></td>
          </tr>
          <tr>
            <td><FormattedMessage id="dashboard.species" defaultMessage="Species"/></td>
            <td><FormattedNumber value={summary?.cardinality?.speciesKey} /></td>
          </tr>
          <tr>
            <td><FormattedMessage id="dashboard.taxa" defaultMessage="Taxa"/></td>
            <td><FormattedNumber value={summary?.cardinality.taxonKey} /></td>
          </tr>
          <tr>
            <td><FormattedMessage id="dashboard.yearRange" defaultMessage="Year range"/></td>
            <td>{summary?.stats?.year?.min ? <span><FormattedMessage id="intervals.description.between" values={{from: summary.stats.year.min, to: summary.stats.year.max}}/></span> : <FormattedMessage id="dashboard.noData" />}</td>
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

