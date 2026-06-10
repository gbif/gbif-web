/**
 * In-process metrics registry backing the /health endpoint.
 *
 * Each endpoint's request queue registers here so /health can report its current
 * backlog and throughput: how many requests are waiting vs running, how many
 * have been served / failed / rejected, and whether anything is being rejected
 * right now. It also tracks a service-wide in-flight count.
 *
 * Counters are cumulative since process start; they reset when the process
 * restarts (this is a single-process service with no shared store).
 */

const queues = new Map(); // name -> { queue, concurrencyLimit, maxQueueSize }
const gates = new Map(); // name -> gate middleware exposing getShedStatus()
const counters = new Map(); // name -> { served, failed, rejected, running }

let inflight = 0; // service-wide requests being handled right now

function counted(name) {
  let c = counters.get(name);
  if (!c) {
    c = { served: 0, failed: 0, rejected: 0, running: 0 };
    counters.set(name, c);
  }
  return c;
}

// Register an express-queue instance under an endpoint name. `limits` is echoed
// back on /health for context (express-queue does not expose them).
function registerQueue(name, queue, limits = {}) {
  queues.set(name, {
    queue,
    concurrencyLimit: limits.concurrencyLimit,
    maxQueueSize: limits.maxQueueSize,
  });
  counted(name);
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

function getStats() {
  const out = {};
  // "rejecting" = are we turning anything away *right now*: either a gate is in
  // a shedding band, or a queue is sitting at its hard backlog cap.
  let rejecting = false;

  queues.forEach(({ queue, concurrencyLimit, maxQueueSize }, name) => {
    const inner = queue && queue.queue;
    const waiting = callable(inner, 'getLength') ? inner.getLength() : -1;
    const c = counted(name);
    const queueFullNow =
      Number.isFinite(maxQueueSize) && waiting >= 0 && waiting >= maxQueueSize;
    if (queueFullNow) rejecting = true;

    const entry = {
      waiting, // queued, not yet started
      running: c.running, // currently being processed
      currentQueueSize: (waiting >= 0 ? waiting : 0) + c.running,
      concurrencyLimit: unbounded(concurrencyLimit),
      maxQueueSize: unbounded(maxQueueSize),
      served: c.served,
      failed: c.failed,
      rejected: c.rejected,
      queueFullNow,
    };

    const gate = gates.get(name);
    if (callable(gate, 'getShedStatus')) {
      const shed = gate.getShedStatus();
      entry.shedding = shed; // { queueLength, rejecting, maxPriority, bands }
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
  getStats,
};
