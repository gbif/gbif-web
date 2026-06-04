import PQueue from 'p-queue';
import { get } from 'lodash';
import { GraphQLError } from 'graphql';
import config from './config';
import type { PoolName } from './requestAgents';

/**
 * Thrown when a pool's queue is already at its configured depth limit. Rather
 * than accept the request into memory and let an unbounded backlog drag down the
 * whole process, we shed it immediately with a 503 so the client can retry.
 */
export class PoolOverloadError extends GraphQLError {
  constructor(pool: PoolName, depth: number) {
    super(
      `Service busy: the graphql pool '${pool}' upstream is overloaded. Please retry.`,
      {
        extensions: {
          code: 'SERVICE_UNAVAILABLE',
          // Distinguishes our deliberate load shedding from an upstream that
          // genuinely returned 503 — the latter must still get full error logging.
          loadShed: true,
          pool,
          queueDepth: depth,
          http: { status: 503 },
        },
      },
    );
  }
}

/**
 * Thrown when the per-pool timeout (`withPoolTimeout`) aborts a request because
 * an upstream took too long.
 *
 * This exists because the timeout aborts the request's AbortSignal, and the
 * underlying fetch then throws a *generic* abort error indistinguishable from a
 * client disconnect ("The user aborted a request."). Surfacing that raw would be
 * misleading: a stuck upstream would be reported — and silently log-suppressed —
 * as if the user simply navigated away. Translating to this distinct error keeps
 * a real timeout visible (504) instead of hidden.
 */
export class PoolTimeoutError extends GraphQLError {
  constructor(pool: PoolName, ms: number, target?: string) {
    const where = target ? ` to ${target}` : '';
    super(
      `Upstream timeout: the graphql pool '${pool}' request ${where} exceeded ${ms}ms and was aborted.`,
      {
        extensions: {
          code: 'GATEWAY_TIMEOUT',
          // Marks an abort caused by our own pool timeout, so it is not mistaken
          // for (and log-suppressed as) a benign client disconnect.
          poolTimeout: true,
          pool,
          timeoutMs: ms,
          // The endpoint that timed out, so logs say *what* was slow.
          ...(target ? { target } : {}),
          http: { status: 504 },
        },
      },
    );
  }
}

/**
 * Per-upstream limits.
 *
 * Each upstream the GraphQL API talks to (es-api/occurrence, the taxon API,
 * the general v1 API, ...) is given its own process-wide concurrency
 * limit. Because the whole service runs in a single Node process an upstream that goes slow can,
 * without a cap, accumulate unbounded in-flight requests. That pile of pending
 * work (open sockets + buffered responses + live operation state) drives memory
 * and GC pressure that stalls the event loop and slows *every* endpoint, even
 * ones that never touch the slow upstream (e.g. dataset search).
 *
 * A shared, bounded queue per pool isolates that blast radius: when es-api
 * grinds to a halt only es-api-backed work backs up, while the rest of the
 * process keeps its headroom. This is the bulkhead pattern.
 *
 * NOTE: the queue alone is not enough — if every running slot is stuck on a
 * hung upstream the queue never drains. The per-pool request timeout
 * (see `withPoolTimeout` / `requestAgents.ts`) is what recycles slots so the
 * pool recovers instead of dead-locking.
 *
 * All limits are configurable per pool via `.env` (`requestPools.<pool>.*`).
 * The default concurrency is `Infinity` (behaviour-neutral) so enabling a cap
 * is an explicit, tunable decision per environment.
 */

const DEFAULT_TIMEOUT_MS = 30000; // conservative: only abort genuinely stuck requests

// One shared queue per pool, created lazily and kept for the life of the process.
const queues = new Map<PoolName, PQueue>();

function resolveConcurrency(pool: PoolName): number {
  const value = get(config, ['requestPools', pool, 'concurrency'], Infinity);
  // Treat null / 0 / "unbounded" as "no limit" so it can be turned off in config.
  if (
    value === null ||
    value === undefined ||
    value === 0 ||
    value === 'unbounded'
  ) {
    return Infinity;
  }
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : Infinity;
}

function resolveMaxQueueDepth(pool: PoolName): number {
  const value = get(config, ['requestPools', pool, 'maxQueueDepth'], Infinity);
  if (
    value === null ||
    value === undefined ||
    value === 0 ||
    value === 'unbounded'
  ) {
    return Infinity;
  }
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : Infinity;
}

export function poolTimeoutMs(pool: PoolName): number {
  const value = get(
    config,
    ['requestPools', pool, 'timeoutMs'],
    DEFAULT_TIMEOUT_MS,
  );
  if (value === null || value === undefined || value === 'none')
    return Infinity;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_TIMEOUT_MS;
}

const DEFAULT_PER_REQUEST_CONCURRENCY = 10;

