import { cn } from '@/utils/shadcn';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Portal as TooltipPortal } from '@radix-ui/react-tooltip';
import { useConfig } from '@/config/config';
import { usePortalContainer } from '@/utils/getPortalContainer';
import { cssColour, inkFor, makeScale } from './colour';
import {
  canFilter,
  canFilterCell,
  cellFilter,
  lineFilter,
  asShown,
  makeIntensity,
  measure,
  MIN_INTENSITY,
  type AxisPlan,
  type Line,
  type Ranked,
  type Shade,
  type Table,
} from './plan';

export type PickFilter = (filter: Record<string, unknown[]>) => void;

type CommonProps = {
  /** The chart's title, as the table's accessible name. */
  caption: string;
  rows: AxisPlan;
  cols: AxisPlan;
  shade: Shade;
  /** Cells and headers are buttons that filter. */
  interactive: boolean;
  onPick: PickFilter;
  rowLabel: string;
  colLabel: string;
};

// The table sits on a very light grey, with a slightly darker line around every cell, header and
// label, so empty cells and rows still read as a grid.
const grid = 'g-border g-border-solid g-border-slate-200 g-bg-slate-50';
const th = cn(grid, 'g-px-2 g-py-1 g-text-start g-font-normal g-text-slate-600 g-align-bottom');
const cellBase = cn(grid, 'g-px-2 g-py-1 g-text-end g-align-middle g-min-w-[3.5rem]');
const rest = cn(grid, 'g-px-2 g-py-1 g-text-end g-text-slate-500');

function useFormatters() {
  const intl = useIntl();
  const count = (n: number) => intl.formatNumber(n);
  /** A share as a whole percentage, "less than 1%" for what rounds to nothing. */
  const share = (x: number) =>
    x > 0 && x < 0.005
      ? // "<" and 1% as the page's language writes a percentage ("1 %", "%1", "١٪"): nothing to translate.
        `<${intl.formatNumber(0.01, { style: 'percent', maximumFractionDigits: 0 })}`
      : intl.formatNumber(x, { style: 'percent', maximumFractionDigits: 0 });
  return {
    count,
    share,
    /** "Human observation · Denmark: 1,000 (50%)", for tooltips and screen readers. */
    cell: (row: string, column: string, n: number, of: number) =>
      intl.formatMessage(
        { id: 'dashboard.crosstab.cell' },
        { row, column, count: count(n), share: share(of ? n / of : 0) }
      ),
    otherLabel: intl.formatMessage({ id: 'dashboard.crosstab.other' }),
    noValueLabel: intl.formatMessage({ id: 'dashboard.crosstab.noValue' }),
    totalLabel: intl.formatMessage({ id: 'dashboard.crosstab.total' }),
    /** What the totals count, for their tooltips: the label alone doesn't say. */
    rowTotalHint: intl.formatMessage({ id: 'dashboard.crosstab.rowTotalHint' }),
    columnTotalHint: intl.formatMessage({ id: 'dashboard.crosstab.columnTotalHint' }),
    allHint: intl.formatMessage({ id: 'dashboard.crosstab.allHint' }),
    otherHint: (dimension: string) =>
      intl.formatMessage({ id: 'dashboard.crosstab.otherHint' }, { dimension }),
    noValueHint: (dimension: string) =>
      intl.formatMessage({ id: 'dashboard.crosstab.noValueHint' }, { dimension }),
    /**
     * A cell's tooltip: its column, which a cut label or a ranked cell may not show whole, then the
     * count and its share of the row or column. The row is plain from the row label.
     */
    cellTip: (column: string, n: number, part: number, of: 'row' | 'column') => (
      <>
        <div className="g-font-semibold">{column}</div>
        <div>
          {count(n)}
          {' · '}
          {intl.formatMessage(
            {
              id:
                of === 'row' ? 'dashboard.crosstab.shareOfRow' : 'dashboard.crosstab.shareOfColumn',
            },
            { share: share(part) }
          )}
        </div>
      </>
    ),
    corner: (rows: string, cols: string) =>
      intl.formatMessage({ id: 'dashboard.crosstab.corner' }, { rows, cols }),
  };
}

/** A header or cell that filters when the chart is interactive. */
function Pickable({
  on,
  label,
  onClick,
  children,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  if (!on) return <>{children}</>;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="g-w-full g-text-inherit [text-align:inherit] hover:g-underline"
    >
      {children}
    </button>
  );
}

