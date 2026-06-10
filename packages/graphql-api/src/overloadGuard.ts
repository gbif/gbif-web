import { monitorEventLoopDelay } from 'node:perf_hooks';
import v8 from 'node:v8';
import { get } from 'lodash';
import type { Request, Response, NextFunction } from 'express';
import config from './config';
import logger from './logger';

/**
 * Pre-Apollo overload guard.
 *
 * Sheds requests with a fast 503 *before* the expensive per-request work (body
 * parse, GraphQL parse/validate, building ~28 data sources). The per-upstream
 * pools (requestPools.ts) are intended to keep individual upstreams from going
 * slow and piling up requests, but if the whole process is overloaded
 * (event loop lag, memory pressure) we want to shed *all* requests before
 * they even get to the pools.
 *
 * Trigger = any configured signal exceeded (OR'd):
 *   - event-loop lag (primary, adaptive: is the process keeping up?)
 *   - in-flight guarded requests (hard backstop on concurrency/memory)
 *   - heap used
 *
 * Disabled by default and only guards configured paths (default /graphql).
 * `/health` is never guarded so load-balancer probes keep succeeding under load
 * (guarding it would pull the instance and recreate the original 503 outage).
 *
 * Config (.env `overloadProtection.*`):
 *   enabled, maxEventLoopDelayMs, maxInFlight, maxHeapUsedFraction,
 *   guardedPaths (string[]), retryAfterSeconds.
 */

function num(path: string, fallbackInfinity = true): number {
  const v = get(config, path);
  const n = Number(v);
  if (Number.isFinite(n) && n > 0) return n;
  return fallbackInfinity ? Infinity : 0;
}

const settings = {
  enabled: Boolean(get(config, 'overloadProtection.enabled', false)),
  maxEventLoopDelayMs: num('overloadProtection.maxEventLoopDelayMs'),
  maxInFlight: num('overloadProtection.maxInFlight'),
  maxHeapUsedFraction: num('overloadProtection.maxHeapUsedFraction'),
  guardedPaths: (get(config, 'overloadProtection.guardedPaths', [
    '/graphql',
  ]) as string[]) ?? ['/graphql'],
  retryAfterSeconds: Number(
    get(config, 'overloadProtection.retryAfterSeconds', 1),
  ),
};

// The histogram is always enabled (it is cheap) so /health can report event-loop
// lag even when the guard itself is disabled — useful for tuning the threshold.
//
// monitorEventLoopDelay arms a timer every RESOLUTION_MS and records the *actual*
// gap between fires. On an idle loop that gap is already ~RESOLUTION_MS and Node
// does NOT subtract it back out, so every raw sample carries a ~RESOLUTION_MS
// floor. We subtract it (clamped at 0) so the reported numbers are *true* lag
// (how far behind the loop is), not lag + the sampling resolution.
const RESOLUTION_MS = 20;
// Only log a new peak once it represents a meaningful stall, otherwise normal
// jitter would log on every small new high during warmup and spam the logs.
const PEAK_LOG_THRESHOLD_MS = 200;
// Startup (module load, JIT warmup, building data sources) reliably stalls the
// loop once. That is a known systemic cost, not load caused by usage, so ignore
// it for peak tracking entirely — otherwise the sticky peak would be pinned to a
// startup spike and suppress logging of later, real stalls.
const STARTUP_GRACE_SECONDS = 2;
const histogram = monitorEventLoopDelay({ resolution: RESOLUTION_MS });
histogram.enable();
const trueLag = (rawMs: number) => Math.max(0, rawMs - RESOLUTION_MS);
let eventLoopDelayMs = 0;
let eventLoopDelayMaxMs = 0; // worst single sample in the most recent window
let peakEventLoopDelayMs = 0; // sticky worst since process start
const SAMPLE_INTERVAL_MS = 2000;
const sampler = setInterval(() => {
  eventLoopDelayMs = trueLag(histogram.mean / 1e6); // ns -> ms, mean since last reset
  eventLoopDelayMaxMs = trueLag(histogram.max / 1e6);
  if (
    process.uptime() >= STARTUP_GRACE_SECONDS &&
    eventLoopDelayMaxMs > peakEventLoopDelayMs
  ) {
    peakEventLoopDelayMs = eventLoopDelayMaxMs;
    // Log the moment a new worst-ever stall is observed so it can be correlated
    // with what the process was doing (startup, a heavy /graphql query, GC).
    if (peakEventLoopDelayMs > PEAK_LOG_THRESHOLD_MS) {
      logger.warn('new peak event-loop lag', {
        eventLoopLagMs: Math.round(peakEventLoopDelayMs * 10) / 10,
        uptimeSeconds: Math.round(process.uptime() * 10) / 10,
      });
    }
  }
  histogram.reset();
}, SAMPLE_INTERVAL_MS);
sampler.unref();

const heapLimitBytes = v8.getHeapStatistics().heap_size_limit;
let inFlight = 0;

function heapUsedFraction(): number {
  return process.memoryUsage().heapUsed / heapLimitBytes;
}

function overloadReason(): string | null {
  if (eventLoopDelayMs > settings.maxEventLoopDelayMs) {
    return `eventLoopDelay ${eventLoopDelayMs.toFixed(0)}ms`;
  }
  if (inFlight >= settings.maxInFlight) {
    return `inFlight ${inFlight}`;
  }
  if (heapUsedFraction() > settings.maxHeapUsedFraction) {
    return `heap ${(heapUsedFraction() * 100).toFixed(0)}%`;
  }
  return null;
}

export function getOverloadStats() {
  const finite = (n: number) => (Number.isFinite(n) ? n : -1);
  return {
    enabled: settings.enabled,
    eventLoopDelayMs: Math.round(eventLoopDelayMs * 10) / 10,
    eventLoopDelayMaxMs: Math.round(eventLoopDelayMaxMs * 10) / 10,
    peakEventLoopDelayMs: Math.round(peakEventLoopDelayMs * 10) / 10,
    inFlight,
    heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1048576),
    heapUsedPercent: Math.round(heapUsedFraction() * 100),
    thresholds: {
      maxEventLoopDelayMs: finite(settings.maxEventLoopDelayMs),
      maxInFlight: finite(settings.maxInFlight),
      maxHeapUsedFraction: finite(settings.maxHeapUsedFraction),
    },
  };
}

export function overloadGuard(req: Request, res: Response, next: NextFunction) {
  // Only concern ourselves with guarded paths (default /graphql; never /health).
  const onGuardedPath = settings.guardedPaths.some((p) =>
    req.path.startsWith(p),
  );
  if (!onGuardedPath) {
    next();
    return;
  }

  // Shed only when enabled and overloaded; the in-flight count is tracked
  // regardless so it is observable on /health even with the guard off (for
  // tuning the maxInFlight backstop before turning it on).
  if (settings.enabled) {
    const reason = overloadReason();
    if (reason) {
      // Intentionally no application-level logging here: the guard's job is to do
      // the minimum under overload, and these are clean HTTP 503s that the edge
      // (Varnish) already logs. The state that triggered shedding is available
      // on /health (incl. sticky peakEventLoopDelayMs).
      res.setHeader('Retry-After', String(settings.retryAfterSeconds));
      res.status(503).json({
        error: 'Service overloaded, please retry shortly.',
        reason,
      });
      return;
    }
  }

  inFlight += 1;
  let released = false;
  const release = () => {
    if (!released) {
      released = true;
      inFlight -= 1;
    }
  };
  res.on('finish', release);
  res.on('close', release);
  next();
}

export default overloadGuard;
