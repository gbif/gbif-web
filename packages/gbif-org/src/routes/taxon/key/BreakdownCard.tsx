import Highcharts, {
  chartPatterns,
  generateChartsPalette,
} from '@/components/dashboard/charts/highcharts';
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

// Maximum number of taxa nodes (inner + outer slices) before grouping small taxa into
// gray "Other" categories. Tune this to balance chart detail vs. render performance.
const MAX_TAXA_IN_CHART = 300;

// If the largest inner slice is below this fraction of the total, skip the outer ring
// and render a plain pie chart instead (the breakdown would be too fragmented).
const MIN_INNER_FRACTION_FOR_OUTER = 0.1;

// If the largest outer (grandchild) slice is below this fraction of the total, also
// skip the outer ring — the second level would be indistinguishably small.
const MIN_OUTER_FRACTION_FOR_OUTER = 0.01;

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

    const allChildren = (breakdown.children ?? []).filter(
      (c): c is NonNullable<typeof c> => c != null
    );

    // Count total nodes (inner children + all grandchildren across all children)
    const totalNodes =
      allChildren.length +
      allChildren.reduce((sum, c) => sum + (c.children ?? []).filter((g) => g != null).length, 0);

    let displayChildren = allChildren;
    let innerOtherSpecies = 0;

    if (totalNodes > MAX_TAXA_IN_CHART) {
      // maxInner: roughly sqrt of the budget so inner*outer ≈ MAX_TAXA_IN_CHART
      const maxInner = Math.ceil(Math.sqrt(MAX_TAXA_IN_CHART));
      if (allChildren.length > maxInner) {
        innerOtherSpecies = allChildren
          .slice(maxInner)
          .reduce((sum, c) => sum + (c.species ?? 0), 0);
        displayChildren = allChildren.slice(0, maxInner);
      }
      // Distribute remaining budget evenly across displayed inner children
      const maxGC = Math.max(
        1,
        Math.floor(
          (MAX_TAXA_IN_CHART - displayChildren.length) / Math.max(1, displayChildren.length)
        )
      );
      displayChildren = displayChildren.map((child) => ({
        ...child,
        children: (child.children ?? [])
          .filter((g): g is NonNullable<typeof g> => g != null)
          .slice(0, maxGC),
      }));
    }

    // Prune inner slices that are less than 3% of total into the "Other" category
    {
      const preTotal =
        displayChildren.reduce((sum, c) => sum + (c.species ?? 0), 0) + innerOtherSpecies;
      const kept: typeof displayChildren = [];
      for (const child of displayChildren) {
        if (preTotal > 0 && (child.species ?? 0) / preTotal < 0.015) {
          innerOtherSpecies += child.species ?? 0;
        } else {
          kept.push(child);
        }
      }
      displayChildren = kept;
    }

    const isGrouped = totalNodes > MAX_TAXA_IN_CHART;
    const innerData: Highcharts.PointOptionsObject[] = [];
    const outerData: Highcharts.PointOptionsObject[] = [];
    const totalSpecies =
      displayChildren.reduce((sum, c) => sum + (c.species ?? 0), 0) + innerOtherSpecies;

    // If the largest inner or outer slice doesn't reach the minimum fraction, skip the outer ring.
    const largestInnerFraction =
      totalSpecies > 0
        ? Math.max(...displayChildren.map((c) => (c.species ?? 0) / totalSpecies), 0)
        : 0;
    const largestOuterFraction =
      totalSpecies > 0
        ? Math.max(
            0,
            ...displayChildren.flatMap((c) =>
              (c.children ?? [])
                .filter((g): g is NonNullable<typeof g> => g != null)
                .map((g) => (g.species ?? 0) / totalSpecies)
            )
          )
        : 0;
    const showOuterRing =
      largestInnerFraction >= MIN_INNER_FRACTION_FOR_OUTER &&
      largestOuterFraction >= MIN_OUTER_FRACTION_FOR_OUTER;

    displayChildren.forEach((child, idx) => {
      const color = themeColors[idx % themeColors.length];
      const parentSpecies = child.species ?? 0;
      innerData.push({ name: child.name ?? '', y: parentSpecies, color, custom: { id: child.id } });

      const grandchildren = (child.children ?? []).filter(
        (g): g is NonNullable<typeof g> => g != null
      );
      const grandchildrenSum = grandchildren.reduce((sum, g) => sum + (g.species ?? 0), 0);
      const count = grandchildren.length;

      grandchildren.forEach((grandchild, jdx) => {
        if (!showOuterRing) return;
        // brighten from +0.3 (light) to -0.3 (dark) across siblings
        const brightness = count > 1 ? 0.3 - (jdx / (count - 1)) * 0.6 : 0;
        outerData.push({
          name: grandchild.name ?? '',
          y: grandchild.species ?? 0,
          color: Highcharts.color(color).brighten(brightness).get() as string,
          custom: { id: grandchild.id },
        });
      });

      // Filler slice so the outer ring always covers the same angular span as its parent inner slice.
      // When there are no children at all, use the parent color so the ring looks seamless.
      // When children exist but don't account for all species (or some were capped), add a
      // visible "Other" remainder — shown in gray when grouping is active.
      const remainder = parentSpecies - grandchildrenSum;
      if (showOuterRing && remainder > 0) {
        const isBlank = grandchildren.length === 0;
        outerData.push({
          name: isBlank ? '' : `Other ${child.name ?? ''}`,
          y: remainder,
          color: isBlank
            ? (color as string)
            : isGrouped
              ? '#eee' //chartPatterns.OTHER
              : (Highcharts.color(color).brighten(-0.4).get() as string),
          dataLabels: { enabled: !isBlank },
        });
      }
    });

    // If inner children were capped, add a gray "Other" inner slice and a matching outer filler
    if (innerOtherSpecies > 0) {
      innerData.push({
        name: 'Other',
        y: innerOtherSpecies,
        color: '#eee', //chartPatterns.OTHER,
        // no custom.id → click handler returns early (no navigation)
      });
      if (showOuterRing) {
        outerData.push({
          name: '',
          y: innerOtherSpecies,
          color: '#eee', //chartPatterns.OTHER,
          dataLabels: { enabled: false },
        });
      }
    }

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
          size: showOuterRing ? '60%' : '80%',
          dataLabels: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (this: any) {
              return (this.y ?? 0) > totalSpecies / 10 ? this.point.name : null;
            },
            distance: -30,
          },
        },
        ...(showOuterRing
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