type Scale = (intensity: number) => ReturnType<ReturnType<typeof makeScale>>;

/**
 * The colour for an intensity (`makeIntensity`: from MIN_INTENSITY for the lowest cell to 1 for the
 * highest), along the theme's heatmap colours.
 */
function useScale(): Scale {
  const { theme } = useConfig();
  const colours = theme?.heatmapColors;
  return useMemo(() => {
    const along = makeScale(colours);
    return (intensity: number) => along((intensity - MIN_INTENSITY) / (1 - MIN_INTENSITY));
  }, [colours]);
}

function Cell({
  intensity,
  scale,
  className,
  tip,
  children,
}: {
  intensity: number;
  scale: Scale;
  className?: string;
  tip: React.ReactNode;
  children: React.ReactNode;
}) {
  const fill = intensity ? scale(intensity) : undefined;
  const style = fill ? { backgroundColor: cssColour(fill) } : undefined;
  const ink = fill ? (inkFor(fill) === 'light' ? 'g-text-white' : 'g-text-black') : '';
  return (
    <Tip title={tip}>
      <td className={cn(cellBase, ink, className)} style={style}>
        {children}
      </td>
    </Tip>
  );
}

/**
 * A tooltip on a cell or header, shown at once. Its content goes in a portal: rendered beside the
 * cell, inside the row, the table would lay it out as one more cell.
 */
function Tip({ title, children }: { title: React.ReactNode; children: React.ReactElement }) {
  const container = usePortalContainer();
  return (
    <Tooltip delayDuration={0} disableHoverableContent>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal container={container}>
        {/* The site's styles (font and all) apply inside .gbif, as for popovers. */}
        <div className="gbif">
          <TooltipContent className="g-max-w-96 g-pointer-events-none">{title}</TooltipContent>
        </div>
      </TooltipPortal>
    </Tooltip>
  );
}

/** The Total labels have the weight of the totals. */
const totalLabel = 'g-font-medium g-text-slate-700';
const totalCell = cn(rest, 'g-text-slate-700 g-font-medium');
/**
 * A column only as wide as its longest word or number, with its label folded onto a line per word
 * ("No / value"), so the short Other and No value columns don't take room from the values.
 */
const narrow = 'g-w-[1%]';
const Folded = ({ children }: { children: React.ReactNode }) => (
  <span className="g-inline-block g-w-min">{children}</span>
);

/** Column labels longer than this are cut, with the whole label in the tooltip. */
const MAX_LABEL = 60;
const cutLabel = (label: string) =>
  label.length > MAX_LABEL ? `${label.slice(0, MAX_LABEL - 1).trimEnd()}…` : label;

/** A column header, with the whole label (or what the column holds) in its tooltip. */
function ColumnHeader({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tip title={label}>
      <th scope="col" className={cn(th, 'g-text-end', className)}>
        {children}
      </th>
    </Tip>
  );
}

/** A total, with what it counts in its tooltip. */
function TotalCell({ hint, children }: { hint: string; children: React.ReactNode }) {
  return (
    <Tip title={hint}>
      <td className={totalCell}>{children}</td>
    </Tip>
  );
}

function RowHeader({
  line,
  axis,
  common,
}: {
  line: Line;
  axis: AxisPlan;
  common: Pick<CommonProps, 'interactive' | 'onPick'>;
}) {
  return (
    <Tip title={line.label}>
      <th scope="row" className={cn(th, 'g-align-middle g-whitespace-nowrap')}>
        <Pickable
          on={common.interactive && canFilter(axis)}
          label={line.label}
          onClick={() => common.onPick(lineFilter(axis, line.key))}
        >
          {/* Long labels (dataset titles) would push the table wide: cut them, the whole one on hover. */}
          <span className="g-block g-max-w-[16rem] g-truncate">{line.label}</span>
        </Pickable>
      </th>
    </Tip>
  );
}

