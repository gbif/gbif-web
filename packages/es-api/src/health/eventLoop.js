const { monitorEventLoopDelay } = require('node:perf_hooks');
const v8 = require('node:v8');
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
// A stall this big (a fully blocked loop for >1s) is notable on its own. We
// record when it last happened and how many times, to get a sense of frequency.
const SLOW_EVENT_LOOP_MS = 1000;

const histogram = monitorEventLoopDelay({ resolution: RESOLUTION_MS });
histogram.enable();
const trueLag = (rawMs) => Math.max(0, rawMs - RESOLUTION_MS);

let eventLoopDelayMs = 0; // mean over the most recent window
let eventLoopDelayMaxMs = 0; // worst single sample in the most recent window
let peakEventLoopDelayMs = 0; // sticky worst since process start
let peakEventLoopMetrics = null; // snapshot of service state at that worst stall
let lastSlowEventLoop = null; // ISO time of the last stall over SLOW_EVENT_LOOP_MS
let slowEventLoopCount = 0; // how many such stalls since startup

const heapLimitBytes = v8.getHeapStatistics().heap_size_limit;

// Optional provider of service-specific state (inflight, queue sizes) to fold
// into the peak snapshot. Wired up by index.js so this module stays generic.
let peakSnapshotProvider = null;
function setPeakSnapshotProvider(fn) {
  peakSnapshotProvider = fn;
}

// Capture what the process was doing when a new worst stall was observed. Note:
// the sampler fires *after* the loop frees up, so this is the state right after
// the stall — the best available approximation, not the instant of the stall.
function captureSnapshot(lagMs) {
  const heapUsed = process.memoryUsage().heapUsed;
  let provided = {};
  try {
    provided = peakSnapshotProvider ? peakSnapshotProvider() : {};
  } catch (err) {
    provided = {};
  }
  return {
    eventLoopLagMs: Math.round(lagMs * 10) / 10,
    atUptimeSeconds: Math.round(process.uptime() * 10) / 10,
    heapUsedMb: Math.round(heapUsed / 1048576),
    heapUsedPercent: Math.round((heapUsed / heapLimitBytes) * 100),
    ...provided,
  };
}

const sampler = setInterval(() => {
  eventLoopDelayMs = trueLag(histogram.mean / 1e6); // ns -> ms, mean since last reset
  eventLoopDelayMaxMs = trueLag(histogram.max / 1e6);
  const afterGrace = process.uptime() >= STARTUP_GRACE_SECONDS;
  if (afterGrace && eventLoopDelayMaxMs > peakEventLoopDelayMs) {
    peakEventLoopDelayMs = eventLoopDelayMaxMs;
    peakEventLoopMetrics = captureSnapshot(peakEventLoopDelayMs);
    // Log the moment a new worst-ever stall is observed, with the surrounding
    // state, so it can be correlated with what the process was doing.
    if (peakEventLoopDelayMs > PEAK_LOG_THRESHOLD_MS) {
      logger.warn('new peak event-loop lag', peakEventLoopMetrics);
    }
  }
  if (afterGrace && eventLoopDelayMaxMs > SLOW_EVENT_LOOP_MS) {
    lastSlowEventLoop = new Date().toISOString();
    slowEventLoopCount += 1;
  }
  histogram.reset();
}, SAMPLE_INTERVAL_MS);
sampler.unref();

function getEventLoopStats() {
  return {
    eventLoopDelayMs: Math.round(eventLoopDelayMs * 10) / 10,
    eventLoopDelayMaxMs: Math.round(eventLoopDelayMaxMs * 10) / 10,
    peakEventLoopDelayMs: Math.round(peakEventLoopDelayMs * 10) / 10,
    // State captured at the worst stall (null until one is recorded).
    peakEventLoopMetrics,
    // When the loop was last stalled for over a second, and how often that has
    // happened since startup — a rough sense of how frequent bad stalls are.
    slowEventLoopThresholdMs: SLOW_EVENT_LOOP_MS,
    lastSlowEventLoop, // ISO timestamp, null until one occurs
    slowEventLoopCount,
  };
}

module.exports = { getEventLoopStats, setPeakSnapshotProvider };
