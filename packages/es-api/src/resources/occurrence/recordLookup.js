/**
 * Look up occurrence records by key in the GBIF API v1 (HBase backed).
 *
 * The occurrence index only holds the IDs, so search results are filled in from v1. The records are
 * returned exactly as v1 serves them, the same format as v1 occurrence search, so callers can later
 * use the public API directly.
 *
 * Lookups share one process-wide limit (occurrence.recordLookupConcurrency in .env) so a burst of
 * searches can't open an unbounded number of requests to the API.
 */
const env = require('../../config');
const { ResponseError } = require('../errorHandler');

const CONCURRENCY = Number(env.occurrence?.recordLookupConcurrency) || 50;
const TIMEOUT_MS = Number(env.occurrence?.recordLookupTimeout) || 10000;

let running = 0;
const waiting = [];

async function withSlot(fn) {
  if (running >= CONCURRENCY) {
    await new Promise((resolve) => waiting.push(resolve));
  }
  running += 1;
  try {
    return await fn();
  } finally {
    running -= 1;
    const next = waiting.shift();
    if (next) next();
  }
}

function getHeaders(req) {
  const headers = { Accept: 'application/json', 'User-Agent': 'GBIF-es-api' };
  const requestId = req?.headers?.['x-request-id'];
  if (requestId) headers['x-request-id'] = requestId;
  return headers;
}

/**
 * Returns the v1 record, or null if v1 doesn't have it (typically deleted since it was indexed).
 */
async function getRecord(key, req) {
  return withSlot(async () => {
    let response;
    try {
      response = await fetch(`${env.apiv1}/occurrence/${key}`, {
        headers: getHeaders(req),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      throw new ResponseError(
        504,
        'recordLookupFailed',
        `Looking up occurrence ${key} failed: ${err.message}`,
      );
    }
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new ResponseError(
        502,
        'recordLookupFailed',
        `Looking up occurrence ${key} failed with ${response.status}`,
      );
    }
    return response.json();
  });
}

/**
 * Look up the records for a list of keys, in the same order. Keys v1 doesn't know are left out.
 */
async function getRecords(keys, req) {
  const records = await Promise.all(keys.map((key) => getRecord(key, req)));
  return records.filter((record) => record !== null);
}

module.exports = {
  getRecord,
  getRecords,
};
