/**
 * Look up occurrence records by key in the GBIF API v1 (HBase backed).
 *
 * The occurrence index only holds the IDs, so search results are filled in from v1. The records are
 * returned exactly as v1 serves them, the same format as v1 occurrence search, so callers can later
 * use the public API directly.
 *
 * With occurrence.recordBatchLookup: true in .env, the keys are fetched with the batch endpoint
 * (POST {apiv1}/occurrence/batch with a JSON array of keys), occurrence.recordBatchSize keys per call
 * (default 300). That endpoint only exists in lab so far; elsewhere the keys are looked up one at a
 * time, in order.
 *
 * A record that can't be loaded (gone from v1, left out of a batch answer, or still failing after one
 * retry) is returned as just { key }. The caller decides what to do about it.
 */
const env = require('../../config');
const logger = require('../../logger');
const { clientGone } = require('../../clientGone');

const TIMEOUT_MS = Number(env.occurrence?.recordLookupTimeout) || 10000;
const BATCH_LOOKUP = env.occurrence?.recordBatchLookup === true;
const BATCH_SIZE = Number(env.occurrence?.recordBatchSize) || 300;
const RETRY_DELAY_MS = 200;

class NotFound extends Error {}

function getHeaders(req) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'GBIF-es-api',
  };
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

async function fetchBatch(keys, req, signal) {
  const response = await fetch(`${env.apiv1}/occurrence/batch`, {
    method: 'POST',
    headers: getHeaders(req),
    body: JSON.stringify(keys),
    signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
  });
  if (!response.ok) {
    await response.body?.cancel().catch(() => {});
    throw new Error(`status ${response.status}`);
  }
  // { "results": [records], "notFound": [keys] }. Keys without a record, in notFound or not, are
  // treated as not loaded by the caller, so notFound itself isn't needed.
  const body = await response.json();
  return body?.results ?? [];
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

async function withRetry(fn, signal) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      // the caller went away; stop instead of trying again
      if (signal.aborted) throw signal.reason;
      if (err instanceof NotFound || attempt >= 2) throw err;
      await wait(RETRY_DELAY_MS, signal);
    }
  }
}

/**
 * One batch call, retried once. Records come back in the order of the keys, matched on key, so a key
 * the API left out (or a failed call) becomes { key }.
 */
async function getBatch(keys, req, signal) {
  let found = [];
  try {
    found = await withRetry(() => fetchBatch(keys, req, signal), signal);
  } catch (err) {
    if (signal.aborted) throw err;
    logger.warn('occurrence batch lookup failed', { keys: keys.length, error: err.message });
  }
  const byKey = new Map(found.filter(Boolean).map((record) => [String(record.key), record]));
  return keys.map((key) => byKey.get(String(key)) ?? unavailable(key, req));
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
    if (BATCH_LOOKUP) {
      for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        controller.signal.throwIfAborted();
        records.push(...(await getBatch(keys.slice(i, i + BATCH_SIZE), req, controller.signal)));
      }
      return records;
    }
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
