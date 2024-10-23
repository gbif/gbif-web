/* This component is still work in progress. It is not yet used in the application.
 It largely works, but the presentatio needs work. And translations are missing.
 Ideas: It would be nice with a table view that showed incoming/outgoing pr country (how many records, from/to how many countries).
 Some more thought to what to show when there are to many connections would be nice. Show 10 random countries? Top 100 relations?
 I also needs a better loader consistent with the other cards. 
 */

import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { Card, CardTitle } from '../shared';
import ChartClickWrapper from './ChartClickWrapper';
import Highcharts from './highcharts';
import HighchartsReact from 'highcharts-react-official'
import HighchartSankey from "highcharts/modules/sankey";
import HighchartsWheel from "highcharts/modules/dependency-wheel";
import { getDependencyWheelOptions } from './dependencywheel';
import { useQuery } from '../../../dataManagement/api';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDeepCompareEffect } from 'react-use';

HighchartSankey(Highcharts);
HighchartsWheel(Highcharts);

const RESULTS_CAP = 1000;

export function Repatriated(props) {
  return <ChartClickWrapper {...props}>
    <RepatriatedMain />
  </ChartClickWrapper>
}

function transformData(inputData) {
  let outputData = [];

  inputData.forEach((fromData) => {
    const from = fromData.key;

    if (fromData.occurrences && fromData.occurrences.facet && fromData.occurrences.facet.countryCode) {
      fromData.occurrences.facet.countryCode.forEach((toData) => {
        const to = toData.key;
        const weight = toData.count;

        outputData.push({
          from: from,
          to: to,
          weight: weight
        });
      });
    }
  });

  return outputData;
}

function RepatriatedMain({
  predicate,
  handleRedirect,
  visibilityThreshold,
  detailsRoute,
  interactive,
  ...props
}) {
  const intl = useIntl();
  const { data, error, loading, load } = useQuery(REPATRIATED, { lazyLoad: true });

  useDeepCompareEffect(() => {
    let repatriatedPredicate = {
      "type": "and",
      "predicates": [
        {
          "type": "equals",
          "key": "repatriated",
          "value": true
        }
      ]
    };
    if (predicate) {
      repatriatedPredicate.predicates.push(predicate);
    }
    load({
      variables: {
        size: 10,
        predicate,
        repatriatedPredicate
      },
      queue: { name: 'dashboard' }
    });
  }, [predicate]);

  if (error) return <span>Failure</span>
  const noData = !data || loading;
  if (noData) return <span>Loading...</span>

  const resultsAll = transformData(data?.graph?.facet?.results || []).map((item) => [item.from, item.to, item.weight]);

  const result = resultsAll.sort((a, b) => b[2] - a[2]).slice(0, RESULTS_CAP);

  const serie = {
    keys: ['from', 'to', 'weight'],
    data: result,
    name: intl.formatMessage({ id: 'dashboard.occurrences' }),
    crisp: false,
    nodePadding: 1,
    dataLabels: {
      color: '#333',
      style: {
        textOutline: 'none'
      },
      textPath: {
        enabled: true
      },
      distance: 10
    }
  };

  const wheelOptions = getDependencyWheelOptions({
    serie,
    onClick: handleRedirect,
    interactive
  });

  const repatriatedTotal = data?.counts?.facet.results.find((item) => item.key === true)?.count || 0;
  return <Card {...props}>
    <CardTitle><FormattedMessage id="filters.repatriated.name" defaultMessage="Repatriated x" /></CardTitle>
    <div>
      Repatriated records in total: {repatriatedTotal}
      <br />
      repatriation relations: {resultsAll.length}
      <br />
      showing the first {RESULTS_CAP}
    </div>
    <div style={{ margin: '0 auto' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={wheelOptions}
        css={chartsStyle}
      />
    </div>
  </Card>
}

const chartsStyle = css`
  min-width: 100%;
  height: 100%;
  width: 160px;
  overflow: hidden;
`;


const REPATRIATED = `
query repatriated($predicate: Predicate, $repatriatedPredicate: Predicate) {
  counts: occurrenceSearch(predicate: $predicate) {
    facet {
      results: repatriated{
        key
        count
      }
    }
  }
  
  graph: occurrenceSearch(predicate: $repatriatedPredicate) {
    facet {
      results: publishingCountry(size: 300) {
        key
        count
        occurrences {
          facet {
            countryCode(size: 300) {
              key
              count
            }
          }
        }
      }
    }
  }
}
`;