/**
 * Look up occurrence records by key in the GBIF API v1 (HBase backed).
 *
 * The occurrence index only holds the IDs, so search results are filled in from v1. The records are
 * returned exactly as v1 serves them, the same format as v1 occurrence search, so callers can later
 * use the public API directly.
 *
 * For now the keys are looked up one at a time, in order. The backend is building a batch lookup;
 * getRecords is the one place to switch over to it.
 *
 * A record that can't be loaded (gone from v1, or still failing after one retry) is returned as
 * just { key }. The caller decides what to do about it.
 */
const env = require('../../config');
const logger = require('../../logger');
const { clientGone } = require('../../clientGone');

const TIMEOUT_MS = Number(env.occurrence?.recordLookupTimeout) || 10000;
const RETRY_DELAY_MS = 200;

class NotFound extends Error {}

function getHeaders(req) {
  const headers = { Accept: 'application/json', 'User-Agent': 'GBIF-es-api' };
  const requestId = req?.headers?.['x-request-id'];
  if (requestId) headers['x-request-id'] = requestId;
  return headers;
}

async function fetchRecord(key, req, signal) {
  const response = await fetch(`${env.apiv1}/occurrence/${key}`, {
    headers: getHeaders(req),
    signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
  });
  if (!response.ok) {
    // release the connection; we don't need the body
    await response.body?.cancel().catch(() => {});
    if (response.status === 404) throw new NotFound();
    throw new Error(`status ${response.status}`);
  }
  return response.json();
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

// A record we couldn't load. The response then mustn't be cached, or a short problem in the API
// would show those records as unavailable to everyone for as long as the cache lasts.
function unavailable(key, req) {
  if (req?.res && !req.res.headersSent) req.res.set('Cache-Control', 'no-store');
  return { key };
}

async function getRecord(key, req, signal) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fetchRecord(key, req, signal);
    } catch (err) {
      // the caller went away; stop instead of trying again
      if (signal.aborted) throw signal.reason;
      if (err instanceof NotFound) return unavailable(key, req);
      if (attempt >= 2) {
        logger.warn('occurrence record lookup failed', { key, error: err.message });
        return unavailable(key, req);
      }
      await wait(RETRY_DELAY_MS, signal);
    }
  }
}

/**
 * Look up the records for a list of keys, in the same order. Stops if the client disconnects.
 */
async function getRecords(keys, req) {
  const controller = new AbortController();
  const onClose = () => {
    if (!req?.res?.writableEnded) controller.abort(new Error('client closed the request'));
  };
  req?.res?.once('close', onClose);
  // the client may already have gone while Elasticsearch was queried
  if (clientGone(req)) onClose();
  try {
    const records = [];
    for (const key of keys) {
      controller.signal.throwIfAborted();
      records.push(await getRecord(key, req, controller.signal));
    }
    return records;
  } finally {
    req?.res?.off('close', onClose);
  }
}

module.exports = {
  getRecords,
};
