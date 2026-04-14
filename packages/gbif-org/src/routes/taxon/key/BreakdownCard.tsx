import Highcharts, { generateChartsPalette } from '@/components/dashboard/charts/highcharts';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useConfig } from '@/config/config';
import { TaxonBreakdown2Query, TaxonBreakdown2QueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useLink } from '@/reactRouterPlugins/dynamicLink';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const TAXON_BREAKDOWN = /* GraphQL */ `
  query TaxonBreakdown2($key: ID!, $datasetKey: ID!) {
    taxonInfo(key: $key, datasetKey: $datasetKey) {
      taxon {
        key: taxonID
        rank: taxonRank
        scientificName
        checklistBankBreakdown: breakdown(sortByCount: true) {
          id: taxonID
          name: scientificName
          rank: taxonRank
          species
          children: breakdown {
            id: taxonID
            name: scientificName
            rank: taxonRank
            species
            children: breakdown {
              id: taxonID
              name: scientificName
              rank: taxonRank
              species
            }
          }
        }
      }
    }
  }
`;

type Props = {
  taxonKey: string;
  datasetKey: string;
};

type BreakdownNode = NonNullable<
  NonNullable<NonNullable<TaxonBreakdown2Query['taxonInfo']>['taxon']>['checklistBankBreakdown']
>;

const MIN_SLICE_PERCENT = 0.01; // slices below this fraction of the total are grouped into "Other"

type BreakdownChartProps = {
  breakdown: BreakdownNode;
};

function BreakdownChart({ breakdown }: BreakdownChartProps) {
  const createLink = useLink();
  const navigate = useNavigate();
  const { theme } = useConfig();

  const chartOptions = useMemo((): Highcharts.Options => {
    const themeColors = (
      theme?.chartColors
        ? generateChartsPalette(theme.chartColors)
        : (Highcharts.getOptions().colors ?? [])
    ) as string[];

    const children = (breakdown.children ?? []).filter(
      (c): c is NonNullable<typeof c> => c != null
    );

    const innerData: Highcharts.PointOptionsObject[] = [];
    const outerData: Highcharts.PointOptionsObject[] = [];
    const totalSpecies = children.reduce((sum, c) => sum + (c.species ?? 0), 0);
    const minSliceSpecies = totalSpecies * MIN_SLICE_PERCENT;

    const largeChildren = children.filter((c) => (c.species ?? 0) >= minSliceSpecies);
    const smallChildrenTotal = children
      .filter((c) => (c.species ?? 0) < minSliceSpecies)
      .reduce((sum, c) => sum + (c.species ?? 0), 0);

    largeChildren.forEach((child, idx) => {
      const color = themeColors[idx % themeColors.length];
      const parentSpecies = child.species ?? 0;
      innerData.push({ name: child.name ?? '', y: parentSpecies, color, custom: { id: child.id } });

      const grandchildren = (child.children ?? []).filter(
        (g): g is NonNullable<typeof g> => g != null
      );
      const largeGrandchildren = grandchildren.filter((g) => (g.species ?? 0) >= minSliceSpecies);
      const largeGrandchildrenSum = largeGrandchildren.reduce(
        (sum, g) => sum + (g.species ?? 0),
        0
      );
      const count = largeGrandchildren.length;

      largeGrandchildren.forEach((grandchild, jdx) => {
        // brighten from +0.3 (light) to -0.3 (dark) across siblings
        const brightness = count > 1 ? 0.3 - (jdx / (count - 1)) * 0.6 : 0;
        outerData.push({
          name: grandchild.name ?? '',
          y: grandchild.species ?? 0,
          color: Highcharts.color(color).brighten(brightness).get() as string,
          custom: { id: grandchild.id },
        });
      });

      // Filler slice: covers small grandchildren (< threshold) + any angular gap from missing data.
      const remainder = parentSpecies - largeGrandchildrenSum;
      if (remainder > 0) {
        const isBlank = grandchildren.length === 0;
        outerData.push({
          name: isBlank ? '' : `Other ${child.name ?? ''}`,
          y: remainder,
          color: isBlank ? (color as string) : '#fafafa',
          dataLabels: { enabled: !isBlank },
        });
      }
    });

    // Group all children below the threshold into a single "Other" slice.
    if (smallChildrenTotal > 0) {
      const needsOuterFiller = outerData.length > 0;
      innerData.push({ name: 'Other', y: smallChildrenTotal, color: '#fafafa' });
      if (needsOuterFiller) {
        outerData.push({
          name: '',
          y: smallChildrenTotal,
          color: '#fafafa',
          dataLabels: { enabled: false },
        });
      }
    }

    const hasOuterRing = outerData.length > 0;

    const handleClick = (e: Highcharts.PointClickEventObject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = (e.point as any).custom?.id;
      if (!id) return;
      let { to } = createLink({ pageId: 'taxonKey', variables: { key: id } });
      if (!to) to = `/species/${id}`;
      const url = typeof to === 'string' ? to : '';
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(url);
      }
    };

    return {
      chart: { type: 'pie' },
      title: { text: '' },
      credits: { enabled: false },
      plotOptions: {
        series: {
          states: {
            hover: {
              halo: null,
            },
            inactive: {
              opacity: 1,
            },
          },
        },
        pie: {
          shadow: false,
          center: ['50%', '50%'],
          cursor: 'pointer',
          point: {
            events: {
              click: handleClick,
            },
          },
        },
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}</b>: {point.y} species',
      },
      series: [
        {
          type: 'pie',
          name: 'Species',
          data: innerData,
          innerSize: '30%',
          size: hasOuterRing ? '60%' : '80%',
          dataLabels: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (this: any) {
              return (this.y ?? 0) > totalSpecies / 10 ? this.point.name : null;
            },
            distance: -30,
          },
        },
        ...(hasOuterRing
          ? [
              {
                type: 'pie' as const,
                name: 'Species',
                data: outerData,
                size: '80%',
                innerSize: '60%',
                dataLabels: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter: function (this: any) {
                    return (this.y ?? 0) > 1
                      ? `<b>${this.point.name}:</b> ${(this.y as number).toLocaleString('en-GB')}`
                      : null;
                  },
                },
              },
            ]
          : []),
      ],
    };
  }, [breakdown, createLink, navigate, theme?.chartColors]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

function BreakdownContent({ taxonKey, datasetKey }: Props) {
  const { data, loading } = useQuery<TaxonBreakdown2Query, TaxonBreakdown2QueryVariables>(
    TAXON_BREAKDOWN,
    { variables: { key: taxonKey, datasetKey } }
  );

  const breakdown = data?.taxonInfo?.taxon?.checklistBankBreakdown;

  return (
    <Card className="g-mb-4" id="breakdown">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.breakdown" defaultMessage="Breakdown" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading...</p>}
        {breakdown && <BreakdownChart breakdown={breakdown} />}
      </CardContent>
    </Card>
  );
}

export default function BreakdownCard({ taxonKey, datasetKey }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={
        <FormattedMessage id="taxon.errors.breakdown" defaultMessage="Failed to load breakdown" />
      }
    >
      <BreakdownContent taxonKey={taxonKey} datasetKey={datasetKey} />
    </ErrorBoundary>
  );
}
