import { cn } from '@/utils/shadcn';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfig } from '@/config/config';
import { cssColour, inkFor, makeScale } from './colour';
import {
  canFilter,
  cellFilter,
  lineFilter,
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
  /** The cell under the pointer or focus, or none: shown in the bar at the bottom of the card. */
  onHover?: (hover: Hover | null) => void;
};

/** What the bar at the bottom of the card says about the cell under the pointer. */
export type Hover = { row: string; column: string; count: number; share: number; of: string };

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
    restLabel: intl.formatMessage({ id: 'dashboard.crosstab.rest' }),
    totalLabel: intl.formatMessage({ id: 'dashboard.crosstab.total' }),
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
  onHover,
  children,
}: {
  intensity: number;
  scale: Scale;
  className?: string;
  /** Shows the cell in the bar at the bottom of the card, at once, unlike a tooltip. */
  onHover?: () => void;
  children: React.ReactNode;
}) {
  const fill = intensity ? scale(intensity) : undefined;
  const style = fill ? { backgroundColor: cssColour(fill) } : undefined;
  const ink = fill ? (inkFor(fill) === 'light' ? 'g-text-white' : 'g-text-slate-900') : '';
  return (
    <td
      className={cn(cellBase, ink, className)}
      style={style}
      onMouseEnter={onHover}
      onFocus={onHover}
    >
      {children}
    </td>
  );
}

const slantedHeader =
  'g-p-0 g-font-normal g-text-slate-600 g-align-bottom g-bg-slate-50 g-border-0 g-border-y g-border-solid g-border-slate-200';
/** Width of the cell after the last slanted header: about what a slanted 10rem label sticks out. */
const spill = 'g-w-24 g-min-w-[6rem]';

/**
 * A column header. Slanted, its label rises at 45° from the bottom of the column, so the column is as
 * narrow as its cells. The slanted headers share one outline: lines above and below, closed by the
 * corner cell on the left and a spill cell after the last column (`spill`) on the right.
 */
