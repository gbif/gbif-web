import { Base64 } from 'js-base64';

/**
 * Serialization for the occurrence dashboard `layout` URL param.
 *
 * The layout is an array of columns; each column is an ordered list of charts;
 * each chart has a type (`t`) and a params object (`p`, e.g. the current view,
 * a resized height or a chart specific setting such as the taxa rank).
 *
 * Instead of base64-encoded JSON we serialize to a compact, human-readable
 * string so shared links are shorter and possible to read/tweak by hand:
 *
 *   layout := column ( "*" column )*      # columns
 *   column := chart  ( "_" chart  )*      # charts within a column
 *   chart  := type   ( "." param  )*      # chart type followed by its params
 *   param  := key "-" value               # a single param
 *
 * Example: two columns, the taxa chart showing genus on a map next to a pie of
 * basis of record, and a resized map in the second column:
 *
 *   taxa.rank-GENUS.v-MAP_basisOfRecord.v-PIE*map.h-600
 *
 * The four separators (`* _ . -`) are all left untouched by the
 * application/x-www-form-urlencoded serializer that `URLSearchParams` uses, so
 * the param stays readable in the address bar. Only chart param *values* can
 * contain arbitrary data, so those (and only those) are escaped when they
 * contain a separator. Legacy base64-JSON links are still read for back-compat.
 */

const COLUMN_SEP = '*';
const CHART_SEP = '_';
const FIELD_SEP = '.';
const KV_SEP = '-';

// Short aliases for common param keys (height is already `h`). The map is a
// permanent contract: once shipped, an alias must not change its meaning.
const KEY_TO_SHORT: Record<string, string> = { view: 'v' };
const SHORT_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(KEY_TO_SHORT).map(([key, short]) => [short, key])
);

// Characters that are structural in our grammar (plus `%`, our escape marker).
// They are the only thing we need to escape inside a value.
const STRUCTURAL = /[%*_.-]/g;

export type ChartItem = {
  id?: string;
  t: string;
  p?: Record<string, unknown>;
  [key: string]: unknown;
};
export type Layout = ChartItem[][];

function encodeValue(value: unknown): string {
  return String(value).replace(
    STRUCTURAL,
    (char) => '%' + char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')
  );
}

function decodeValue(raw: string): unknown {
  const str = raw.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  // Restore primitive types so we keep parity with the previous JSON form
  // (e.g. a resized height must stay a number, not become "600").
  if (/^-?\d+(\.\d+)?$/.test(str)) return Number(str);
  if (str === 'true') return true;
  if (str === 'false') return false;
  return str;
}

function serializeParams(params: Record<string, unknown> = {}): string {
  const fields = Object.keys(params)
    .filter((key) => {
      const value = params[key];
      return value !== undefined && value !== null && value !== '';
    })
    .map((key) => ({ short: KEY_TO_SHORT[key] ?? key, value: params[key] }))
    // Sort by serialized key so the output is deterministic regardless of insertion order
    .sort((a, b) => (a.short < b.short ? -1 : a.short > b.short ? 1 : 0))
    .map(({ short, value }) => `${short}${KV_SEP}${encodeValue(value)}`);
  return fields.length ? FIELD_SEP + fields.join(FIELD_SEP) : '';
}

function serializeChart(item: ChartItem): string {
  return `${item.t}${serializeParams(item.p)}`;
}

export function serializeLayout(layout?: Layout): string | undefined {
  if (!Array.isArray(layout)) return undefined;
  // An empty layout (no charts in any column) clears the param.
  if (!layout.some((column) => Array.isArray(column) && column.length > 0)) return undefined;
  return layout
    .map((column) =>
      Array.isArray(column) ? column.filter((item) => item?.t).map(serializeChart).join(CHART_SEP) : ''
    )
    .join(COLUMN_SEP);
}

function parseChart(token: string, id: string): ChartItem | null {
  if (!token) return null;
  const [type, ...fields] = token.split(FIELD_SEP);
  if (!type) return null;
  const p: Record<string, unknown> = {};
  for (const field of fields) {
    if (!field) continue;
    const idx = field.indexOf(KV_SEP);
    if (idx === -1) continue; // malformed param, skip it rather than break the whole layout
    const short = field.slice(0, idx);
    const key = SHORT_TO_KEY[short] ?? short;
    p[key] = decodeValue(field.slice(idx + 1));
  }
  return { id, t: type, p };
}

function parseCompact(str: string): Layout {
  return str.split(COLUMN_SEP).map((columnStr, columnIndex) => {
    if (!columnStr) return [];
    return columnStr
      .split(CHART_SEP)
      // Ids are not serialized; derive a stable, unique-within-layout id from the
      // position so re-parsing the same string is deterministic (avoids render churn
      // and keeps the "shared layout differs" comparison stable).
      .map((token, chartIndex) => parseChart(token, `c${columnIndex}i${chartIndex}`))
      .filter((item): item is ChartItem => item !== null);
  });
}

export function parseLayout(str?: string): Layout | undefined {
  if (!str) return undefined;
  // Back-compat: older shared links are base64-encoded JSON.
  try {
    const json = JSON.parse(Base64.decode(str));
    if (Array.isArray(json)) return json as Layout;
  } catch {
    // not legacy base64-JSON, fall through to the compact format
  }
  return parseCompact(str);
}
