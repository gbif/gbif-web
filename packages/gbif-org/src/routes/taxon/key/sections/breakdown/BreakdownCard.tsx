import Highcharts, {
  chartPatterns,
  generateChartsPalette,
} from '@/components/dashboard/charts/highcharts';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { SkeletonParagraph } from '@/components/ui/skeleton';
import { CardDescription } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import { TaxonBreakdown2Query, TaxonBreakdown2QueryVariables } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import useAbove from '@/hooks/useAbove';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useLink } from '@/reactRouterPlugins/dynamicLink';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { TAXON_BREAKDOWN } from './useTaxonBreakdown';

type Props = {
  taxonKey: string;
  datasetKey: string;
  className?: string;
};

type BreakdownNode = NonNullable<
  NonNullable<NonNullable<TaxonBreakdown2Query['taxonInfo']>['taxon']>['checklistBankBreakdown']
>;

// Slices whose species count is below this fraction of the total are collapsed into an "Other" slice.
const MIN_SLICE_PERCENT = 0.01;

// Slices below this percentage of the total will have their data labels (with connector lines) hidden.
const MIN_LABEL_PERCENT = 2;

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
  const intl = useIntl();
  const otherLabel = intl.formatMessage({ id: 'taxon.other', defaultMessage: 'Other' });
  const speciesLabel = intl.formatMessage({ id: 'taxon.species', defaultMessage: 'species' });

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

      // ── Outer ring ──────────────────────────────────────────────────────────
      // Each significant child is further broken down into its grandchildren.
      const grandchildren = (child.children ?? []).filter(
        (g): g is NonNullable<typeof g> => g != null
      );

      // Only grandchildren above the threshold get their own outer slice.
      // Smaller grandchildren are lumped into an unlabelled filler slice below.
      const { significant: significantGrandchildren } = splitByThreshold(
        grandchildren,
        minSliceSpecies
      );
      const significantGrandchildrenSum = significantGrandchildren.reduce(
        (sum, g) => sum + (g.species ?? 0),
        0
      );
      const grandchildCount = significantGrandchildren.length;

      // A child "has outer breakdown" when it contributes real (named) slices to the
      // outer ring. We store this flag on the inner point so the label formatter can
      // suppress the inner label for those slices — their outer-ring slices carry the
      // labels, and inner connectors would originate from behind the outer ring.
      const childHasOuterBreakdown = significantGrandchildren.length > 0;
      if (childHasOuterBreakdown) hasRealOuterSlices = true;

      innerData.push({
        name: child.name ?? '',
        y: childSpeciesCount,
        color,
        custom: { id: child.id, hasOuterBreakdown: childHasOuterBreakdown },
      });

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
      // All fillers use the same neutral grey so they are visually inert; a coloured
      // filler would look like a meaningful genus breakdown when it isn't one.
      const fillerSpecies = childSpeciesCount - significantGrandchildrenSum;
      if (fillerSpecies > 0) {
        outerData.push({
          name: '',
          y: fillerSpecies,
          color: '#fafafa',
        });
      }
    });

    // ── Inner "Other" slice ───────────────────────────────────────────────────
    // Aggregates all children below the threshold into one grey slice.
    // If the outer ring is already populated, a matching blank filler is added
    // so both rings cover the same total arc.
    if (smallChildrenTotal > 0) {
      innerData.push({
        name: otherLabel,
        y: smallChildrenTotal,
        color: chartPatterns.OTHER,
        custom: { isOther: true },
      });
      if (hasRealOuterSlices) {
        outerData.push({
          name: '',
          y: smallChildrenTotal,
          color: '#fafafa',
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: function (this: any) {
          if (!this.point.name) return false;
          return `<b>${this.point.name}</b>: ${this.y} ${speciesLabel}`;
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Species',
          data: innerData,
          innerSize: '30%',
          size: hasOuterRing ? '50%' : '80%',
          dataLabels: {
            // Only label inner slices that have NO outer-ring breakdown.
            // Slices that are broken down in the outer ring get their labels
            // from there; inner connectors would originate behind the outer ring
            // and look detached.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (this: any) {
              if (this.point.custom?.hasOuterBreakdown) return null;
              if (this.point.custom?.isOther) return null;
              if ((this.percentage ?? 0) < MIN_LABEL_PERCENT) return null;
              return (this.y ?? 0) > 1
                ? `<b>${this.point.name}:</b> ${(this.y as number).toLocaleString('en-GB')}`
                : null;
            },
            distance: 50,
          },
        },
        ...(hasOuterRing
          ? [
              {
                type: 'pie' as const,
                name: 'Species',
                data: outerData,
                size: '80%',
                innerSize: '70%',
                dataLabels: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter: function (this: any) {
                    if (!this.point.name) return null;
                    if ((this.percentage ?? 0) < MIN_LABEL_PERCENT) return null;
                    return (this.y ?? 0) > 1
                      ? `<b>${this.point.name}:</b> ${(this.y as number).toLocaleString('en-GB')}`
                      : null;
                  },
                  distance: 0,
                },
              },
            ]
          : []),
      ],
    };
  }, [breakdown, createLink, navigate, theme?.chartColors, otherLabel, speciesLabel]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