function ColumnHeader({
  slanted,
  label,
  children,
}: {
  slanted: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (!slanted) {
    return (
      <th scope="col" className={cn(th, 'g-text-end')}>
        {children}
      </th>
    );
  }
  return (
    <th scope="col" className={slantedHeader}>
      <div className="g-relative g-h-[7.5rem]">
        <div className="g-absolute g-bottom-1 g-left-1/2 g-origin-bottom-left g-rotate-[-45deg] g-whitespace-nowrap g-text-start">
          <span className="g-block g-max-w-[10rem] g-truncate" title={label}>
            {children}
          </span>
        </div>
      </div>
    </th>
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
    <th scope="row" className={cn(th, 'g-align-middle g-whitespace-nowrap')}>
      <Pickable
        on={common.interactive && canFilter(axis)}
        label={line.label}
        onClick={() => common.onPick(lineFilter(axis, line.key))}
      >
        {/* Long labels (dataset titles) would push the table wide: cut them, the full one on hover. */}
        <span className="g-block g-max-w-[16rem] g-truncate" title={line.label}>
          {line.label}
        </span>
      </Pickable>
    </th>
  );
}

/** Rows and columns, a count for each pair, coloured by the chosen measure. */
export function Heatmap({ table, ...common }: CommonProps & { table: Table }) {
  const f = useFormatters();
  const scale = useScale();
  const { rows, cols, shade, interactive, onPick } = common;
  // Shares are short, so the cells can be narrow if the column headers are slanted.
  const slanted = shade !== 'count';
  const cell = (i: number, j: number) =>
    measure(shade, table.counts[i][j], table.rows[i].count, table.cols[j].count);
  const intensity = useMemo(
    () => makeIntensity(table.counts.flatMap((row, i) => row.map((_, j) => cell(i, j)))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, shade]
  );

  return (
    <div className="g-overflow-auto">
      <table
        aria-label={common.caption}
        className="g-w-full g-text-sm g-border-collapse"
        onMouseLeave={() => common.onHover?.(null)}
      >
        <thead>
          <tr>
            <th scope="col" className={th}>
              {f.corner(common.rowLabel, common.colLabel)}
            </th>
            {table.cols.map((c, j) => (
              <ColumnHeader key={j} slanted={slanted} label={c.label}>
                <Pickable
                  on={interactive && canFilter(cols)}
                  label={c.label}
                  onClick={() => onPick(lineFilter(cols, c.key))}
                >
                  {c.label}
                </Pickable>
              </ColumnHeader>
            ))}
            <ColumnHeader slanted={slanted} label={f.restLabel}>
              {f.restLabel}
            </ColumnHeader>
            <ColumnHeader slanted={slanted} label={f.totalLabel}>
              {f.totalLabel}
            </ColumnHeader>
            {/* Slanted labels stick out past the last column: room for them, inside the outline. */}
            {slanted && (
              <th aria-hidden="true" className={cn(slantedHeader, spill, 'g-border-e')} />
            )}
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
                    onHover={() =>
                      common.onHover?.({
                        row: r.label,
                        column: c.label,
                        count: n,
                        share: shade === 'column' ? cell(i, j) : r.count ? n / r.count : 0,
                        of: shade === 'column' ? c.label : r.label,
                      })
                    }
                    // An empty cell shows the table's grey with a muted 0.
                    className={n > 0 ? undefined : 'g-text-slate-400'}
                  >
                    {n > 0 ? (
                      <Pickable
                        on={interactive && canFilter(rows) && canFilter(cols)}
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
              <RestCell shade={shade} count={table.rest[i]} of={r.count} f={f} />
              <td className={cn(rest, 'g-text-slate-700 g-font-medium')}>{f.count(r.count)}</td>
              {slanted && <td aria-hidden="true" />}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className={th}>
              <FormattedMessage id="dashboard.crosstab.total" />
            </th>
            {table.cols.map((c, j) => (
              <td key={j} className={cn(rest, 'g-text-slate-700 g-font-medium')}>
                {f.count(c.count)}
              </td>
            ))}
            <td className={rest}></td>
            <td className={rest}></td>
            {slanted && <td aria-hidden="true" />}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/**
 * A row's "other or no value": a count, or its share of the row when shares of rows are shown (the
 * row's total includes it). A share of a column means nothing for it, so that shows the count. An
 * empty one shows a muted 0, like an empty cell.
 */
function RestCell({
  shade,
  count,
  of,
  f,
}: {
  shade: Shade;
  count: number;
  of: number;
  f: ReturnType<typeof useFormatters>;
}) {
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
  const value = (count: number, total: number) => measure(shade, count, total, total);
  const intensity = useMemo(
    () => makeIntensity(table.rows.flatMap((r) => r.items.map((i) => value(i.count, r.count)))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, shade]
  );
  const ranks = Array.from({ length: table.width }, (_, i) => i + 1);

  return (
    <div className="g-overflow-auto">
      <table
        aria-label={common.caption}
        className="g-w-full g-text-sm g-border-collapse"
        onMouseLeave={() => common.onHover?.(null)}
      >
        <thead>
          <tr>
            {/* The rows and the ranked values need no header: the selectors above name them. Other
                and Total keep theirs, as their numbers would read as values otherwise. */}
            <td colSpan={table.width + 1} className="g-border-0" aria-hidden="true" />
            <th scope="col" className={cn(th, 'g-text-end')}>
              <FormattedMessage id="dashboard.crosstab.rest" />
            </th>
            <th scope="col" className={cn(th, 'g-text-end')}>
              <FormattedMessage id="dashboard.crosstab.total" />
            </th>
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
                    onHover={() =>
                      common.onHover?.({
                        row: r.label,
                        column: item.label,
                        count: item.count,
                        share,
                        of: r.label,
                      })
                    }
                    className="g-text-start g-min-w-[7rem] g-max-w-[10rem]"
                  >
                    <Pickable
                      on={interactive && canFilter(rows) && canFilter(cols)}
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
              <RestCell shade={shade} count={r.rest} of={r.count} f={f} />
              <td className={cn(rest, 'g-text-slate-700 g-font-medium')}>{f.count(r.count)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

/**
 * The cell under the pointer, in a black bar floating at the bottom centre of the card: shown at once,
 * where a tooltip would wait. "Denmark × Human observation", then "145 occurrences · 87% of Denmark".
 */
export function HoverBar({ hover }: { hover: Hover | null }) {
  const intl = useIntl();
  const f = useFormatters();
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'g-pointer-events-none g-absolute g-bottom-3 g-left-1/2 -g-translate-x-1/2 g-z-10 g-max-w-[90%] g-rounded-md g-bg-slate-900 g-px-3 g-py-2 g-text-center g-text-sm g-text-white g-shadow-lg',
        !hover && 'g-hidden'
      )}
    >
      {hover && (
        <>
          <div className="g-truncate g-font-semibold">
            {intl.formatMessage(
              { id: 'dashboard.crosstab.title' },
              { rows: hover.row, cols: hover.column }
            )}
          </div>
          <div>
            {intl.formatMessage({ id: 'dashboard.crosstab.hoverCount' }, { count: hover.count })}
            {' · '}
            {intl.formatMessage(
              { id: 'dashboard.crosstab.hoverShare' },
              { share: f.share(hover.share), of: hover.of }
            )}
          </div>
        </>
      )}
    </div>
  );
}
