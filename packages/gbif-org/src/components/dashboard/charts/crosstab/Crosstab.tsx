import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/smallCard';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CardHeader } from '../../shared';
import ChartClickWrapper from '../ChartClickWrapper';
import { ChartMessages } from '../OneDimensionalChart';
import { AxisControl, Segmented, SwapButton } from './Controls';
import { getDimension, type Dimension } from './dimensions';
import { Heatmap, Legend, RankedHeatmap } from './Heatmap';
import {
  columnCardinality,
  fitsOverall,
  LIMITS,
  shapeRanked,
  shapeTable,
  type Layout,
  type Shade,
} from './plan';
import { useCrosstab } from './useCrosstab';

export const DEFAULT_ROWS = 'basisOfRecord';
export const DEFAULT_COLS = 'year';

type Params = {
  rows?: unknown;
  cols?: unknown;
  rInt?: unknown;
  cInt?: unknown;
  shade?: unknown;
};

type CrosstabProps = Params & {
  predicate?: unknown;
  q?: string;
  /** Persist a setting in the dashboard layout. Without it the chart keeps its settings itself. */
  onParamsChange?: (params: Record<string, unknown>) => void;
  handleRedirect?: (args: { filter?: Record<string, unknown> }) => void;
  interactive?: boolean;
};

/** A bucket size from the layout URL: a positive, finite number, or nothing. */
const positive = (v: unknown) =>
  Number(v) > 0 && Number.isFinite(Number(v)) ? Number(v) : undefined;

/**
 * A two-dimensional chart: any two dimensions, a count for each pair, shown as a heatmap. Numbers are
 * bucketed by a size that defaults to about ten buckets. Cells are coloured by count (absolute) or by
 * share of the row or column (relative). A click on a cell or a header filters.
 */
