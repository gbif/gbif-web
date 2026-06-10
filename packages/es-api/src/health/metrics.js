/**
 * In-process metrics registry backing the /health endpoint.
 *
 * Each endpoint's request queue registers here so /health can report its current
 * backlog and how many requests have been rejected (queue full) or shed by the
 * priority admission gate, plus whether anything is being rejected right now.
 *
 * Counters are cumulative since process start; they reset when the process
 * restarts (this is a single-process service with no shared store).
 */

const queues = new Map(); // name -> { queue, activeLimit, queuedLimit }
const gates = new Map(); // name -> gate middleware exposing getShedStatus()
const rejections = new Map(); // name -> { queueFull, priorityShed }

function counters(name) {
  let c = rejections.get(name);
  if (!c) {
    c = { queueFull: 0, priorityShed: 0 };
    rejections.set(name, c);
  }
  return c;
}

// Register an express-queue instance under an endpoint name. `limits` is just
// echoed back on /health for context (express-queue does not expose them).
function registerQueue(name, queue, limits = {}) {
  queues.set(name, {
    queue,
    activeLimit: limits.activeLimit,
    queuedLimit: limits.queuedLimit,
  });
  counters(name);
}

// Register a priority admission gate (see middleware/admissionGate.js) so its
// current shedding state is reported alongside the queue it guards.
function registerGate(name, gate) {
  gates.set(name, gate);
  counters(name);
}

// Called from the reject handlers when a request is turned away.
// reason: 'queueFull' (backlog at the hard cap) | 'priorityShed' (gate).
function recordRejection(name, reason) {
  const c = counters(name);
  if (reason === 'priorityShed') c.priorityShed += 1;
  else c.queueFull += 1;
}

function callable(obj, method) {
  return obj && typeof obj[method] === 'function';
}

const unbounded = (n) => (Number.isFinite(n) ? n : -1);

function getStats() {
  const out = {};
  // "rejecting" = are we turning anything away *right now*: either a gate is in
  // a shedding band, or a queue is sitting at its hard backlog cap.
  let rejecting = false;

  queues.forEach(({ queue, activeLimit, queuedLimit }, name) => {
    const inner = queue && queue.queue;
    const waiting = callable(inner, 'getLength') ? inner.getLength() : -1;
    const active = callable(inner, 'getActiveCount')
      ? inner.getActiveCount()
      : undefined;
    const rej = counters(name);
    const queueFullNow =
      Number.isFinite(queuedLimit) && waiting >= 0 && waiting >= queuedLimit;
    if (queueFullNow) rejecting = true;

    const entry = {
      waiting,
      ...(active === undefined ? {} : { active }),
      activeLimit: unbounded(activeLimit),
      queuedLimit: unbounded(queuedLimit),
      queueFullNow,
      rejected: {
        queueFull: rej.queueFull,
        priorityShed: rej.priorityShed,
        total: rej.queueFull + rej.priorityShed,
      },
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
  getStats,
};
