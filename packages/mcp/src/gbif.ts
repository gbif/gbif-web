// Everything that talks to GBIF. GraphQL is the data path; the two REST calls are for name matching,
// which GraphQL does not offer by name. The server builds every request; the model never supplies a URL.
import { config } from './config.js';

export type Predicate = Record<string, unknown>;

export class GbifError extends Error {}

async function fetchJson(url: string, init?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    ...init,
    headers: { accept: 'application/json', 'user-agent': 'gbif-mcp', ...init?.headers },
    signal: AbortSignal.timeout(config.timeoutMs),
  });
  if (!res.ok) throw new GbifError(`GBIF answered ${res.status} for ${new URL(url).pathname}`);
  return res.json();
}

export async function graphql<T = any>(query: string, variables: Record<string, unknown>): Promise<T> {
  const body = await fetchJson(config.graphqlUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (body.errors?.length) {
    const first = body.errors[0];
    const displayName = first.extensions?.response?.body?.displayName;
    throw new GbifError(displayName ? `GBIF rejected the query (${displayName})` : first.message);
  }
  return body.data as T;
}

export interface TaxonMatch {
  key: string;
  name: string;
  canonicalName: string;
  authorship?: string;
  rank: string;
  status: string;
  matchType: string;
  confidence: number;
  /** The accepted name when the matched name is a synonym. */
  acceptedKey?: string;
  acceptedName?: string;
  classification: { name: string; rank: string }[];
  alternatives: { key: string; name: string; rank: string; status: string }[];
}

/** GBIF's name matching (species API v2). Returns null when nothing matched. */
export async function matchName(name: string, rank?: string): Promise<TaxonMatch | null> {
  const params = new URLSearchParams({ scientificName: name });
  if (rank) params.set('rank', rank);
  const d = await fetchJson(`${config.apiUrl}/v2/species/match?${params}`);
  if (!d.usage) {
    return null;
  }
  const accepted = d.acceptedUsage;
  const u = d.usage;
  return {
    key: String((accepted ?? u).key),
    name: (accepted ?? u).name,
    canonicalName: (accepted ?? u).canonicalName ?? (accepted ?? u).name,
    authorship: (accepted ?? u).authorship,
    rank: (accepted ?? u).rank,
    status: (accepted ?? u).status,
    matchType: d.diagnostics?.matchType ?? 'UNKNOWN',
    confidence: d.diagnostics?.confidence ?? 0,
    acceptedKey: accepted ? String(accepted.key) : undefined,
    acceptedName: accepted?.name,
    classification: (d.classification ?? []).map((c: any) => ({ name: c.name, rank: c.rank })),
    alternatives: (d.diagnostics?.alternatives ?? []).map((a: any) => {
      const x = a.acceptedUsage ?? a.usage;
      return { key: String(x.key), name: x.name, rank: x.rank, status: x.status };
    }),
  };
}

export interface TaxonSummary {
  key: string;
  name: string;
  canonicalName: string;
  authorship?: string;
  rank: string;
  status: string;
}

/** Look a taxon up by an explicit key. Null when the key does not exist. */
export async function taxonByKey(key: string): Promise<TaxonSummary | null> {
  if (!/^[A-Za-z0-9-]{1,40}$/.test(key)) return null;
  try {
    const d = await fetchJson(`${config.apiUrl}/v1/species/${encodeURIComponent(key)}`);
    return {
      key: String(d.key),
      name: d.scientificName,
      canonicalName: d.canonicalName ?? d.scientificName,
      authorship: d.authorship,
      rank: d.rank,
      status: d.taxonomicStatus,
    };
  } catch (e) {
    if (e instanceof GbifError && /404/.test(e.message)) return null;
    throw e;
  }
}

// --- occurrence queries -------------------------------------------------------------------------

export interface FacetRow {
  key: string;
  label: string;
  count: number;
}

export interface OccurrenceSummary {
  total: number;
  facet?: { field: string; rows: FacetRow[]; distinct: number };
  sample: Record<string, any>[];
}

// scientificName on the record is the publisher's own field and is often empty; the interpreted name
// comes from the classification against a checklist.
const SAMPLE_FIELDS = `key verbatimScientificName countryCode year month basisOfRecord datasetTitle publisherTitle license
  classification(checklistKey: "${config.defaultChecklistKey}") { usage { name } }`;

/** Count, an optional facet and a few records for one predicate, in one GraphQL request. */
export async function searchOccurrences(opts: {
  predicate: Predicate;
  facetField?: string;
  facetSize?: number;
  sampleSize?: number;
}): Promise<OccurrenceSummary> {
  const { predicate, facetField, facetSize = 20, sampleSize = 0 } = opts;
  if (facetField && !/^[A-Za-z]+$/.test(facetField)) throw new GbifError('Invalid facet field');
  const query = `
    query Summary($predicate: Predicate, $facetSize: Int, $size: Int) {
      occurrenceSearch(predicate: $predicate) {
        documents(size: $size) { total ${sampleSize > 0 ? `results { ${SAMPLE_FIELDS} }` : ''} }
        ${facetField ? `facet { ${facetField}(size: $facetSize) { key count label } }` : ''}
        ${facetField ? `cardinality { ${facetField} }` : ''}
      }
    }`;
  const data = await graphql<any>(query, { predicate, facetSize, size: sampleSize });
  const s = data.occurrenceSearch;
  return {
    total: Number(s.documents.total),
    sample: (s.documents.results ?? []).map((o: any) => ({
      ...o,
      scientificName: o.classification?.usage?.name ?? o.verbatimScientificName ?? '',
    })),
    facet: facetField
      ? {
          field: facetField,
          distinct: Number(s.cardinality?.[facetField] ?? 0),
          rows: (s.facet?.[facetField] ?? []).map((r: any) => ({
            key: String(r.key),
            label: String(r.label ?? r.key),
            count: Number(r.count),
          })),
        }
      : undefined,
  };
}
