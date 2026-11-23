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
  LIMITS,
  planAxes,
  robustRange,
  withWindows,
  type AxisPlan,
  type CoarseData,
  type CrosstabData,
  type Layout,
  type StatsData,
} from './plan';

export type CrosstabInput = {
  predicate?: unknown;
  q?: string;
  rows: Dimension;
  cols: Dimension;
  /** Bucket sizes the user asked for, for numeric axes. */
  ask: { rows?: number; cols?: number };
  layout: Layout;
};

export type CrosstabState = {
  loading: boolean;
  error?: string;
  /** The answer and the plan it answers: kept together, so a table never mixes two requests. */
  loaded?: {
    data: CrosstabData;
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
  layout,
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
    layout,
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

    async function run<T>(query: string, variables: Record<string, unknown>): Promise<T> {
      const response = await service.query<T, Record<string, unknown>>(query, variables);
      const body = await response.json();
      // Partial answers (a label that failed) are still a table; no data at all is an error.
      if (!body.data) {
        const errors = (body as { errors?: Errors }).errors;
        throw new Error(
          errors?.map((e) => e.message).join(' ') || `${response.status} ${response.statusText}`
        );
      }
      return body.data;
    }

    setState((s) => ({ ...s, loading: true, error: undefined }));
    (async () => {
      const statsQuery = buildStatsQuery(rows, cols);
      const stats = statsQuery ? await run<StatsData>(statsQuery, { predicate, q }) : undefined;
      // Outliers can stretch a numeric scale so that nearly everything falls in one bucket: look at
      // where the records are before choosing buckets.
      const coarseQuery = buildCoarseQuery(rows, cols, stats);
      const coarse = coarseQuery ? await run<CoarseData>(coarseQuery, { predicate, q }) : undefined;
      const range = (alias: 'rows' | 'cols', dim: Dimension) =>
        robustRange(coarse, alias, stats?.search?.stats?.[alias], !!dim.integer);
      const plan = planAxes(rows, cols, stats, ask, {
        rows: range('rows', rows),
        cols: range('cols', cols),
      });
      const query = buildQuery(
        plan.rows,
        plan.cols,
        layout === 'perRow' ? LIMITS.rank : LIMITS.nested
      );
      const data = await run<CrosstabData>(query, {
        predicate: withWindows(predicate, [plan.rows, plan.cols]),
        q,
        language,
        ...(needsChecklist ? { checklistKey } : {}),
      });
      setState({ loading: false, loaded: { data, ...plan } });
    })().catch((error) => {
      if (controller.signal.aborted) return;
      setState((s) => ({
        ...s,
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      }));
    });
    return () => controller.abort();
    // The signature stands for every input; rows and cols are looked up by id from a fixed list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, config.graphqlEndpoint, locale.cmsLocale, locale.code]);

  return state;
}
