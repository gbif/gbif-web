import { Button } from '@/components/ui/button';
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
  pagesRows,
  rowCardinality,
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

  // A dimension that can only be columns (from a shared link, or a swap) falls back to the default.
  const rowsWanted = getDimension(get('rows'), DEFAULT_ROWS);
  const rows = rowsWanted.columnsOnly ? getDimension(DEFAULT_ROWS, '') : rowsWanted;
  // The same dimension may be on both axes: for a multi-valued field it shows which values go together.
  const cols = getDimension(get('cols'), DEFAULT_COLS);
  const ask = {
    rows: rows.kind === 'histogram' ? positive(get('rInt')) : undefined,
    cols: cols.kind === 'histogram' ? positive(get('cInt')) : undefined,
  };
  // The page of rows, kept with what it is a page of: a new filter or axis starts again at the first.
  const pageOf = JSON.stringify([predicate, q, rows.id, cols.id, ask]);
  const [paging, setPaging] = useState({ of: pageOf, page: 0 });
  const rowPage = paging.of === pageOf ? paging.page : 0;
  const setRowPage = (page: number) => setPaging({ of: pageOf, page });

  const state = useCrosstab({ predicate, q, rows, cols, ask, rowPage });
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
        ? shapeTable(loaded.data, loaded.rows, loaded.cols, formatting, loaded.values)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded, shownLayout]
  );
  const ranked = useMemo(
    () =>
      loaded && shownLayout === 'perRow'
        ? shapeRanked(loaded.data, loaded.rows, loaded.cols, formatting, loaded.values)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded, shownLayout]
  );

  const setRows = (id: string) => update({ rows: id, cols: cols.id, rInt: undefined });
  const setCols = (id: string) => update({ rows: rows.id, cols: id, cInt: undefined });
  const swap = () => update({ rows: cols.id, cols: rows.id, rInt: get('cInt'), cInt: get('rInt') });

  // A bucket size that was raised, for the mark next to its field: only from data fetched for this
  // axis and this size, so the field doesn't jump back while a new size loads.
  const raisedFor = (axis: 'rows' | 'cols', dim: Dimension) => {
    if (!loaded?.raised[axis] || loaded[axis].dim.id !== dim.id) return undefined;
    const size = loaded[axis].interval;
    if (size === undefined || loaded.ask[axis] !== ask[axis]) return undefined;
    return {
      size,
      message: intl.formatMessage(
        { id: 'dashboard.crosstab.notes.raised' },
        { size: fmt(size), dimension: name(dim) }
      ),
    };
  };

  const title = intl.formatMessage(
    // A cross, not a word: it reads the same in every language and has no direction.
    { id: 'dashboard.crosstab.title' },
    { rows: name(rows), cols: name(cols) }
  );
  const shown = loaded && (table ? table.rows.length : ranked ? ranked.rows.length : 0);

  const messages: React.ReactNode[] = [];
  if (loaded && shown) {
    const note = (key: string, values?: Record<string, string | number>, id: string = key) =>
      messages.push(
        <FormattedMessage key={key} id={`dashboard.crosstab.notes.${id}`} values={values} />
      );
    // Records outside the rows shown: in rows not shown, and with no row value, when those are known;
    // otherwise together.
    const outside = table ?? ranked;
    if (outside && outside.noRowValue !== null) {
      if (outside.rowsNotShown) note('rowsNotShown', { count: outside.rowsNotShown });
      if (outside.noRowValue > 0) {
        note('noRowValue', { count: outside.noRowValue, dimension: name(loaded.rows.dim) });
      }
    } else if (outside && outside.rowsOther > 0) {
      note('rowsOther', { count: outside.rowsOther });
    }
    if (!fits) {
      note('tooManyColumns', {
        dimension: name(loaded.cols.dim),
        count: fmt(columnCardinality(loaded.data) ?? LIMITS.nested),
        n: LIMITS.nested,
        rank: LIMITS.rank,
      });
    } else if (table && !table.allCols) note('columns', { n: LIMITS.cols });
    if (rows.multi || cols.multi) note('multi');
    if (shade === 'column') note(table?.colTotalsKnown ? 'shadeColumn' : 'shadeColumnShown');
    (['rows', 'cols'] as const).forEach((axis) => {
      const { interval: size, window, dim } = loaded[axis];
      if (window) {
        // Years read without a thousands separator; elevations and depths with one.
        const value = dim.plain ? String : fmt;
        const values = { dimension: name(dim), from: value(window.from), to: value(window.to) };
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
        {/* The axes on the left; the colour choice on the right, on the same line when there is
            room and below otherwise, still on the right. */}
        <div className="g-flex g-flex-wrap g-items-center g-gap-2 g-mb-3">
          <div className="g-flex g-flex-wrap g-items-center g-gap-2">
            <AxisControl
              forRows
              label={intl.formatMessage({ id: 'dashboard.crosstab.rows' })}
              dimension={rows}
              onChange={setRows}
              bucketLabel={intl.formatMessage(
                { id: 'dashboard.crosstab.bucketSizeFor' },
                { dimension: name(rows) }
              )}
              interval={ask.rows}
              auto={loaded?.auto.rows}
              raised={raisedFor('rows', rows)}
              onInterval={(size) => update({ rInt: size })}
            />
            <SwapButton
              label={intl.formatMessage({ id: 'dashboard.crosstab.swap' })}
              onClick={swap}
              disabled={cols.columnsOnly}
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
              raised={raisedFor('cols', cols)}
              onInterval={(size) => update({ cInt: size })}
            />
          </div>
          <div className="g-ms-auto">
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
        {loaded && shown ? (
          <RowPager
            page={loaded.rowPage}
            shown={shown}
            total={pagesRows(loaded.rows) ? rowCardinality(loaded.data) : null}
            paged={pagesRows(loaded.rows)}
            onPage={setRowPage}
          />
        ) : null}
        {loaded && shown ? <Legend shade={shade} /> : null}
        <div className="g-mt-2">
          <ChartMessages messages={messages} />
        </div>
      </CardContent>
    </Card>
  );
}

/** Previous and next page of rows. The columns stay the same on every page. */
function RowPager({
  page,
  shown,
  total,
  paged,
  onPage,
}: {
  page: number;
  shown: number;
  total: number | null;
  paged: boolean;
  onPage: (page: number) => void;
}) {
  const intl = useIntl();
  if (!paged) return null;
  const first = page * LIMITS.rows;
  // Without a count, a full page may have a next one.
  const hasNext = total !== null ? first + shown < total : shown === LIMITS.rows;
  if (page === 0 && !hasNext) return null;
  return (
    <div className="g-flex g-flex-wrap g-items-center g-gap-2 g-my-2 g-text-sm g-text-slate-600">
      <Button size="sm" variant="secondary" disabled={page === 0} onClick={() => onPage(page - 1)}>
        <FormattedMessage id="pagination.previous" />
      </Button>
      <Button size="sm" variant="secondary" disabled={!hasNext} onClick={() => onPage(page + 1)}>
        <FormattedMessage id="pagination.next" />
      </Button>
      <span>
        {intl.formatMessage(
          { id: 'dashboard.crosstab.rowsShown' },
          {
            from: intl.formatNumber(first + 1),
            to: intl.formatNumber(first + shown),
            total: total !== null ? intl.formatNumber(total) : '…',
          }
        )}
      </span>
    </div>
  );
}

export function Crosstab(props: Record<string, unknown>) {
  return (
    <ChartClickWrapper {...props}>
      <CrosstabMain />
    </ChartClickWrapper>
  );
}
