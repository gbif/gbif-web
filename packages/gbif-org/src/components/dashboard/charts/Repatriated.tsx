/* This component is still work in progress. It is not yet used in the application.
 It largely works, but the presentatio needs work. And translations are missing.
 Ideas: It would be nice with a table view that showed incoming/outgoing pr country (how many records, from/to how many countries).
 Some more thought to what to show when there are to many connections would be nice. Show 10 random countries? Top 100 relations?
 I also needs a better loader consistent with the other cards.
 */

import useQuery from '@/hooks/useQuery';
import HighchartsReact from 'highcharts-react-official';
import HighchartsWheel from 'highcharts/modules/dependency-wheel';
import HighchartSankey from 'highcharts/modules/sankey';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDeepCompareEffectNoCheck as useDeepCompareEffect } from 'use-deep-compare-effect';
import { CardTitle } from '@/components/ui/smallCard';
import { Card } from '../shared';
import ChartClickWrapper from './ChartClickWrapper';
import { getDependencyWheelOptions } from './dependencywheel';
import Highcharts from './highcharts';

HighchartSankey(Highcharts);
HighchartsWheel(Highcharts);

type FromTo = {
  from: string;
  to: string;
  weight: number;
};

type RepatriatedRawData = Array<{
  key: string;
  occurrences?: {
    facet?: {
      countryCode?: Array<{ key: string; count: number }>;
    };
  };
}>;

type RepatriatedResponse = {
  counts?: {
    facet?: {
      results?: Array<{ key: boolean; count: number }>;
    };
  };
  graph?: {
    facet?: {
      results?: RepatriatedRawData;
    };
  };
};

type RepatriatedProps = {
  predicate?: unknown;
  handleRedirect?: (args: { filter?: Record<string, unknown> }) => void;
  visibilityThreshold?: number;
  detailsRoute?: string;
  interactive?: boolean;
  [key: string]: unknown;
};

export function Repatriated(props: RepatriatedProps) {
  return (
    <ChartClickWrapper {...props}>
      <RepatriatedMain />
    </ChartClickWrapper>
  );
}

function transformData(inputData: RepatriatedRawData): FromTo[] {
  const outputData: FromTo[] = [];

  inputData.forEach((fromData) => {
    const from = fromData.key;

    if (fromData.occurrences?.facet?.countryCode) {
      fromData.occurrences.facet.countryCode.forEach((toData) => {
        outputData.push({
          from,
          to: toData.key,
          weight: toData.count,
        });
      });
    }
  });

  return outputData;
}

function RepatriatedMain({
  predicate,
  handleRedirect,
  interactive,
}: RepatriatedProps) {
  const intl = useIntl();
  const { data, error, loading, load } = useQuery<RepatriatedResponse, Record<string, unknown>>(
    REPATRIATED,
    { lazyLoad: true }
  );

  useDeepCompareEffect(() => {
    load({
      variables: {
        size: 10,
        predicate,
        repatriatedPredicate: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'repatriated',
              value: true,
            },
          ],
        },
      },
      queue: { name: 'dashboard' },
    });
  }, [predicate]);

  if (error) return <span>Failure</span>;
  const noData = !data || loading;
  if (noData) return <span>Loading...</span>;

  const resultsAll = transformData(data?.graph?.facet?.results || []).map((item) => [
    item.from,
    item.to,
    item.weight,
  ]);

  const result = resultsAll.sort((a, b) => (b[2] as number) - (a[2] as number)).slice(0, 100);

  const serie = {
    keys: ['from', 'to', 'weight'],
    data: result,
    name: intl.formatMessage({ id: 'dashboard.occurrences' }),
    crisp: false,
    nodePadding: 1,
    dataLabels: {
      color: '#333',
      style: {
        textOutline: 'none',
      },
      textPath: {
        enabled: true,
      },
      distance: 10,
    },
  };

  const wheelOptions = getDependencyWheelOptions({
    serie,
    onClick: handleRedirect,
    interactive,
  });

  const repatriatedTotal =
    data?.counts?.facet?.results?.find((item) => item.key === true)?.count || 0;
  return (
    <Card>
      <CardTitle>
        <FormattedMessage id="filters.repatriated.name" defaultMessage="Repatriated x" />
      </CardTitle>
      <div>
        Repatriated records in total: {repatriatedTotal}
        <br />
        repatriation relations: {resultsAll.length}
        <br />
        showing the first 100
      </div>
      <div style={{ margin: '0 auto' }}>
        <HighchartsReact highcharts={Highcharts} options={wheelOptions} />
      </div>
    </Card>
  );
}

const REPATRIATED = `
query repatriated($q: String, $predicate: Predicate, $repatriatedPredicate: Predicate) {
  counts: occurrenceSearch(q: $q, predicate: $predicate) {
    facet {
      results: repatriated{
        key
        count
      }
    }
  }

  graph: occurrenceSearch(q: $q, predicate: $repatriatedPredicate) {
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
