/**
 * In-process metrics registry backing the /health endpoint.
 *
 * Each endpoint's request queue registers here so /health can report its current
 * backlog and throughput: how many requests are waiting vs running, how many
 * have been served / failed / rejected, and whether anything is being rejected
 * right now. It also tracks a service-wide in-flight count.
 *
 * Counters are cumulative since process start; they reset when the process
 * restarts.
 */

const queues = new Map(); // name -> { queue, concurrencyLimit, maxQueueSize }
const gates = new Map(); // name -> gate middleware exposing getShedStatus()
const counters = new Map(); // name -> { served, failed, rejected, running, aborted, largestSeenQueueSize }

let inflight = 0; // service-wide requests being handled right now

// Histogram of the x-client-priority on incoming requests, to show which
// priorities we see most. Keyed by the priority value (1-100) or 'unknown' when
// the header is missing/invalid.
const priorityCounts = new Map();

function priorityBucket(req) {
  const raw = req.headers && req.headers['x-client-priority'];
  const n = parseInt(raw, 10);
  if (Number.isFinite(n) && n >= 1 && n <= 100) return String(n);
  return 'unknown';
}

function recordPriority(req) {
  const key = priorityBucket(req);
  priorityCounts.set(key, (priorityCounts.get(key) || 0) + 1);
}

// Counts as a plain object, numeric priorities ascending, 'unknown' last.
function getPriorityCounts() {
  const numeric = [];
  let unknown = 0;
  priorityCounts.forEach((count, key) => {
    if (key === 'unknown') unknown = count;
    else numeric.push([Number(key), count]);
  });
  numeric.sort((a, b) => a[0] - b[0]);
  const out = {};
  numeric.forEach(([k, c]) => {
    out[k] = c;
  });
  if (unknown) out.unknown = unknown;
  return out;
}

function counted(name) {
  let c = counters.get(name);
  if (!c) {
    c = {
      served: 0,
      failed: 0,
      aborted: 0,
      rejected: 0,
      running: 0,
      largestSeenQueueSize: 0,
    };
    counters.set(name, c);
  }
  return c;
}

// Register an express-queue instance under an endpoint name. `liveConfig`
// is the options object passed to express-queue(internally mini-queue) reads
// `activeLimit`/`queuedLimit` from it live on every admission decision, so
// mutating it (see setQueueLimits) changes the limits at runtime — no restart.
function registerQueue(name, queue, limits = {}, liveConfig) {
  queues.set(name, {
    queue,
    concurrencyLimit: limits.concurrencyLimit,
    maxQueueSize: limits.maxQueueSize,
    liveConfig: liveConfig || null,
  });
  counted(name);
}

// A non-positive / null / 'unbounded' value means "no limit".
function toLimit(v) {
  if (v === null || v === undefined || v === 'unbounded') return Infinity;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return Infinity;
  return n;
}

function getQueueNames() {
  return Array.from(queues.keys());
}

// The editable per-queue limits (Infinity reported as -1, mirroring /health).
function getQueueLimits() {
  const out = {};
  queues.forEach(({ concurrencyLimit, maxQueueSize }, name) => {
    out[name] = {
      concurrencyLimit: unbounded(concurrencyLimit),
      maxQueueSize: unbounded(maxQueueSize),
    };
  });
  return out;
}

// Apply a runtime override to a queue's limits. Updates both the echoed value
// (for /health) and the live express-queue config (uses -1 for
// "unbounded"). Ephemeral: resets on restart.
function setQueueLimits(name, patch = {}) {
  const entry = queues.get(name);
  if (!entry) {
    throw new Error(`Unknown queue '${name}'. Known: ${getQueueNames().join(', ')}.`);
  }
  if ('concurrencyLimit' in patch) {
    const n = toLimit(patch.concurrencyLimit);
    entry.concurrencyLimit = n;
    if (entry.liveConfig) entry.liveConfig.activeLimit = Number.isFinite(n) ? n : -1;
  }
  if ('maxQueueSize' in patch) {
    const n = toLimit(patch.maxQueueSize);
    entry.maxQueueSize = n;
    if (entry.liveConfig) entry.liveConfig.queuedLimit = Number.isFinite(n) ? n : -1;
  }
  return getQueueLimits()[name];
}

// The editable shedding config per gate (defaultPriority + bands).
function getShedSettings() {
  const out = {};
  gates.forEach((gate, name) => {
    if (callable(gate, 'getConfig')) out[name] = gate.getConfig();
  });
  return out;
}

// Apply a runtime override to a gate's shedding config.
function setShedSettings(name, patch = {}) {
  const gate = gates.get(name);
  if (!gate) {
    throw new Error(`Unknown gate '${name}'. Known: ${Array.from(gates.keys()).join(', ')}.`);
  }
  if ('defaultPriority' in patch && callable(gate, 'setDefaultPriority')) {
    gate.setDefaultPriority(patch.defaultPriority);
  }
  if ('bands' in patch && callable(gate, 'setBands')) {
    gate.setBands(patch.bands);
  }
  return callable(gate, 'getConfig') ? gate.getConfig() : null;
}