/** Rows and columns, a count for each pair, coloured by the chosen measure. */
export function Heatmap({ table, ...common }: CommonProps & { table: Table }) {
  const f = useFormatters();
  const scale = useScale();
  const { rows, cols, shade, interactive, onPick } = common;
  const cell = (i: number, j: number) =>
    asShown(shade, measure(shade, table.counts[i][j], table.rows[i].count, table.cols[j].count));
  const intensity = useMemo(
    () => makeIntensity(table.counts.flatMap((row, i) => row.map((_, j) => cell(i, j)))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, shade]
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="g-overflow-auto">
        <table aria-label={common.caption} className="g-w-full g-text-sm g-border-collapse">
          <thead>
            <tr>
              <th scope="col" className={th}>
                {f.corner(common.rowLabel, common.colLabel)}
              </th>
              {table.cols.map((c, j) => (
                <ColumnHeader key={j} label={c.label}>
                  <Pickable
                    on={interactive && canFilter(cols)}
                    label={c.label}
                    onClick={() => onPick(lineFilter(cols, c.key))}
                  >
                    {cutLabel(c.label)}
                  </Pickable>
                </ColumnHeader>
              ))}
              {table.showOther && (
                <ColumnHeader label={f.otherHint(common.colLabel)} className={narrow}>
                  <Folded>{f.otherLabel}</Folded>
                </ColumnHeader>
              )}
              {table.showNoValue && (
                <ColumnHeader label={f.noValueHint(common.colLabel)} className={narrow}>
                  <Folded>{f.noValueLabel}</Folded>
                </ColumnHeader>
              )}
              <ColumnHeader label={f.rowTotalHint} className={totalLabel}>
                {f.totalLabel}
              </ColumnHeader>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i}>
                <RowHeader line={r} axis={rows} common={common} />
                {table.cols.map((c, j) => {
                  const n = table.counts[i][j];
                  const title = f.cell(r.label, c.label, n, r.count);
                  return (
                    <Cell
                      key={j}
                      intensity={intensity(cell(i, j))}
                      scale={scale}
                      tip={
                        shade === 'column'
                          ? f.cellTip(c.label, n, measure('column', n, r.count, c.count), 'column')
                          : f.cellTip(c.label, n, measure('row', n, r.count, c.count), 'row')
                      }
                      // An empty cell shows the table's grey with a muted 0.
                      className={n > 0 ? undefined : 'g-text-slate-400'}
                    >
                      {n > 0 ? (
                        <Pickable
                          on={interactive && canFilterCell(rows, r.key, cols, c.key)}
                          label={title}
                          onClick={() => onPick(cellFilter(rows, r.key, cols, c.key))}
                        >
                          <Value shade={shade} count={n} share={cell(i, j)} f={f} />
                        </Pickable>
                      ) : (
                        <Value shade={shade} count={0} share={0} f={f} />
                      )}
                    </Cell>
                  );
                })}
                {table.showOther && (
                  <RestCell shade={shade} count={table.other[i]} of={r.count} f={f} />
                )}
                {table.showNoValue && (
                  <RestCell shade={shade} count={table.noValue[i]} of={r.count} f={f} />
                )}
                <TotalCell hint={f.rowTotalHint}>{f.count(r.count)}</TotalCell>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {/* Each column's records in all rows, including rows not shown. */}
              <Tip title={f.columnTotalHint}>
                <th scope="row" className={cn(th, totalLabel)}>
                  {f.totalLabel}
                </th>
              </Tip>
              {table.cols.map((c, j) => (
                <TotalCell key={j} hint={f.columnTotalHint}>
                  {f.count(c.count)}
                </TotalCell>
              ))}
              {table.showOther && (
                <TotalCell hint={f.columnTotalHint}>
                  {table.otherTotal === null ? '' : f.count(table.otherTotal)}
                </TotalCell>
              )}
              {table.showNoValue && (
                <TotalCell hint={f.columnTotalHint}>
                  {table.noValueTotal === null ? '' : f.count(table.noValueTotal)}
                </TotalCell>
              )}
              {/* All records under the filter. */}
              <TotalCell hint={f.allHint}>{f.count(table.total)}</TotalCell>
            </tr>
          </tfoot>
        </table>
      </div>
    </TooltipProvider>
  );
}

/**
 * A row's "other" or "no value": a count, or its share of the row when shares of rows are shown (the
 * row's total includes it). A share of a column means nothing for them, so that shows the count. An
 * empty one shows a muted 0, like an empty cell; null (not knowable) shows nothing.
 */
function RestCell({
  shade,
  count,
  of,
  f,
}: {
  shade: Shade;
  count: number | null;
  of: number;
  f: ReturnType<typeof useFormatters>;
}) {
  if (count === null) return <td className={rest} />;
  const text = shade === 'row' ? f.share(of ? count / of : 0) : f.count(count);
  return <td className={cn(rest, count > 0 ? undefined : 'g-text-slate-400')}>{text}</td>;
}

