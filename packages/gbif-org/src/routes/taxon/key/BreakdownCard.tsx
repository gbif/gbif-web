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

// Slices whose species count is below this fraction of the total are collapsed into an "Other" slice.
const MIN_SLICE_PERCENT = 0.01;

/**
 * Splits an array of breakdown nodes into two groups:
 * - `significant`: nodes whose species count meets or exceeds `threshold`
 *   (these get their own named slice in the chart)
 * - `remainder`: nodes below `threshold` that will be collapsed into an "Other" slice
 */
function splitByThreshold<T extends { species?: number | null }>(
  nodes: T[],
  threshold: number
): { significant: T[]; remainder: T[] } {
  return {
    significant: nodes.filter((n) => (n.species ?? 0) >= threshold),
    remainder: nodes.filter((n) => (n.species ?? 0) < threshold),
  };
}

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
    // True only when at least one real grandchild slice is pushed to outerData.
    // Plain filler slices (added when a child has no grandchildren at all) don't count,
    // because an outer ring made entirely of fillers just duplicates the inner ring.
    let hasRealOuterSlices = false;

    // Total species across all direct children — used to compute the per-slice threshold.
    const totalSpecies = children.reduce((sum, c) => sum + (c.species ?? 0), 0);
    const minSliceSpecies = totalSpecies * MIN_SLICE_PERCENT;

    // ── Inner ring ────────────────────────────────────────────────────────────
    // Each significant child gets its own named slice.
    // Children below the threshold are summed and added as a single "Other" slice.
    const { significant: significantChildren, remainder: smallChildren } = splitByThreshold(
      children,
      minSliceSpecies
    );
    const smallChildrenTotal = smallChildren.reduce((sum, c) => sum + (c.species ?? 0), 0);

    significantChildren.forEach((child, idx) => {
      const color = themeColors[idx % themeColors.length];
      const childSpeciesCount = child.species ?? 0;

      innerData.push({
        name: child.name ?? '',
        y: childSpeciesCount,
        color,
        custom: { id: child.id },
      });

      // ── Outer ring ──────────────────────────────────────────────────────────
      // Each significant child is further broken down into its grandchildren.
      const grandchildren = (child.children ?? []).filter(
        (g): g is NonNullable<typeof g> => g != null
      );

      // Only grandchildren above the threshold get their own outer slice.
      // Smaller grandchildren are lumped into a labelled filler slice below.
      const { significant: significantGrandchildren } = splitByThreshold(
        grandchildren,
        minSliceSpecies
      );
      const significantGrandchildrenSum = significantGrandchildren.reduce(
        (sum, g) => sum + (g.species ?? 0),
        0
      );
      const grandchildCount = significantGrandchildren.length;

      if (significantGrandchildren.length > 0) hasRealOuterSlices = true;

      significantGrandchildren.forEach((grandchild, jdx) => {
        // Vary brightness from +0.3 (lightest, first) to -0.3 (darkest, last) across siblings.
        const brightness = grandchildCount > 1 ? 0.3 - (jdx / (grandchildCount - 1)) * 0.6 : 0;
        outerData.push({
          name: grandchild.name ?? '',
          y: grandchild.species ?? 0,
          color: Highcharts.color(color).brighten(brightness).get() as string,
          custom: { id: grandchild.id },
        });
      });

      // Filler slice: pads the outer ring so its arc always matches the inner slice.
      // The filler covers any species not represented by significant grandchildren —
      // either because the child has no grandchildren at all, or because some were
      // below the threshold.
      // - No grandchildren at all → plain filler (parent colour, no label)
      // - Some grandchildren were below threshold → grey "Other {child}" slice with label
      const fillerSpecies = childSpeciesCount - significantGrandchildrenSum;
      if (fillerSpecies > 0) {
        const hasNoGrandchildren = grandchildren.length === 0;
        outerData.push({
          name: hasNoGrandchildren ? '' : `Other ${child.name ?? ''}`,
          y: fillerSpecies,
          color: hasNoGrandchildren ? (color as string) : '#fafafa',
          dataLabels: { enabled: !hasNoGrandchildren },
        });
      }
    });

    // ── Inner "Other" slice ───────────────────────────────────────────────────
    // Aggregates all children below the threshold into one grey slice.
    // If the outer ring is already populated, a matching blank filler is added
    // so both rings cover the same total arc.
    if (smallChildrenTotal > 0) {
      innerData.push({ name: 'Other', y: smallChildrenTotal, color: '#fafafa' });
      if (hasRealOuterSlices) {
        outerData.push({
          name: '',
          y: smallChildrenTotal,
          color: '#fafafa',
          dataLabels: { enabled: false },
        });
      }
    }

    const hasOuterRing = hasRealOuterSlices;

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
