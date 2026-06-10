/**
 * Priority-based admission gate.
 *
 * A small Express middleware to place *in front of* a FIFO request queue (e.g.
 * express-queue). It does not queue or reorder anything itself — it only rejects
 * the least important incoming requests when the queue's backlog is already
 * deep, so the queue keeps draining in arrival order (nothing starves) while
 * shedding load it cannot keep up with.
 *
 * Importance comes from the `x-client-priority` header (1-100, lower = more
 * important) that Varnish attaches and the graphql-api forwards.
 *
 * Shedding is expressed as bands of `{ queueAbove, maxPriority }`: while the
 * backlog length exceeds `queueAbove`, requests with priority > `maxPriority`
 * are rejected. The most severe matching band wins, e.g.
 *
 *     [{ queueAbove: 100, maxPriority: 50 }, { queueAbove: 200, maxPriority: 30 }]
 *
 * means: over 100 waiting -> reject priority > 50; over 200 -> reject
 * priority > 30. An empty (or omitted) band list disables shedding: the gate
 * becomes a pass-through.
 *
 * Options:
 *   - getQueueLength:  () => number, the current backlog length to test bands
 *                      against (e.g. `() => expressQueueInstance.queue.getLength()`).
 *   - shedBands:       array of { queueAbove, maxPriority } (default []).
 *   - rejectHandler:   (req, res) => void, called for shed requests.
 *   - defaultPriority: priority when the header is missing/invalid (default 100,
 *                      i.e. least important, so unlabelled traffic sheds first).
 *   - header:          header name to read (default 'x-client-priority').
 */

const DEFAULT_HEADER = 'x-client-priority';
const DEFAULT_PRIORITY = 100;

function defaultRejectHandler(req, res) {
  res.status(429).json({ error: 429, message: 'Too many concurrent requests.' });
}

function admissionGate(options = {}) {
  const getQueueLength = options.getQueueLength || (() => 0);
  const rejectHandler = options.rejectHandler || defaultRejectHandler;
  const defaultPriority = Number.isFinite(options.defaultPriority)
    ? options.defaultPriority
    : DEFAULT_PRIORITY;
  const header = options.header || DEFAULT_HEADER;
  // Keep only well-formed bands, most severe first (largest queueAbove first),
  // so the first one whose threshold is exceeded is the strictest that applies.
  const bands = (Array.isArray(options.shedBands) ? options.shedBands : [])
    .filter(
      (b) =>
        b && Number.isFinite(b.queueAbove) && Number.isFinite(b.maxPriority),
    )
    .sort((a, b) => b.queueAbove - a.queueAbove);

  // No bands -> nothing to shed; hand back a pass-through so call sites can use
  // the gate unconditionally.
  if (bands.length === 0) {
    return function noShedGate(req, res, next) {
      next();
    };
  }

  function readPriority(req) {
    const raw = req.headers && req.headers[header];
    const n = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
    if (!Number.isFinite(n)) return defaultPriority;
    // clamp into the documented 1-100 range
    return Math.min(100, Math.max(1, n));
  }

  return function admissionGateMiddleware(req, res, next) {
    const depth = getQueueLength();
    for (let i = 0; i < bands.length; i += 1) {
      if (depth > bands[i].queueAbove) {
        // Strictest applicable band decides; only now do we read the header.
        if (readPriority(req) > bands[i].maxPriority) {
          rejectHandler(req, res);
          return;
        }
        break;
      }
    }
    next();
  };
}

module.exports = admissionGate;