function BreakdownContent({ taxonKey, datasetKey, className }: Props) {
  const showPie = useAbove(800);
  const { data, loading } = useQuery<TaxonBreakdown2Query, TaxonBreakdown2QueryVariables>(
    TAXON_BREAKDOWN,
    { variables: { key: taxonKey, datasetKey } }
  );

  const breakdown = data?.taxonInfo?.taxon?.checklistBankBreakdown;
  const isEmpty = !breakdown || breakdown.species === 0;

  return (
    <Card className={cn('g-mb-4', className)} id="breakdown">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.largestGroups" defaultMessage="Largest Groups" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage
            id="taxon.largestGroupsDescription"
            defaultMessage="Major groups per number of species"
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <SkeletonParagraph />}
        {isEmpty && !loading && (
          <p>
            <FormattedMessage
              id="taxon.breakdown.noData"
              defaultMessage="No breakdown data available for this taxon."
            />
          </p>
        )}
        {!isEmpty && showPie && <BreakdownChart breakdown={breakdown} />}
        {!isEmpty && !showPie && <LargestTaxaList breakdown={breakdown} />}
      </CardContent>
    </Card>
  );
}

export default function BreakdownCard({ taxonKey, datasetKey, className }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={
        <FormattedMessage id="taxon.errors.breakdown" defaultMessage="Failed to load breakdown" />
      }
    >
      <BreakdownContent taxonKey={taxonKey} datasetKey={datasetKey} className={className} />
    </ErrorBoundary>
  );
}

const MAX_LIST_ENTRIES = 10;
// Children whose species count is at least this fraction of the total get their own sub-list row.
const MIN_SUBLIST_PERCENT = 0.05;

type TaxonRowNode = NonNullable<NonNullable<NonNullable<BreakdownNode['children']>[number]>>;

type TaxonBarRowProps = {
  node: TaxonRowNode;
  /** Bar width as a percentage (0–100), pre-calculated by the parent. */
  barWidth: number;
  children?: React.ReactNode;
};

/** A single linked row with a name, species count, proportional bar, and optional sub-list. */
function TaxonBarRow({ node, barWidth, children }: TaxonBarRowProps) {
  return (
    <li key={node.id}>
      <DynamicLink
        pageId="taxonKey"
        variables={{ key: node.id ?? '' }}
        className="g-flex-1 g-min-w-0 g-bg-slate-50 g-px-3 g-py-1 g-rounded hover:g-bg-slate-100 g-block"
      >
        {/* Mobile: two lines (name + count); desktop: single line with count right-aligned */}
        <div className="g-flex g-flex-col sm:g-flex-row sm:g-items-baseline sm:g-justify-between g-gap-x-2 g-text-sm">
          <span className="g-truncate">{node.name}</span>
          <span className="g-text-slate-500 g-shrink-0 g-text-xs">
            {(node.species ?? 0).toLocaleString()}
          </span>
        </div>
        {/* Bar: hidden on mobile, visible on desktop */}
        <div className="g-h-1 g-mt-0.5 g-hidden sm:g-block">
          <div
            className="g-h-1 g-rounded-full g-bg-primary-400"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </DynamicLink>
      {children}
    </li>
  );
}

function LargestTaxaList({ breakdown }: { breakdown: BreakdownNode }) {
  const entries = (breakdown.children ?? [])
    .filter((c): c is NonNullable<typeof c> => c != null)
    .slice(0, MAX_LIST_ENTRIES);

  // Scale bars relative to the total species across all children so bar lengths
  // reflect each group's share of the whole taxon, not just the top 10.
  const totalSpecies =
    (breakdown.children ?? []).reduce((sum, c) => sum + (c?.species ?? 0), 0) || 1;

  return (
    <ol className="g-space-y-1">
      {entries.map((child) => {
        const count = child.species ?? 0;
        const barWidth = Math.round((count / totalSpecies) * 100);

        // Sub-list: grandchildren that each represent ≥ MIN_SUBLIST_PERCENT of the total.
        const significantGrandchildren = (child.children ?? []).filter(
          (g): g is NonNullable<typeof g> =>
            g != null && (g.species ?? 0) / totalSpecies >= MIN_SUBLIST_PERCENT
        );

        return (
          <TaxonBarRow key={child.id} node={child} barWidth={barWidth}>
            {significantGrandchildren.length > 0 && (
              <ul className="g-mt-0.5 g-ml-4 g-space-y-0.5">
                {significantGrandchildren.map((grandchild) => {
                  const gcCount = grandchild.species ?? 0;
                  const gcBarWidth = Math.round((gcCount / totalSpecies) * 100);
                  return (
                    <TaxonBarRow key={grandchild.id} node={grandchild} barWidth={gcBarWidth} />
                  );
                })}
              </ul>
            )}
          </TaxonBarRow>
        );
      })}
    </ol>
  );
}
