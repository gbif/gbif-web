import { cn } from '@/utils/shadcn';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { fillCss, inkFor, readPrimary } from './colour';
import {
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
  rows: AxisPlan;
  cols: AxisPlan;
  shade: Shade;
  /** Cells and headers are buttons that filter. */
  interactive: boolean;
  onPick: PickFilter;
  rowLabel: string;
  colLabel: string;
};

const th = 'g-px-2 g-py-1 g-text-start g-font-normal g-text-slate-600 g-align-bottom';
const cellBase = 'g-px-2 g-py-1 g-text-end g-align-middle g-min-w-[3.5rem]';
const rest = 'g-px-2 g-py-1 g-text-end g-text-slate-500';

function useFormatters() {
  const intl = useIntl();
  return {
    count: (n: number) => intl.formatNumber(n),
    /** A share as a whole percentage, "<1%" for what rounds to nothing. */
    share: (x: number) =>
      x > 0 && x < 0.005
        ? '<1%'
        : intl.formatNumber(x, { style: 'percent', maximumFractionDigits: 0 }),
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
      className="g-w-full g-text-inherit g-[text-align:inherit] hover:g-underline"
    >
      {children}
    </button>
  );
}

function Cell({
  intensity,
  primary,
  title,
  className,
  children,
}: {
  intensity: number;
  primary: ReturnType<typeof readPrimary>;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  const style = intensity ? { backgroundColor: fillCss(intensity) } : undefined;
  const ink = intensity
    ? inkFor(primary, intensity) === 'light'
      ? 'g-text-white'
      : 'g-text-slate-900'
    : '';
  return (
    <td className={cn(cellBase, ink, className)} style={style} title={title}>
      {children}
    </td>
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
        on={common.interactive}
        label={line.label}
        onClick={() => common.onPick(lineFilter(axis, line.key))}
      >
        {line.label}
      </Pickable>
    </th>
  );
}

/** Rows and columns, a count for each pair, coloured by the chosen measure. */
export function Heatmap({ table, ...common }: CommonProps & { table: Table }) {
  const f = useFormatters();
  const primary = useMemo(readPrimary, []);
  const { rows, cols, shade, interactive, onPick } = common;
  const cell = (i: number, j: number) =>
    measure(shade, table.counts[i][j], table.rows[i].count, table.cols[j].count);
  const intensity = useMemo(
    () => makeIntensity(table.counts.flatMap((row, i) => row.map((_, j) => cell(i, j)))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, shade]
  );

  return (
    <div className="g-overflow-auto">
      <table className="g-text-sm g-border-separate g-border-spacing-px">
        <thead>
          <tr>
            <th scope="col" className={th}>
              {common.rowLabel} \ {common.colLabel}
            </th>
            {table.cols.map((c, j) => (
              <th key={j} scope="col" className={cn(th, 'g-text-end')}>
                <Pickable
                  on={interactive}
                  label={c.label}
                  onClick={() => onPick(lineFilter(cols, c.key))}
                >
                  {c.label}
                </Pickable>
              </th>
            ))}
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
              {table.cols.map((c, j) => {
                const n = table.counts[i][j];
                const title = `${r.label} · ${c.label}: ${f.count(n)} (${f.share(r.count ? n / r.count : 0)})`;
                return (
                  <Cell key={j} intensity={intensity(cell(i, j))} primary={primary} title={title}>
                    {n > 0 && (
                      <Pickable
                        on={interactive}
                        label={title}
                        onClick={() =>
                          onPick({ ...lineFilter(rows, r.key), ...lineFilter(cols, c.key) })
                        }
                      >
                        <Value shade={shade} count={n} share={cell(i, j)} f={f} />
                      </Pickable>
                    )}
                  </Cell>
                );
              })}
              <td className={rest}>{table.rest[i] > 0 ? f.count(table.rest[i]) : ''}</td>
              <td className={cn(rest, 'g-text-slate-700')}>{f.count(r.count)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className={th}>
              <FormattedMessage id="dashboard.crosstab.total" />
            </th>
            {table.cols.map((c, j) => (
              <td key={j} className={cn(rest, 'g-text-slate-700')}>
                {f.count(c.count)}
              </td>
            ))}
            <td className={rest}></td>
            <td className={rest}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/** The cell's text: the count, or the share with the count under it. */
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
  if (shade === 'count') return <>{f.count(count)}</>;
  return (
    <>
      <div>{f.share(share)}</div>
      <div className="g-text-[10px] g-opacity-80">{f.count(count)}</div>
    </>
  );
}

/** Each row lists its own biggest values of the column, named in the cells. */
export function RankedHeatmap({ table, ...common }: CommonProps & { table: Ranked }) {
  const f = useFormatters();
  const primary = useMemo(readPrimary, []);
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
      <table className="g-text-sm g-border-separate g-border-spacing-px">
        <thead>
          <tr>
            <th scope="col" className={th}>
              {common.rowLabel} \ {common.colLabel}
            </th>
            {ranks.map((k) => (
              <th key={k} scope="col" className={cn(th, 'g-text-center')}>
                {k}
              </th>
            ))}
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
                if (!item) return <td key={k} />;
                const share = r.count ? item.count / r.count : 0;
                const title = `${r.label} · ${item.label}: ${f.count(item.count)} (${f.share(share)})`;
                return (
                  <Cell
                    key={k}
                    intensity={intensity(value(item.count, r.count)) || MIN_INTENSITY}
                    primary={primary}
                    title={title}
                    className="g-text-start g-min-w-[7rem] g-max-w-[10rem]"
                  >
                    <Pickable
                      on={interactive}
                      label={title}
                      onClick={() =>
                        onPick({ ...lineFilter(rows, r.key), ...lineFilter(cols, item.key) })
                      }
                    >
                      <div className="g-truncate">{item.label}</div>
                      <div className="g-text-xs g-opacity-80">
                        {f.count(item.count)} · {f.share(share)}
                      </div>
                    </Pickable>
                  </Cell>
                );
              })}
              <td className={rest}>{r.rest > 0 ? f.count(r.rest) : ''}</td>
              <td className={cn(rest, 'g-text-slate-700')}>{f.count(r.count)}</td>
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
  return (
    <div className="g-flex g-items-center g-gap-2 g-text-xs g-text-slate-500 g-mt-2">
      <FormattedMessage id={`dashboard.crosstab.legend.${id}Low`} />
      <span
        aria-hidden="true"
        className="g-inline-block g-h-2 g-w-32 g-rounded"
        style={{
          backgroundImage: `linear-gradient(to right, ${fillCss(MIN_INTENSITY)}, ${fillCss(1)})`,
        }}
      />
      <FormattedMessage id={`dashboard.crosstab.legend.${id}High`} />
    </div>
  );
}
