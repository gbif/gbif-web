// The filter string, kept deliberately basic for now: space-separated `key=value` tokens, an agent that
// supplies meaningful values, and an honest report of anything that was not understood. Generous
// parsing (names, synonyms, pasted URLs, free text) comes later, behind this same interface.
//
//   country=DK year=2010-2025 basisOfRecord=HUMAN_OBSERVATION taxonKey=2435099
//
// Comma means OR inside one key (country=DK,SE). Years and months take a number, a range (2010-2025)
// or a bound (>=2010). Unrecognised tokens are reported and never dropped silently.
import { config } from './config.js';
import { taxonByKey, type Predicate, type TaxonSummary } from './gbif.js';

type Kind = 'taxon' | 'country' | 'range' | 'enum' | 'uuid' | 'bool';

interface FieldDef {
  kind: Kind;
  /** key in the GBIF predicate (GraphQL) */
  predicate: string;
  /** parameter in the v1 API */
  api: string;
  /** parameter on gbif.org */
  site: string;
  values?: string[];
}

export const FIELDS: Record<string, FieldDef> = {
  taxonKey: { kind: 'taxon', predicate: 'taxonKey', api: 'taxonKey', site: 'taxon_key' },
  country: { kind: 'country', predicate: 'countryCode', api: 'country', site: 'country' },
  year: { kind: 'range', predicate: 'year', api: 'year', site: 'year' },
  month: { kind: 'range', predicate: 'month', api: 'month', site: 'month' },
  basisOfRecord: {
    kind: 'enum', predicate: 'basisOfRecord', api: 'basisOfRecord', site: 'basis_of_record',
    values: [
      'HUMAN_OBSERVATION', 'MACHINE_OBSERVATION', 'PRESERVED_SPECIMEN', 'FOSSIL_SPECIMEN',
      'LIVING_SPECIMEN', 'MATERIAL_SAMPLE', 'MATERIAL_CITATION', 'OCCURRENCE',
    ],
  },
  datasetKey: { kind: 'uuid', predicate: 'datasetKey', api: 'datasetKey', site: 'dataset_key' },
  publishingOrg: { kind: 'uuid', predicate: 'publishingOrg', api: 'publishingOrg', site: 'publishing_org' },
  mediaType: { kind: 'enum', predicate: 'mediaType', api: 'mediaType', site: 'media_type', values: ['StillImage', 'MovingImage', 'Sound'] },
  hasCoordinate: { kind: 'bool', predicate: 'hasCoordinate', api: 'hasCoordinate', site: 'has_coordinate' },
  hasGeospatialIssue: { kind: 'bool', predicate: 'hasGeospatialIssue', api: 'hasGeospatialIssue', site: 'has_geospatial_issue' },
};

export interface Part {
  field: string;
  values: string[];
  range?: { min: number | null; max: number | null };
  /** how to show it to a person, e.g. `country DK (Denmark)` */
  label: string;
}

export interface ParsedFilter {
  /** true when a query can run */
  ok: boolean;
  predicate: Predicate | null;
  parts: Part[];
  /** The filter in its strict form, ready to be sent back. */
  reuse: string;
  /** Unrecognised tokens. Never dropped silently. */
  notApplied: string[];
  /** Hard failures. When present no query is run. */
  errors: string[];
  /** Plain description of the filter for headlines. */
  description: string;
  taxon?: TaxonSummary;
  links: { see: string; api: string };
}

export interface Lookups {
  taxonByKey: typeof taxonByKey;
}

const defaultLookups: Lookups = { taxonByKey };

const regionNames = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });
/** The English name of an ISO 3166 two-letter code, or undefined when it is not a country. */
export function countryName(code: string): string | undefined {
  try {
    const name = regionNames.of(code.toUpperCase());
    // ICU answers "Unknown Region" (not undefined) for codes that are not assigned.
    return name && name !== 'Unknown Region' && name.toUpperCase() !== code.toUpperCase() ? name : undefined;
  } catch {
    return undefined;
  }
}

const TOKEN_RE = /([A-Za-z_][\w-]*)\s*(!=|>=|<=|=|:)\s*("[^"]*"|'[^']*'|[^\s]+)/g;
const squash = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, '');
const FIELD_BY_SQUASHED = new Map(Object.keys(FIELDS).map((f) => [squash(f), f]));

