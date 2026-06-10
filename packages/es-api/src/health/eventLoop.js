const { monitorEventLoopDelay } = require('node:perf_hooks');
const logger = require('../logger');

/**
 * Event-loop lag monitoring — observability only. Nothing acts on these numbers
 * (es-api does no overload shedding); they are exposed on /health and a new
 * worst-ever stall is logged, mirroring the graphql-api overload guard so the
 * two services report lag the same way.
 *
 * monitorEventLoopDelay arms a timer every RESOLUTION_MS and records the *actual*
 * gap between fires. On an idle loop that gap is already ~RESOLUTION_MS and Node
 * does NOT subtract it back out, so every raw sample carries a ~RESOLUTION_MS
 * floor. We subtract it (clamped at 0) so the reported numbers are *true* lag
 * (how far behind the loop is), not lag + the sampling resolution.
 */
const RESOLUTION_MS = 20;
// Only log a new peak once it represents a meaningful stall, otherwise normal
// jitter would log on every small new high during warmup and spam the logs.
const PEAK_LOG_THRESHOLD_MS = 200;
// Startup (module load, JIT warmup, building data sources) reliably stalls the
// loop once. That is a known systemic cost, not load caused by usage, so ignore
// it for peak tracking entirely — otherwise the sticky peak would be pinned to a
// startup spike and suppress logging of later, real stalls.
const STARTUP_GRACE_SECONDS = 10;
const SAMPLE_INTERVAL_MS = 2000;

const histogram = monitorEventLoopDelay({ resolution: RESOLUTION_MS });
histogram.enable();
const trueLag = (rawMs) => Math.max(0, rawMs - RESOLUTION_MS);

let eventLoopDelayMs = 0; // mean over the most recent window
let eventLoopDelayMaxMs = 0; // worst single sample in the most recent window
let peakEventLoopDelayMs = 0; // sticky worst since process start

const sampler = setInterval(() => {
  eventLoopDelayMs = trueLag(histogram.mean / 1e6); // ns -> ms, mean since last reset
  eventLoopDelayMaxMs = trueLag(histogram.max / 1e6);
  if (
    process.uptime() >= STARTUP_GRACE_SECONDS &&
    eventLoopDelayMaxMs > peakEventLoopDelayMs
  ) {
    peakEventLoopDelayMs = eventLoopDelayMaxMs;
    // Log the moment a new worst-ever stall is observed so it can be correlated
    // with what the process was doing (a heavy search, GC, ...).
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

function getEventLoopStats() {
  return {
    eventLoopDelayMs: Math.round(eventLoopDelayMs * 10) / 10,
    eventLoopDelayMaxMs: Math.round(eventLoopDelayMaxMs * 10) / 10,
    peakEventLoopDelayMs: Math.round(peakEventLoopDelayMs * 10) / 10,
  };
}

module.exports = { getEventLoopStats };