// Register a priority admission gate (see middleware/admissionGate.js) so its
// current shedding state is reported alongside the queue it guards.
function registerGate(name, gate) {
  gates.set(name, gate);
  counted(name);
}

// A request was turned away (backlog at the hard cap, or shed by the gate).
function recordRejection(name) {
  counted(name).rejected += 1;
}

// A request acquired a slot and started being processed.
function recordAdmit(name) {
  counted(name).running += 1;
}

// A processed request finished. outcome: 'served' | 'failed' | 'aborted'
// ('aborted' = client disconnected mid-flight; counted as neither served nor
// failed, but it still frees the running slot).
function recordComplete(name, outcome) {
  const c = counted(name);
  if (c.running > 0) c.running -= 1;
  if (outcome === 'served') c.served += 1;
  else if (outcome === 'failed') c.failed += 1;
  else if (outcome === 'aborted') c.aborted += 1;
}

function getInflight() {
  return inflight;
}

// Express middleware: count a request as in-flight for the whole service while
// it is being handled. /health probes are excluded so they do not inflate it.
function trackInflight(req, res, next) {
  if (req.path === '/health') {
    next();
    return;
  }
  recordPriority(req);
  inflight += 1;
  let released = false;
  const release = () => {
    if (!released) {
      released = true;
      if (inflight > 0) inflight -= 1;
    }
  };
  res.once('finish', release);
  res.once('close', release);
  next();
}

const unbounded = (n) => (Number.isFinite(n) ? n : -1);
const callable = (o, m) => o && typeof o[m] === 'function';

// High-water mark of each queue's size (waiting + running). express-queue does
// not expose an enqueue hook, so we sample periodically: a spike shorter than
// the interval can be missed, but sustained backlogs (what matters for sizing)
// are caught. getStats() also refreshes it on every /health read.
const HIGH_WATER_SAMPLE_MS = 1000;
function sampleHighWater() {
  queues.forEach(({ queue }, name) => {
    const inner = queue && queue.queue;
    const waiting = callable(inner, 'getLength') ? inner.getLength() : 0;
    const c = counted(name);
    const current = (waiting > 0 ? waiting : 0) + c.running;
    if (current > c.largestSeenQueueSize) c.largestSeenQueueSize = current;
  });
}
const highWaterSampler = setInterval(sampleHighWater, HIGH_WATER_SAMPLE_MS);
highWaterSampler.unref();

// Just the live sizes per queue (no cumulative counters / shedding). Used for
// the event-loop peak snapshot, where only the point-in-time state matters.
function getQueueSizes() {
  const out = {};
  queues.forEach(({ queue }, name) => {
    const inner = queue && queue.queue;
    const waiting = callable(inner, 'getLength') ? inner.getLength() : -1;
    const running = counted(name).running;
    out[name] = {
      waiting,
      running,
      currentQueueSize: (waiting >= 0 ? waiting : 0) + running,
    };
  });
  return out;
}

function getStats() {
  const out = {};
  // "rejecting" = are we turning anything away *right now*: either a gate is in
  // a shedding band, or a queue is sitting at its hard backlog cap.
  let rejecting = false;

  queues.forEach(({ queue, concurrencyLimit, maxQueueSize }, name) => {
    const inner = queue && queue.queue;
    const waiting = callable(inner, 'getLength') ? inner.getLength() : -1;
    const c = counted(name);
    const queueFullNow = Number.isFinite(maxQueueSize) && waiting >= 0 && waiting >= maxQueueSize;
    if (queueFullNow) rejecting = true;

    const currentQueueSize = (waiting >= 0 ? waiting : 0) + c.running;
    if (currentQueueSize > c.largestSeenQueueSize) {
      c.largestSeenQueueSize = currentQueueSize;
    }
    const entry = {
      waiting, // queued, not yet started
      running: c.running, // currently being processed
      currentQueueSize,
      largestSeenQueueSize: c.largestSeenQueueSize, // high-water mark
      concurrencyLimit: unbounded(concurrencyLimit),
      maxQueueSize: unbounded(maxQueueSize),
      served: c.served,
      failed: c.failed,
      aborted: c.aborted, // client disconnected before completion
      rejected: c.rejected,
      queueFullNow,
    };

    const gate = gates.get(name);
    if (callable(gate, 'getShedStatus')) {
      const shed = gate.getShedStatus();
      entry.shedding = shed; // { rejecting, bands }
      if (shed && shed.rejecting) rejecting = true;
    }

    out[name] = entry;
  });

  return { rejecting, queues: out };
}

module.exports = {
  registerQueue,
  registerGate,
  recordRejection,
  recordAdmit,
  recordComplete,
  trackInflight,
  getInflight,
  getPriorityCounts,
  getQueueSizes,
  getStats,
  getQueueNames,
  getQueueLimits,
  setQueueLimits,
  getShedSettings,
  setShedSettings,
};
