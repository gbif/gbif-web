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
 * are rejected. For example:
 *
 *     [{ queueAbove: 100, maxPriority: 50 }, { queueAbove: 200, maxPriority: 30 }]
 *
 * means: over 100 waiting -> reject priority > 50; over 200 also -> reject
 * priority > 30. A request is rejected if it exceeds the threshold of any band.
 * An empty (or omitted) band list disables shedding: the gate becomes a pass-through.
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

// Normalise a bands array: keep only well-formed entries.
function normaliseBands(input) {
  return (Array.isArray(input) ? input : []).filter(
    (b) => b && Number.isFinite(b.queueAbove) && Number.isFinite(b.maxPriority),
  );
}

function admissionGate(options = {}) {
  const getQueueLength = options.getQueueLength || (() => 0);
  const rejectHandler = options.rejectHandler || defaultRejectHandler;
  const header = options.header || DEFAULT_HEADER;

  // Mutable state so the admin endpoint can retune shedding live (see
  // setBands/setDefaultPriority). The middleware reads it on every request
  const state = {
    defaultPriority: Number.isFinite(options.defaultPriority)
      ? options.defaultPriority
      : DEFAULT_PRIORITY,
    bands: normaliseBands(options.shedBands),
  };

  function readPriority(req) {
    const raw = req.headers && req.headers[header];
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n)) return state.defaultPriority;
    // clamp into the documented 1-100 range
    return Math.min(100, Math.max(1, n));
  }

  // A snapshot for /health: are we shedding right now and from which bands.
  // (The backlog length itself is reported separately as the queue's `waiting`.)
  function getShedStatus() {
    const depth = getQueueLength();
    const rejecting = state.bands.some((band) => depth > band.queueAbove);
    return {
      rejecting,
      bands: state.bands,
    };
  }

  // Always evaluate live; an empty band list is a pass-through.
  const middleware = function admissionGateMiddleware(req, res, next) {
    if (state.bands.length > 0) {
      const depth = getQueueLength();
      const priority = readPriority(req);
      // Reject if any band is exceeded and request priority exceeds that band's limit.
      for (let i = 0; i < state.bands.length; i += 1) {
        const band = state.bands[i];
        if (depth > band.queueAbove && priority > band.maxPriority) {
          rejectHandler(req, res);
          return;
        }
      }
    }
    next();
  };

  middleware.getShedStatus = getShedStatus;
  // The editable shedding config, for the admin endpoint.
  middleware.getConfig = () => ({
    defaultPriority: state.defaultPriority,
    bands: state.bands,
  });
  middleware.setBands = (b) => {
    state.bands = normaliseBands(b);
  };
  middleware.setDefaultPriority = (p) => {
    const n = Number(p);
    if (Number.isFinite(n)) state.defaultPriority = Math.min(100, Math.max(1, n));
  };
  return middleware;
}

module.exports = admissionGate;
