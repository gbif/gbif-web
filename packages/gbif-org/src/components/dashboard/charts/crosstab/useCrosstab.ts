import { useConfig } from '@/config/config';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import { useI18n } from '@/reactRouterPlugins';
import { GraphQLService } from '@/services/graphQLService';
import { useEffect, useState } from 'react';
import type { Dimension } from './dimensions';
import {
  buildCoarseQuery,
  buildQuery,
  buildStatsQuery,
  buildValueCountQuery,
  LIMITS,
  needsValueCounts,
  pagesRows,
  rowValuePredicate,
  valueCountPredicate,
  valueTotalPredicate,
  planAxes,
  robustRange,
  withWindows,
  type AxisPlan,
  type CoarseData,
  type CrosstabData,
  type StatsData,
} from './plan';

export type CrosstabInput = {
  predicate?: unknown;
  q?: string;
  rows: Dimension;
  cols: Dimension;
  /** Bucket sizes the user asked for, for numeric axes. */
  ask: { rows?: number; cols?: number };
  /** Which page of rows, from 0, when the rows are paged (`pagesRows`). */
  rowPage?: number;
};

export type CrosstabState = {
  loading: boolean;
  error?: string;
  /** The answer and the plan it answers: kept together, so a table never mixes two requests. */
  loaded?: {
    data: CrosstabData;
    /** The page of rows this is. */
    rowPage: number;
    /** The bucket sizes asked for when this was fetched. */
    ask: { rows?: number; cols?: number };
    /** Per row shown, the records with a column value, when they had to be counted (`needsValueCounts`). */
    values?: CrosstabData;
    rows: AxisPlan;
    cols: AxisPlan;
    auto: { rows?: number; cols?: number };
    raised: { rows: boolean; cols: boolean };
  };
};

type Errors = { message: string }[] | undefined;

/**
 * Loads the table. A numeric axis needs its minimum and maximum, and where most records are, before a
 * bucket size can be chosen: three requests in a row when there is one, and a single request otherwise. A change cancels what is
 * on its way. The previous table stays on screen, dimmed, until the next arrives.
 */
export function useCrosstab({
  predicate,
  q,
  rows,
  cols,
  ask,
  rowPage = 0,
}: CrosstabInput): CrosstabState {
  const config = useConfig();
  const { locale } = useI18n();
  const checklistKey = useChecklistKey();
  const language = locale.vocabularyLocale ?? locale.localeCode;
  const [state, setState] = useState<CrosstabState>({ loading: true });

  const needsChecklist = rows.checklist || cols.checklist;
  const signature = JSON.stringify([
    predicate,
    q,
    rows.id,
    cols.id,
    ask,
    rowPage,
    language,
    needsChecklist ? checklistKey : null,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    const service = new GraphQLService({
      endpoint: config.graphqlEndpoint,
      locale: locale.cmsLocale || locale.code,
      abortSignal: controller.signal,
    });

    async function run<T>(
      query: string,
      variables: Record<string, unknown>
    ): Promise<{ data: T; errors?: string }> {
      const response = await service.query<T, Record<string, unknown>>(query, variables);
      const body = await response.json();
      const errors = (body as { errors?: Errors }).errors?.map((e) => e.message).join(' ');
      if (!body.data) throw new Error(errors || `${response.status} ${response.statusText}`);
      return { data: body.data, errors };
    }

    setState((s) => ({ ...s, loading: true, error: undefined }));
    (async () => {
      const statsQuery = buildStatsQuery(rows, cols);
      const stats = statsQuery
        ? (await run<StatsData>(statsQuery, { predicate, q })).data
        : undefined;
      // Outliers can stretch a numeric scale so that nearly everything falls in one bucket: look at
      // where the records are before choosing buckets.
      const coarseQuery = buildCoarseQuery(rows, cols, stats);
      const coarse = coarseQuery
        ? (await run<CoarseData>(coarseQuery, { predicate, q })).data
        : undefined;
      const range = (alias: 'rows' | 'cols') =>
        robustRange(coarse, alias, stats?.search?.stats?.[alias]);
      const plan = planAxes(rows, cols, stats, ask, {
        rows: range('rows'),
        cols: range('cols'),
      });
      const query = buildQuery(plan.rows, plan.cols);
      const tablePredicate = withWindows(predicate, [plan.rows, plan.cols]);
      const from = pagesRows(plan.rows) ? { from: rowPage * LIMITS.rows } : {};
      const { data, errors } = await run<CrosstabData>(query, {
        predicate: tablePredicate,
        rowValuePredicate: rowValuePredicate(
          tablePredicate,
          plan.rows,
          needsChecklist ? checklistKey : undefined
        ),
        q,
        language,
        ...from,
        ...(needsChecklist ? { checklistKey } : {}),
      });
      // A failed field can blank a whole axis while the rest arrives: that is an error, not "no data".
      const search = data.search;
      const answered = search?.facet?.rows?.length || search?.histogram?.rows?.buckets?.length;
      if (errors && !answered) throw new Error(errors);
      // Splitting other from no value sometimes needs a small count; without it the table still shows,
      // from what the main answer allows.
      let values: CrosstabData | undefined;
      if (needsValueCounts(data, plan.rows, plan.cols)) {
        values = await run<CrosstabData>(buildValueCountQuery(plan.rows), {
          q,
          language,
          predicate: valueCountPredicate(
            tablePredicate,
            data,
            plan.rows,
            plan.cols,
            needsChecklist ? checklistKey : undefined
          ),
          allPredicate: valueTotalPredicate(
            tablePredicate,
            plan.cols,
            needsChecklist ? checklistKey : undefined
          ),
          ...(needsChecklist ? { checklistKey } : {}),
        })
          .then((r) => r.data)
          .catch(() => undefined);
      }
      setState({ loading: false, loaded: { data, rowPage, ask, values, ...plan } });
    })().catch((error) => {
      if (controller.signal.aborted) return;
      // The previous table is dropped: it would sit under axis names it no longer matches.
      setState({ loading: false, error: error instanceof Error ? error.message : String(error) });
    });
    return () => controller.abort();
    // The signature stands for every input; rows and cols are looked up by id from a fixed list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, config.graphqlEndpoint, locale.cmsLocale, locale.code]);

  return state;
}