function parseRange(v: string): { min: number | null; max: number | null } | { list: number[] } | null {
  let m: RegExpMatchArray | null;
  if ((m = v.match(/^(\d{1,4})\s*(?:-|\.\.|,)\s*(\d{1,4})$/))) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  if ((m = v.match(/^(>=|<=)\s*(\d{1,4})$/))) {
    return m[1] === '>=' ? { min: Number(m[2]), max: null } : { min: null, max: Number(m[2]) };
  }
  if (/^\d{1,4}(\s*,\s*\d{1,4})+$/.test(v)) return { list: v.split(',').map((x) => Number(x.trim())) };
  if (/^\d{1,4}$/.test(v)) return { min: Number(v), max: Number(v) };
  return null;
}

function rangeText(r: { min: number | null; max: number | null }): string {
  if (r.min !== null && r.max !== null) return r.min === r.max ? String(r.min) : `${r.min}-${r.max}`;
  return r.min !== null ? `>=${r.min}` : `<=${r.max}`;
}

export async function parseFilter(input: string, lookups: Lookups = defaultLookups): Promise<ParsedFilter> {
  const text = String(input ?? '');
  const parts: Part[] = [];
  const notApplied: string[] = [];
  const errors: string[] = [];
  let taxon: TaxonSummary | undefined;
  /** Lookups that need the network (taxon keys), collected while reading and run afterwards, in order. */
  const pending: (() => Promise<void>)[] = [];

  const leftover = text.replace(TOKEN_RE, (raw, key: string, op: string, rawValue: string) => {
    // `year>=2010` is the range ">=2010"; the operator belongs to the value.
    const value = (op === '>=' || op === '<=' ? op : '') + rawValue.replace(/^["']|["']$/g, '');
    const field = FIELD_BY_SQUASHED.get(squash(key));
    if (op === '!=') {
      notApplied.push(`${raw} (negation is not supported yet). Results are NOT limited by it.`);
      return ' ';
    }
    if (!field) {
      const near = closestField(key);
      notApplied.push(`${raw} (not a filter field). Results are NOT limited by it.${near ? ` Did you mean ${near}=...?` : ''}`);
      return ' ';
    }
    if (parts.some((p) => p.field === field)) {
      notApplied.push(`${raw} (${field} was already given; only the first is used)`);
      return ' ';
    }
    const def = FIELDS[field];
    const values = value.split(',').map((v) => v.trim()).filter(Boolean);
    switch (def.kind) {
      case 'taxon':
        pending.push(async () => {
          const found = await lookups.taxonByKey(values[0]);
          if (!found) {
            errors.push(`taxonKey=${values[0]} does not exist. Use match_taxon to find a key.`);
            return;
          }
          taxon = found;
          parts.push({ field, values: [found.key], label: `taxonKey ${found.key} ${found.canonicalName} (${found.rank.toLowerCase()})` });
        });
        break;
      case 'country': {
        const good = values.filter((v) => /^[A-Za-z]{2}$/.test(v) && countryName(v));
        for (const v of values.filter((x) => !good.includes(x))) {
          notApplied.push(`country=${v} (expected a two-letter ISO country code such as DK). Results are NOT limited by it.`);
        }
        if (good.length) {
          const codes = good.map((v) => v.toUpperCase());
          parts.push({ field, values: codes, label: `country ${codes.map((c) => `${c} (${countryName(c)})`).join(', ')}` });
        }
        break;
      }
      case 'range': {
        const r = parseRange(value);
        if (!r) notApplied.push(`${raw} (expected a number, a range like 2010-2025, or >=2010). Results are NOT limited by it.`);
        else if ('list' in r) parts.push({ field, values: r.list.map(String), label: `${field} ${r.list.join(', ')}` });
        else parts.push({ field, values: [], range: r, label: `${field} ${rangeText(r)}` });
        break;
      }
      case 'enum': {
        const canon = values.map((v) => def.values!.find((x) => x.toLowerCase() === v.toLowerCase()));
        values.forEach((v, i) => {
          if (!canon[i]) notApplied.push(`${field}=${v} (not a known value). Known: ${def.values!.join(', ')}. Results are NOT limited by it.`);
        });
        const good = canon.filter((c): c is string => !!c);
        if (good.length) parts.push({ field, values: good, label: `${field} ${good.join(', ')}` });
        break;
      }
      case 'uuid': {
        const good = values.filter((v) => /^[0-9a-f-]{36}$/i.test(v));
        for (const v of values.filter((x) => !good.includes(x))) notApplied.push(`${field}=${v} (expected a UUID). Results are NOT limited by it.`);
        if (good.length) parts.push({ field, values: good, label: `${field} ${good.join(', ')}` });
        break;
      }
      case 'bool': {
        const v = values[0]?.toLowerCase();
        if (v === 'true' || v === 'false') parts.push({ field, values: [v], label: `${field} ${v}` });
        else notApplied.push(`${raw} (expected true or false). Results are NOT limited by it.`);
        break;
      }
    }
    return ' ';
  });
  for (const job of pending) await job();
  // A stable order, so the same filter always reads the same and canonical strings parse back to themselves.
  const order = Object.keys(FIELDS);
  parts.sort((a, b) => order.indexOf(a.field) - order.indexOf(b.field));

  const stray = leftover.trim();
  if (stray) {
    notApplied.push(`"${stray}" (free text is not read yet; write key=value, e.g. country=DK). Results are NOT limited by it.`);
  }
  if (!parts.length && !errors.length) {
    errors.push(`No usable filter. Write key=value pairs, e.g. taxonKey=2435099 country=DK year=2010-2025. Fields: ${Object.keys(FIELDS).join(', ')}.`);
  }
  const ok = !errors.length && parts.length > 0;
  return {
    ok,
    predicate: ok ? toPredicate(parts) : null,
    parts,
    reuse: parts.map(partToken).join(' '),
    notApplied,
    errors,
    description: parts.map((p) => p.label).join('; '),
    taxon,
    links: { see: siteLink(parts), api: apiLink(parts) },
  };
}

export function partToken(p: Part): string {
  return p.range ? `${p.field}=${rangeText(p.range)}` : `${p.field}=${p.values.join(',')}`;
}

function toPredicate(parts: Part[]): Predicate {
  const leaves: Predicate[] = parts.map((p) => {
    const def = FIELDS[p.field];
    const key = def.predicate;
    if (p.range) {
      const { min, max } = p.range;
      if (min !== null && max !== null) {
        return min === max
          ? { type: 'equals', key, value: min }
          : { type: 'and', predicates: [
              { type: 'greaterThanOrEquals', key, value: min },
              { type: 'lessThanOrEquals', key, value: max },
            ] };
      }
      return min !== null ? { type: 'greaterThanOrEquals', key, value: min } : { type: 'lessThanOrEquals', key, value: max };
    }
    const typed = def.kind === 'range' ? p.values.map(Number) : def.kind === 'bool' ? p.values.map((v) => v === 'true') : p.values;
    return typed.length === 1 ? { type: 'equals', key, value: typed[0] } : { type: 'in', key, values: typed };
  });
  return leaves.length === 1 ? leaves[0] : { type: 'and', predicates: leaves };
}

function linkParams(parts: Part[], name: 'site' | 'api'): [string, string][] {
  const out: [string, string][] = [];
  for (const p of parts) {
    const param = FIELDS[p.field][name];
    if (p.range) out.push([param, `${p.range.min ?? '*'},${p.range.max ?? '*'}`.replace(/^(\d+),\1$/, '$1')]);
    else for (const v of p.values) out.push([param, v]);
  }
  return out;
}

export function siteLink(parts: Part[]): string {
  return `${config.siteUrl}/occurrence/search?${new URLSearchParams(linkParams(parts, 'site'))}`;
}

export function apiLink(parts: Part[], extra: Record<string, string> = { limit: '0' }): string {
  return `${config.apiUrl}/v1/occurrence/search?${new URLSearchParams([...linkParams(parts, 'api'), ...Object.entries(extra)])}`;
}

function closestField(key: string): string | null {
  const k = squash(key);
  let best: [number, string] | null = null;
  for (const f of Object.keys(FIELDS)) {
    const d = editDistance(k, squash(f));
    if (!best || d < best[0]) best = [d, f];
  }
  return best && best[0] <= Math.max(2, Math.floor(k.length / 3)) ? best[1] : null;
}

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
