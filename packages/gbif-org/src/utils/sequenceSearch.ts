import { fetchWithCancel } from './fetchWithCancel';

// Result of GBIF's sequence validation/normalisation endpoint
// (GET {v1}/validation/sequence?sequence=...).
export type SequenceValidation = {
  rawSequence?: string;
  sequence?: string; // the normalised/trimmed sequence
  nucleotideSequenceID?: string;
  invalid?: boolean;
  naturalLanguageDetected?: boolean;
};

// A single vsearch hit reduced to what we need.
export type VsearchMatch = { id: string; identity: number };

// One identity bin with the matched nucleotideSequenceIDs that fall in it.
export type SequenceBin = { id: string; min: number; max: number; ids: string[] };

// The result of resolving a raw sequence (validation -> vsearch -> binning).
export type SequenceResolution = { bins: SequenceBin[]; invalid: boolean };

// The value the filter persists (URL stays tiny — only the input sequence + which bins
// are ticked). The matched IDs are NOT stored; they are recomputed from the sequence on
// demand (cheap thanks to the in-session cache below + the Varnish/HTTP cache in front of
// the endpoints, since the vsearch UDB only rebuilds weekly).
export type SequenceFilterValue = {
  sequence: string;
  selected: string[]; // ticked bin ids
};

// Half-open identity bins; each hit goes in the highest bin it qualifies for.
// Matches below 95% identity are dropped (no bin matches them).
export const SEQUENCE_BIN_DEFS: Array<{
  id: string;
  min: number;
  max: number;
  test: (identity: number) => boolean;
}> = [
  { id: '100', min: 100, max: 100, test: (x) => x >= 100 },
  { id: '99.5', min: 99.5, max: 100, test: (x) => x >= 99.5 && x < 100 },
  { id: '99', min: 99, max: 99.5, test: (x) => x >= 99 && x < 99.5 },
  { id: '98', min: 98, max: 99, test: (x) => x >= 98 && x < 99 },
  { id: '97', min: 97, max: 98, test: (x) => x >= 97 && x < 98 },
  { id: '96', min: 96, max: 97, test: (x) => x >= 96 && x < 97 },
  { id: '95', min: 95, max: 96, test: (x) => x >= 95 && x < 96 },
];

async function fetchNormalisedSequence(
  rawSequence: string,
  v1Endpoint: string
): Promise<SequenceValidation> {
  const { promise } = fetchWithCancel(
    `${v1Endpoint}/validation/sequence?sequence=${encodeURIComponent(rawSequence)}`
  );
  const response = await promise;
  if (!response.ok) throw new Error(`validation/sequence ${response.status}`);
  return response.json();
}

async function fetchVsearchMatches(
  normalisedSequence: string,
  webUtilsBaseUrl: string
): Promise<VsearchMatch[]> {
  // webUtilsBaseUrl is PUBLIC_WEB_UTILS (e.g. http://localhost:9011/unstable-api), the
  // base for graphql-api's unstable-api controllers (vsearch, map-styles, blast, ...).
  const { promise } = fetchWithCancel(
    `${webUtilsBaseUrl}/vsearch?sequence=${encodeURIComponent(normalisedSequence)}`
  );
  const response = await promise;
  if (!response.ok) throw new Error(`vsearch ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) return [];

  // The matched nucleotideSequenceID is under "target id" (alnout) or "target header"
  // (blast6out) depending on the output format; identity may be a number or numeric string.
  const seen = new Set<string>();
  const matches: VsearchMatch[] = [];
  for (const entry of data) {
    const id = entry?.['target id'] ?? entry?.['target header'];
    const identity = Number(entry?.identity);
    if (!id || Number.isNaN(identity) || seen.has(id)) continue;
    // vsearch returns hits ordered by descending identity, so the first time we see an
    // id it carries its best identity — keep that one.
    seen.add(id);
    matches.push({ id, identity });
  }
  return matches;
}

export function binMatches(matches: VsearchMatch[]): SequenceBin[] {
  const bins: SequenceBin[] = SEQUENCE_BIN_DEFS.map((b) => ({
    id: b.id,
    min: b.min,
    max: b.max,
    ids: [],
  }));
  for (const match of matches) {
    const def = SEQUENCE_BIN_DEFS.find((b) => b.test(match.identity));
    if (!def) continue; // drops identity < 95
    const bin = bins.find((b) => b.id === def.id);
    if (bin) bin.ids.push(match.id);
  }
  return bins;
}

// In-session cache keyed by the raw input sequence. Avoids re-running validation+vsearch
// on every navigation within a session; cross-session/reload is covered by the
// Varnish/HTTP cache in front of the endpoints (the GETs are cacheable for hours).
const resolutionCache = new Map<
  string,
  { promise: Promise<SequenceResolution>; result?: SequenceResolution }
>();

export function resolveSequence(
  rawSequence: string,
  v1Endpoint: string,
  webUtilsBaseUrl: string
): Promise<SequenceResolution> {
  const key = rawSequence.trim();
  const existing = resolutionCache.get(key);
  if (existing) return existing.promise;

  const promise = (async (): Promise<SequenceResolution> => {
    const validation = await fetchNormalisedSequence(key, v1Endpoint);
    if (
      !validation?.sequence ||
      validation.invalid ||
      validation.naturalLanguageDetected
    ) {
      const invalidResult: SequenceResolution = { bins: [], invalid: true };
      const entry = resolutionCache.get(key);
      if (entry) entry.result = invalidResult;
      return invalidResult;
    }
    const matches = await fetchVsearchMatches(validation.sequence, webUtilsBaseUrl);
    const result: SequenceResolution = { bins: binMatches(matches), invalid: false };
    const entry = resolutionCache.get(key);
    if (entry) entry.result = result;
    return result;
  })();

  resolutionCache.set(key, { promise });
  // On a network/parse failure drop the entry so a later attempt can retry.
  promise.catch(() => resolutionCache.delete(key));
  return promise;
}

// Synchronous read of an already-resolved sequence (settled cache entry), for the
// predicate serializer and the filter augmentation. Returns undefined while cold/in-flight.
export function getCachedResolution(rawSequence: string): SequenceResolution | undefined {
  return resolutionCache.get(rawSequence.trim())?.result;
}

// The unique nucleotideSequenceIDs across the selected bins.
export function selectedSequenceIds(bins: SequenceBin[], selected: string[]): string[] {
  const selectedSet = new Set(selected);
  return [
    ...new Set(
      bins.filter((b) => selectedSet.has(b.id)).flatMap((b) => (Array.isArray(b.ids) ? b.ids : []))
    ),
  ];
}

// Parse the value the filter stores (a JSON string, or an already-parsed object when the
// URL parser auto-parsed it). Tolerates an extra `ids` field (added in-memory by the
// filter augmentation) without requiring it.
export function parseSequenceFilterValue(
  raw: unknown
): (SequenceFilterValue & { ids?: string[] }) | undefined {
  if (raw == null) return undefined;
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return undefined;
    }
  }
  if (!parsed || typeof parsed !== 'object') return undefined;
  const value = parsed as Partial<SequenceFilterValue> & { ids?: string[] };
  if (typeof value.sequence !== 'string') return undefined;
  return { sequence: value.sequence, selected: value.selected ?? [], ids: value.ids };
}