function CrosstabMain(props: CrosstabProps) {
  const { predicate, q, onParamsChange, handleRedirect, interactive = false } = props;
  const intl = useIntl();
  // Settings persisted in the layout come from URLs, so they are checked. Without a dashboard to keep
  // them, they are kept here.
  const [local, setLocal] = useState<Params>({});
  const get = (key: keyof Params) => props[key] ?? local[key];
  const update = (patch: Params) =>
    onParamsChange ? onParamsChange(patch) : setLocal((l) => ({ ...l, ...patch }));

  const rows = getDimension(get('rows'), DEFAULT_ROWS);
  const colsWanted = getDimension(get('cols'), DEFAULT_COLS);
  // The same dimension on both axes is a table of its own diagonal: use the other default.
  const cols =
    colsWanted.id === rows.id
      ? getDimension(rows.id === DEFAULT_COLS ? DEFAULT_ROWS : DEFAULT_COLS, '')
      : colsWanted;
  const ask = {
    rows: rows.kind === 'histogram' ? positive(get('rInt')) : undefined,
    cols: cols.kind === 'histogram' ? positive(get('cInt')) : undefined,
  };
  const state = useCrosstab({ predicate, q, rows, cols, ask });
  const { loaded } = state;

  // The columns that are biggest overall, when that is exact: the column has few enough values
  // (`fitsOverall`). Otherwise the same data is shown as each row's own biggest values, which are exact.
  const fits = loaded ? fitsOverall(loaded.data, loaded.rows, loaded.cols) : true;
  const shownLayout: Layout | undefined = loaded ? (fits ? 'overall' : 'perRow') : undefined;
  // The title and colour choices follow the column chosen now; only data for it says how it is shown.
  const layout: Layout = loaded && loaded.cols.dim.id === cols.id && !fits ? 'perRow' : 'overall';
  const wantedShade = get('shade');
  const shade: Shade =
    wantedShade === 'row' || (wantedShade === 'column' && layout === 'overall')
      ? wantedShade
      : 'count';

  const name = (d: Dimension) => intl.formatMessage({ id: d.labelId, defaultMessage: d.id });
  const fmt = (n: number) => intl.formatNumber(n);
  const formatting = {
    number: fmt,
    range: (from: string, to: string) =>
      intl.formatMessage({ id: 'dashboard.crosstab.range' }, { from, to }),
  };
  // Read by the layout the data was asked for, not the one chosen since: until the new data arrives the
  // old table stays, and must be read as it was fetched.
  const table = useMemo(
    () =>
      loaded && shownLayout === 'overall'
        ? shapeTable(loaded.data, loaded.rows, loaded.cols, formatting)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded, shownLayout]
  );
  const ranked = useMemo(
    () =>
      loaded && shownLayout === 'perRow'
        ? shapeRanked(loaded.data, loaded.rows, loaded.cols, formatting)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded, shownLayout]
  );

  const setRows = (id: string) =>
    id === cols.id
      ? update({ rows: id, cols: rows.id, rInt: get('cInt'), cInt: get('rInt') })
      : update({ rows: id, cols: cols.id, rInt: undefined });
  const setCols = (id: string) =>
    id === rows.id
      ? update({ rows: cols.id, cols: id, rInt: get('cInt'), cInt: get('rInt') })
      : update({ rows: rows.id, cols: id, cInt: undefined });
  const swap = () => update({ rows: cols.id, cols: rows.id, rInt: get('cInt'), cInt: get('rInt') });

  const title = intl.formatMessage(
    { id: layout === 'perRow' ? 'dashboard.crosstab.titleTopPer' : 'dashboard.crosstab.titleBy' },
    { rows: name(rows), cols: name(cols) }
  );
  const shown = loaded && (table ? table.rows.length : ranked ? ranked.rows.length : 0);

  const messages: React.ReactNode[] = [];
  if (loaded && shown) {
    const note = (key: string, values?: Record<string, string | number>, id: string = key) =>
      messages.push(
        <FormattedMessage key={key} id={`dashboard.crosstab.notes.${id}`} values={values} />
      );
    const rowsOther = table ? table.rowsOther : ranked ? ranked.rowsOther : 0;
    if (rowsOther > 0) note('rowsOther', { count: fmt(rowsOther) });
    if (!fits) {
      note('tooManyColumns', {
        dimension: name(loaded.cols.dim),
        count: fmt(columnCardinality(loaded.data) ?? LIMITS.nested),
        n: LIMITS.nested,
        rank: LIMITS.rank,
      });
    } else if (loaded.cols.dim.kind === 'terms') note('columns', { n: LIMITS.cols });
    if (rows.multi || cols.multi) note('multi');
    if (shade === 'column') note(table?.colTotalsKnown ? 'shadeColumn' : 'shadeColumnShown');
    (['rows', 'cols'] as const).forEach((axis) => {
      const { interval: size, window, dim } = loaded[axis];
      if (window) {
        const values = { dimension: name(dim), from: fmt(window.from), to: fmt(window.to) };
        note(`window-${axis}`, values, 'window');
      }
      if (loaded.raised[axis] && size !== undefined) {
        note(`raised-${axis}`, { size: fmt(size), dimension: name(dim) }, 'raised');
      }
    });
  }

  const common = {
    caption: title,
    rows: loaded?.rows ?? { dim: rows },
    cols: loaded?.cols ?? { dim: cols },
    shade,
    interactive: !!interactive && !!handleRedirect,
    onPick: (filter: Record<string, unknown[]>) => handleRedirect?.({ filter }),
    rowLabel: name((loaded?.rows ?? { dim: rows }).dim),
    colLabel: name((loaded?.cols ?? { dim: cols }).dim),
  };

  return (
    <Card loading={state.loading} error={!!state.error && !loaded}>
      <CardHeader>
        <div className="g-flex g-flex-col g-gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <FormattedMessage id="dashboard.numberOfOccurrences" />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="g-flex g-flex-wrap g-items-center g-gap-2 g-mb-3">
          <AxisControl
            label={intl.formatMessage({ id: 'dashboard.crosstab.rows' })}
            dimension={rows}
            onChange={setRows}
            bucketLabel={intl.formatMessage(
              { id: 'dashboard.crosstab.bucketSizeFor' },
              { dimension: name(rows) }
            )}
            interval={ask.rows}
            auto={loaded?.auto.rows}
            onInterval={(size) => update({ rInt: size })}
          />
          <SwapButton
            label={intl.formatMessage({ id: 'dashboard.crosstab.swap' })}
            onClick={swap}
          />
          <AxisControl
            label={intl.formatMessage({ id: 'dashboard.crosstab.columns' })}
            dimension={cols}
            onChange={setCols}
            bucketLabel={intl.formatMessage(
              { id: 'dashboard.crosstab.bucketSizeFor' },
              { dimension: name(cols) }
            )}
            interval={ask.cols}
            auto={loaded?.auto.cols}
            onInterval={(size) => update({ cInt: size })}
          />
        </div>
        <div className="g-flex g-flex-wrap g-items-center g-gap-2 g-mb-3">
          <Segmented<Shade>
            label={intl.formatMessage({ id: 'dashboard.crosstab.shade' })}
            value={shade}
            onChange={(value) => update({ shade: value })}
            options={[
              { id: 'count', text: intl.formatMessage({ id: 'dashboard.crosstab.shadeCount' }) },
              { id: 'row', text: intl.formatMessage({ id: 'dashboard.crosstab.shadeRow' }) },
              ...(layout === 'overall'
                ? [
                    {
                      id: 'column' as const,
                      text: intl.formatMessage({ id: 'dashboard.crosstab.shadeColumn' }),
                    },
                  ]
                : []),
            ]}
          />
        </div>
        {state.error && (
          <p className="g-text-sm g-text-red-600" role="alert">
            {state.error}
          </p>
        )}
        {loaded && shown === 0 && (
          <p className="g-text-sm g-text-slate-500">
            <FormattedMessage id="dashboard.noData" />
          </p>
        )}
        {table && shown ? <Heatmap table={table} {...common} /> : null}
        {ranked && shown ? <RankedHeatmap table={ranked} {...common} /> : null}
        {loaded && shown ? <Legend shade={shade} /> : null}
        <div className="g-mt-2">
          <ChartMessages messages={messages} />
        </div>
      </CardContent>
    </Card>
  );
}

export function Crosstab(props: Record<string, unknown>) {
  return (
    <ChartClickWrapper {...props}>
      <CrosstabMain />
    </ChartClickWrapper>
  );
}