/**
 * Per-GraphQL-request fan-out cap for a pool. A single query can fan out into
 * many enQueued calls (e.g. occurrence search resolves each facet/stat/histogram
 * field as its own es-api search); this limits how many of one request's calls
 * run at once so a single greedy query cannot monopolise the shared pool.
 * Configurable via `requestPools.<pool>.perRequestConcurrency`.
 */
export function poolPerRequestConcurrency(pool: PoolName): number {
  const value = get(
    config,
    ['requestPools', pool, 'perRequestConcurrency'],
    DEFAULT_PER_REQUEST_CONCURRENCY,
  );
  if (
    value === null ||
    value === undefined ||
    value === 0 ||
    value === 'unbounded'
  ) {
    return Infinity;
  }
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_PER_REQUEST_CONCURRENCY;
}

export function getPoolQueue(pool: PoolName): PQueue {
  let queue = queues.get(pool);
  if (!queue) {
    queue = new PQueue({ concurrency: resolveConcurrency(pool) });
    queues.set(pool, queue);
  }
  return queue;
}

/**
 * Run `fn` under the process-wide concurrency limit for `pool`. If the pool's
 * queue is already at its configured `maxQueueDepth`, the request is shed
 * immediately with a `PoolOverloadError` (503) instead of being buffered — this
 * is the backpressure that keeps the in-process backlog (and therefore memory)
 * bounded under overload, so a flood to one upstream cannot slow the others.
 */
export function runInPool<T>(pool: PoolName, fn: () => Promise<T>): Promise<T> {
  const queue = getPoolQueue(pool);
  const maxDepth = resolveMaxQueueDepth(pool);
  // queue.size = jobs waiting (not yet started); queue.pending = jobs running.
  if (Number.isFinite(maxDepth) && queue.size >= maxDepth) {
    return Promise.reject(new PoolOverloadError(pool, queue.size));
  }
  return queue.add(fn) as Promise<T>;
}

/** Which signal aborted a request first (or `none` if it did not abort). */
export type AbortCause = 'client' | 'timeout' | 'none';

export interface PoolTimeoutResult<T> {
  /** A copy of `init` whose `signal` also aborts after the pool timeout. */
  init: T;
  /**
   * Why the request aborted, determined by which underlying signal fired first.
   * Call after a failure to tell a real upstream timeout (`timeout`) apart from
   * a genuine client disconnect (`client`) — the underlying fetch reports both
   * identically, so this is the only reliable discriminator.
   */
  abortCause: () => AbortCause;
}

/**
 * Return a copy of `init` whose `signal` aborts after the pool's timeout, in
 * addition to any signal already present (e.g. the per-request abort signal that
 * fires when the client disconnects).
 *
 * The timeout clock starts when this is called, so callers should call it when a
 * request actually begins executing (i.e. once it holds a pool slot), not when
 * it is enqueued — otherwise time spent waiting behind other requests would eat
 * the wire-timeout budget and a slow request could expire its queued siblings
 * before they run. It is the timeout firing on the *running* requests that
 * recycles slots and keeps the queue draining; queue depth is bounded separately
 * by `maxQueueDepth`.
 *
 * Also reports which signal aborted first (`abortCause`) so callers can surface
 * a timeout as a distinct, visible error rather than a generic abort.
 */
export function withPoolTimeout<T extends { signal?: AbortSignal }>(
  pool: PoolName,
  init: T,
): PoolTimeoutResult<T> {
  const clientSignal = init.signal;
  const ms = poolTimeoutMs(pool);
  if (!Number.isFinite(ms)) {
    return {
      init,
      abortCause: () => (clientSignal?.aborted ? 'client' : 'none'),
    };
  }

  const timeoutSignal = AbortSignal.timeout(ms);

  // Record which signal fired first; the combined signal only tells us *that* it
  // aborted, not which source caused it.
  let cause: AbortCause = 'none';
  const mark = (kind: 'client' | 'timeout') => () => {
    if (cause === 'none') cause = kind;
  };
  timeoutSignal.addEventListener('abort', mark('timeout'), { once: true });
  clientSignal?.addEventListener('abort', mark('client'), { once: true });

  const signal = clientSignal
    ? AbortSignal.any([clientSignal, timeoutSignal])
    : timeoutSignal;

  return { init: { ...init, signal }, abortCause: () => cause };
}

/** Lightweight snapshot for diagnostics / health output. (-1 means unbounded.) */
export function getPoolStats() {
  const unbounded = (n: number) => (Number.isFinite(n) ? n : -1);
  const stats: Record<
    string,
    {
      waiting: number;
      running: number;
      concurrency: number;
      maxQueueDepth: number;
      timeoutMs: number;
    }
  > = {};
  Array.from(queues.entries()).forEach(([pool, queue]) => {
    stats[pool] = {
      waiting: queue.size, // queued, not yet started
      running: queue.pending, // currently in flight
      concurrency: unbounded(queue.concurrency as number),
      maxQueueDepth: unbounded(resolveMaxQueueDepth(pool)),
      timeoutMs: unbounded(poolTimeoutMs(pool)),
    };
  });
  return stats;
}