/** The cell's text: the count, or the share. */
function Value({
  shade,
  count,
  share,
  f,
}: {
  shade: Shade;
  count: number;
  share: number;
  f: ReturnType<typeof useFormatters>;
}) {
  // The count is in the cell's tooltip when a share is shown.
  return <>{shade === 'count' ? f.count(count) : f.share(share)}</>;
}

/** Each row lists its own biggest values of the column, named in the cells. */
export function RankedHeatmap({ table, ...common }: CommonProps & { table: Ranked }) {
  const f = useFormatters();
  const scale = useScale();
  const { rows, cols, shade, interactive, onPick } = common;
  const value = (count: number, total: number) =>
    asShown(shade, measure(shade, count, total, total));
  const intensity = useMemo(
    () => makeIntensity(table.rows.flatMap((r) => r.items.map((i) => value(i.count, r.count)))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, shade]
  );
  const ranks = Array.from({ length: table.width }, (_, i) => i + 1);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="g-overflow-auto">
        <table aria-label={common.caption} className="g-w-full g-text-sm g-border-collapse">
          <thead>
            <tr>
              <th scope="col" className={th}>
                {f.corner(common.rowLabel, common.colLabel)}
              </th>
              {/* Each row's values in order, most frequent first. */}
              {ranks.map((k) => (
                <th key={k} scope="col" className={th}>
                  {f.count(k)}
                </th>
              ))}
              {table.showOther && (
                <ColumnHeader label={f.otherHint(common.colLabel)} className={narrow}>
                  <Folded>{f.otherLabel}</Folded>
                </ColumnHeader>
              )}
              {table.showNoValue && (
                <ColumnHeader label={f.noValueHint(common.colLabel)} className={narrow}>
                  <Folded>{f.noValueLabel}</Folded>
                </ColumnHeader>
              )}
              <ColumnHeader label={f.rowTotalHint} className={totalLabel}>
                {f.totalLabel}
              </ColumnHeader>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i}>
                <RowHeader line={r} axis={rows} common={common} />
                {ranks.map((k) => {
                  const item = r.items[k - 1];
                  if (!item) return <td key={k} className={grid} />;
                  const share = r.count ? item.count / r.count : 0;
                  const title = f.cell(r.label, item.label, item.count, r.count);
                  return (
                    <Cell
                      key={k}
                      intensity={intensity(value(item.count, r.count)) || MIN_INTENSITY}
                      scale={scale}
                      tip={f.cellTip(item.label, item.count, share, 'row')}
                      className="g-text-start g-min-w-[7rem] g-max-w-[10rem]"
                    >
                      <Pickable
                        on={interactive && canFilterCell(rows, r.key, cols, item.key)}
                        label={title}
                        onClick={() => onPick(cellFilter(rows, r.key, cols, item.key))}
                      >
                        <span className="g-block g-truncate">{item.label}</span>
                        <span className="g-block g-text-xs g-truncate">
                          <Value shade={shade} count={item.count} share={share} f={f} />
                        </span>
                      </Pickable>
                    </Cell>
                  );
                })}
                {table.showOther && <RestCell shade={shade} count={r.other} of={r.count} f={f} />}
                {table.showNoValue && (
                  <RestCell shade={shade} count={r.noValue} of={r.count} f={f} />
                )}
                <TotalCell hint={f.rowTotalHint}>{f.count(r.count)}</TotalCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
}

/** A gradient from the least to the most; colour is by rank among the cells shown. */
export function Legend({ shade }: { shade: Shade }) {
  const id = shade === 'count' ? 'count' : 'share';
  const scale = useScale();
  const steps = [0, 0.25, 0.5, 0.75, 1].map((t) =>
    cssColour(scale(MIN_INTENSITY + (1 - MIN_INTENSITY) * t))
  );
  return (
    <div className="g-flex g-items-center g-gap-2 g-text-xs g-text-slate-500 g-mt-2">
      <FormattedMessage id={`dashboard.crosstab.legend.${id}Low`} />
      <span
        aria-hidden="true"
        className="g-inline-block g-h-2 g-w-32 g-rounded"
        style={{
          backgroundImage: `linear-gradient(to right, ${steps.join(', ')})`,
        }}
      />
      <FormattedMessage id={`dashboard.crosstab.legend.${id}High`} />
    </div>
  );
}
