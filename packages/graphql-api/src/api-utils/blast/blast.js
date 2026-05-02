import axios from 'axios';
import config from '../../config';

/*
 * Thin proxy around GBIF's upstream BLAST service.
 *
 * Pipeline:
 *   1. POST the sequence(s) to the upstream BLAST service to get raw match(es).
 *   2. "Decorate" each match by resolving its scientific name against the
 *      GBIF v2/species/match endpoint and attaching the result as `taxonMatch`.
 *      Decoration is best-effort: if the species API fails, the raw match is
 *      returned unchanged.
 *
 * Notes:
 *   - `verbose` is overloaded. It is passed upstream as `?verbose=true` to
 *     also return `alternatives` for each match, and is used here to decide
 *     whether to additionally decorate those alternatives.
 *   - `blastBatch` accepts `datasetKey` in the request body but strips it
 *     from the payload sent upstream (BLAST does not understand it). It is
 *     used only as the `checklistKey` when looking up names against
 *     species/match.
 */

const BLAST_TIMEOUT_MS = 180_000;
const TAXON_TIMEOUT_MS = 30_000;
// Cap concurrent calls to species/match so a large batch (or a verbose
// response with many alternatives) does not stampede the taxon backend.
const SPECIES_LOOKUP_CONCURRENCY = 25;

function buildUpstreamError(response) {
  const err = new Error(`Upstream BLAST returned ${response.status}`);
  err.statusCode = response.status;
  err.body = response.data;
  return err;
}

async function postUpstream(path, body, { verbose } = {}) {
  const url = `${config.blast.url}${path}${verbose ? '?verbose=true' : ''}`;
  const response = await axios.post(url, body, {
    timeout: BLAST_TIMEOUT_MS,
    validateStatus: () => true,
  });
  if (response.status >= 300) throw buildUpstreamError(response);
  return response.data;
}

// Run `worker(item, index)` over `items` with at most `concurrency` calls
// in flight. Results are returned in input order. Errors propagate.
async function runWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runOne = async () => {
    while (cursor < items.length) {
      const i = cursor;
      cursor += 1;
      // eslint-disable-next-line no-await-in-loop
      results[i] = await worker(items[i], i);
    }
  };
  const lanes = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: lanes }, runOne));
  return results;
}

async function decorateWithGBIFspecies({ entry, datasetKey }) {
  if (!entry?.name) return entry;
  const url = `${config.apiv2}/species/match`;
  const { data: taxonMatch } = await axios.get(url, {
    params: {
      scientificName: entry.name,
      checklistKey: datasetKey,
    },
    timeout: TAXON_TIMEOUT_MS,
  });
  if (!taxonMatch?.classification) return entry;

  // Strict name equality: only attach the lookup if the resolved name still
  // matches what we asked for. Both `usage.name` and the corresponding
  // classification entry's `name` are checked — they are usually the same,
  // but the original implementation distinguished them so we preserve that.
  const usageKey = taxonMatch.usage?.key;
  const canonical = taxonMatch.classification.find((t) => t.key === usageKey);
  const matched =
    canonical?.name === entry.name || taxonMatch.usage?.name === entry.name;
  if (!matched) return entry;

  return { ...entry, taxonMatch };
}

async function decorateAlternatives({ alternatives, datasetKey }) {
  if (!Array.isArray(alternatives) || alternatives.length === 0) {
    return alternatives;
  }
  return runWithConcurrency(
    alternatives,
    SPECIES_LOOKUP_CONCURRENCY,
    async (entry) => {
      try {
        return await decorateWithGBIFspecies({ entry, datasetKey });
      } catch (err) {
        // Best-effort: leave this alternative un-decorated on failure.
        return entry;
      }
    },
  );
}

async function decorateMatch(match, { verbose, datasetKey } = {}) {
  if (!match?.matchType) return match;
  try {
    const decorated = await decorateWithGBIFspecies({
      entry: match,
      datasetKey,
    });
    if (verbose && Array.isArray(match.alternatives)) {
      const alternatives = await decorateAlternatives({
        alternatives: match.alternatives,
        datasetKey,
      });
      return { ...decorated, alternatives };
    }
    return decorated;
  } catch (err) {
    // Best-effort decoration: don't fail the whole match because the species
    // lookup choked. Log so outages are not silent, and tag the entry so
    // callers can distinguish a lookup error from a genuine no-match.
    return { ...match, taxonMatchError: true };
  }
}

async function blast(seq, { verbose = false } = {}) {
  const data = await postUpstream('/blast', seq, { verbose });
  return decorateMatch(data, { verbose });
}

async function blastBatch(
  { datasetKey, ...seq } = {},
  { verbose = false } = {},
) {
  const data = await postUpstream('/blast/batch', seq, { verbose });
  if (!Array.isArray(data)) return data;
  return runWithConcurrency(data, SPECIES_LOOKUP_CONCURRENCY, (m) =>
    decorateMatch(m, { verbose, datasetKey }),
  );
}

export { blast, blastBatch, decorateWithGBIFspecies };
