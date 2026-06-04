import { monitorEventLoopDelay } from 'node:perf_hooks';
import v8 from 'node:v8';
import { get } from 'lodash';
import type { Request, Response, NextFunction } from 'express';
import config from './config';

/**
 * Pre-Apollo overload guard.
 *
 * Sheds requests with a fast 503 *before* the expensive per-request work (body
 * parse, GraphQL parse/validate, building ~28 data sources). This is the global survival
 * net for when the process itself is saturated. Because it is global it sheds
 * indiscriminately, so it is meant to trigger late.
 *
 * Trigger = any configured signal exceeded (OR'd):
 *   - event-loop lag (primary, adaptive: is the process keeping up?)
 *   - in-flight guarded requests (hard backstop on concurrency/memory)
 *   - heap used vs the real V8 limit (pre-empts GC death-spiral / OOM)
 *
 * Disabled by default and only guards configured paths (default /graphql).
 * `/health` is never guarded so load-balancer probes keep succeeding under load
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
const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();
let eventLoopDelayMs = 0;
const SAMPLE_INTERVAL_MS = 250;
const sampler = setInterval(() => {
  eventLoopDelayMs = histogram.mean / 1e6; // ns -> ms, mean since last reset
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
  const guarded =
    settings.enabled &&
    settings.guardedPaths.some((p) => req.path.startsWith(p));
  if (!guarded) {
    next();
    return;
  }

  const reason = overloadReason();
  if (reason) {
    res.setHeader('Retry-After', String(settings.retryAfterSeconds));
    console.log('rejected due to overloading:', reason);
    res.status(503).json({
      error: 'Service overloaded, please retry shortly.',
      reason,
    });
    return;
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
