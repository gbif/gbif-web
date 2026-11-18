// The MCP server: tools, the widget resource and the instructions. One server per request (stateless).
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { z } from 'zod';
import { config } from './config.js';
import { matchName, searchOccurrences, GbifError } from './gbif.js';
import { parseFilter, type ParsedFilter } from './filter.js';
import { DIMENSIONS, DIMENSION_NAMES } from './dimensions.js';
import { fmt, renderResult } from './format.js';
import { resolveCanvas, type CanvasStore } from './canvas.js';
import { CHART_VIEW_HTML } from './generated/chart-view.js';
import type { CanvasItem, ChartSpec } from './types.js';

export const WIDGET_URI = 'ui://gbif/chart.html';

const CANVAS_HELP =
  'If there is no Live view link earlier in this conversation, pass canvas: "new". Otherwise pass the id from that link.';

const INSTRUCTIONS = `GBIF (Global Biodiversity Information Facility) occurrence data.
Filters are space-separated key=value pairs, e.g. taxonKey=2435099 country=DK year=2010-2025.
Use match_taxon to turn a species name into a taxonKey. Counts and charts cover all matching records.
Charts also go to a live canvas page; each chart result ends with a "Live view" link. Mention that link to the user once, and pass its id as the canvas parameter in later calls.`;

const FILTER_HELP =
  'key=value pairs separated by spaces. Fields: taxonKey, country (ISO 2-letter), year, month, basisOfRecord, datasetKey, publishingOrg, mediaType, hasCoordinate, hasGeospatialIssue. Comma means OR (country=DK,SE). Ranges: year=2010-2025, year>=2010 or year<=2010.';

function filterProblem(f: ParsedFilter): string {
  return renderResult({
    headline: f.errors.join(' '),
    notApplied: f.notApplied,
    hint: 'No query was run.',
  });
}

/** The values behind a chart as compact lines. A long series shows its peaks and its most recent values, not its oldest. */
function describeRows(rows: { label: string; count: number }[], kind: 'temporal' | 'categorical'): string[] {
  const line = (r: { label: string; count: number }) => `${r.label}\t${fmt(r.count)}`;
  if (kind === 'categorical') return ['Top values:', ...rows.slice(0, 10).map(line)];
  if (rows.length <= 24) return ['Values:', ...rows.map(line)];
  const peaks = [...rows].sort((a, b) => b.count - a.count).slice(0, 5).sort((a, b) => Number(a.label) - Number(b.label));
  return [`Highest 5 of ${rows.length} (${rows[0].label} to ${rows[rows.length - 1].label}):`, ...peaks.map(line), 'Most recent 10:', ...rows.slice(-10).map(line)];
}

export interface ServerOptions {
  store: CanvasStore;
  /** Public address of this deployment, e.g. https://gbif-mcp.vercel.app */
  baseUrl: string;
}

export function createServer({ store, baseUrl }: ServerOptions): McpServer {
  const server = new McpServer({ name: 'gbif', version: '0.0.1' }, { instructions: INSTRUCTIONS });
  const liveUrl = (id: string) => `${baseUrl.replace(/\/$/, '')}/canvas/${id}`;
  const guard = async (fn: () => Promise<{ text: string; structured?: Record<string, unknown> }>) => {
    try {
      const r = await fn();
      return { content: [{ type: 'text' as const, text: r.text }], ...(r.structured ? { structuredContent: r.structured } : {}) };
    } catch (e) {
      const msg = e instanceof GbifError ? e.message : 'Unexpected error while asking GBIF.';
      if (!(e instanceof GbifError)) console.error(e);
      return { isError: true, content: [{ type: 'text' as const, text: `${msg} Try again, or narrow the filter.` }] };
    }
  };

  // --- match_taxon ------------------------------------------------------------------------------
  server.registerTool(
    'match_taxon',
    {
      title: 'Match a taxon name',
      description:
        'Resolve a species or group name to a GBIF taxonKey. Use the returned taxonKey in other tools: filter "taxonKey=<key>".',
      inputSchema: {
        name: z.string().describe('Scientific or common name, e.g. "Puma concolor".'),
        rank: z.string().optional().describe('Optional rank to prefer, e.g. GENUS or SPECIES.'),
      },
      annotations: { readOnlyHint: true },
    },
    ({ name, rank }) =>
      guard(async () => {
        const m = await matchName(name, rank?.toUpperCase());
        if (!m || m.matchType === 'NONE') {
          return { text: renderResult({ headline: `No GBIF taxon matched "${name}".`, hint: 'Check the spelling or try the scientific name.' }) };
        }
        const strong = (m.matchType === 'EXACT' || m.matchType === 'VARIANT') && m.confidence >= 80;
        const lineage = m.classification.map((c) => c.name).join(' > ');
        const body = [`Classification: ${lineage}`];
        if (m.acceptedKey) body.push(`"${name}" is a synonym; the accepted name is used.`);
        if (!strong) {
          body.push(`Low confidence (${m.matchType.toLowerCase()}, ${m.confidence}). Other candidates:`);
          for (const a of m.alternatives.slice(0, 5)) body.push(`- taxonKey=${a.key} ${a.name} (${a.rank.toLowerCase()}, ${a.status.toLowerCase()})`);
        }
        const auth = m.authorship && !m.name.includes(m.authorship) ? ` ${m.authorship}` : '';
        return {
          text: renderResult({
            headline: `${m.name}${auth} (${m.rank.toLowerCase()}, ${m.status.toLowerCase()}), taxonKey ${m.key}. Match: ${m.matchType.toLowerCase()}, confidence ${m.confidence}.`,
            reuse: `taxonKey=${m.key}`,
            body,
            see: `${config.siteUrl}/species/${m.key}`,
          }),
        };
      }),
  );

  // --- search_occurrences -----------------------------------------------------------------------
  server.registerTool(
    'search_occurrences',
    {
      title: 'Count occurrence records',
      description:
        'Count occurrence records matching a filter, optionally with a breakdown and a few sample records. For charts of everything that matches use chart.',
      inputSchema: {
        filter: z.string().describe(FILTER_HELP),
        limit: z.number().int().min(0).max(config.maxSample).optional().describe(`Sample records to return, 0 to 20. Default 0 (count only).`),
        facet: z.enum(DIMENSION_NAMES).optional().describe('Optional breakdown of all matching records by this dimension.'),
      },
      annotations: { readOnlyHint: true },
    },
    ({ filter, limit = 0, facet }) =>
      guard(async () => {
        const f = await parseFilter(filter);
        if (!f.ok) return { text: filterProblem(f) };
        const dim = facet ? DIMENSIONS[facet] : undefined;
        const r = await searchOccurrences({
          predicate: f.predicate!,
          facetField: dim?.facet,
          facetSize: dim ? Math.min(dim.defaultSize, 20) : undefined,
          sampleSize: limit,
        });
        const body: string[] = [];
        if (r.facet) {
          body.push(`By ${facet} (top ${r.facet.rows.length} of ${fmt(r.facet.distinct)} values):`);
          for (const row of r.facet.rows) body.push(`${row.label}\t${fmt(row.count)}`);
        }
        if (r.sample.length) {
          body.push(`Sample (${r.sample.length} of ${fmt(r.total)}, not random):`);
          body.push('gbifId\tscientificName\tcountry\tyear\tbasisOfRecord\tdataset (publisher, license)');
          for (const o of r.sample) {
            body.push([o.key, o.scientificName, o.countryCode ?? '', o.year ?? '', o.basisOfRecord, `${o.datasetTitle} (${o.publisherTitle}, ${o.license})`].join('\t'));
          }
        }
        return {
          text: renderResult({
            headline: `${f.description}: ${fmt(r.total)} records. Count as reported by GBIF's search index.`,
            reuse: f.reuse,
            notApplied: f.notApplied,
            body,
            see: f.links.see,
            api: f.links.api,
            hint: r.total > 0 && !limit ? 'Use chart for a breakdown, or limit=5 for sample records. For citable data, use a GBIF download.' : undefined,
          }),
        };
      }),
  );

  // --- chart ------------------------------------------------------------------------------------
  registerAppTool(
    server,
    'chart',
    {
      title: 'Chart occurrence records',
      description:
        'Break down ALL records matching a filter by one dimension and draw it as a chart. Also added to a live canvas page. ' + CANVAS_HELP,
      inputSchema: {
        filter: z.string().describe(FILTER_HELP),
        x: z.enum(DIMENSION_NAMES).describe('What to count records per: year, month, country, basisOfRecord, dataset, continent, license or mediaType.'),
        type: z.enum(['auto', 'bar', 'line']).optional().describe('Default auto: a line for year, bars otherwise.'),
        top_n: z.number().int().min(1).max(50).optional().describe('Most frequent values to show for categories. Default depends on x.'),
        canvas: z.string().optional().describe('"new", or the id from an earlier Live view link.'),
      },
      annotations: { readOnlyHint: true },
      _meta: { ui: { resourceUri: WIDGET_URI } },
    },
    ({ filter, x, type = 'auto', top_n, canvas }) =>
      guard(async () => {
        const f = await parseFilter(filter);
        if (!f.ok) return { text: filterProblem(f) };
        const dim = DIMENSIONS[x];
        const size = Math.min(top_n ?? dim.defaultSize, dim.maxSize);
        const r = await searchOccurrences({ predicate: f.predicate!, facetField: dim.facet, facetSize: size });
        let rows = (r.facet?.rows ?? []).map((row) => ({ label: row.label, count: row.count }));
        if (dim.kind === 'temporal') {
          const num = (s: string) => Number(s);
          const keyed = (r.facet?.rows ?? []).map((row) => ({ k: num(row.key), label: row.label, count: row.count }));
          rows = keyed.sort((a, b) => a.k - b.k).map(({ label, count }) => ({ label, count }));
        }
        const distinct = r.facet?.distinct ?? rows.length;
        const shown = rows.reduce((s, row) => s + row.count, 0);
        const chosen = type === 'auto' ? (x === 'year' ? 'line' : 'bar') : type;
        const note =
          dim.kind === 'categorical' && distinct > rows.length
            ? `Showing the top ${rows.length} of ${fmt(distinct)} values; the other ${fmt(Math.max(0, r.total - shown))} records are not drawn.`
            : undefined;
        const spec: ChartSpec = {
          type: chosen,
          orientation: dim.kind === 'temporal' ? 'vertical' : 'horizontal',
          title: `${dim.title}: ${f.description}`,
          xLabel: x,
          rows,
          total: r.total,
          note,
        };

        const { id, note: canvasNote } = await resolveCanvas(store, canvas);
        const live = liveUrl(id);
        const max = rows.length ? rows.reduce((a, b) => (b.count > a.count ? b : a)) : undefined;
        const min = rows.length ? rows.reduce((a, b) => (b.count < a.count ? b : a)) : undefined;
        const body = [
          `Drew a ${chosen} chart of records per ${x}: ${rows.length} values${note ? ` (${note.replace(/\.$/, '')})` : ''}.`,
          max && min ? `Highest: ${max.label} (${fmt(max.count)}). Lowest: ${min.label} (${fmt(min.count)}).` : 'No records matched.',
          ...describeRows(rows, dim.kind),
        ];
        if (canvasNote) body.push(canvasNote);
        const text = renderResult({
          headline: `${f.description}: ${fmt(r.total)} records in total. Counts as reported by GBIF's search index.`,
          reuse: f.reuse,
          notApplied: f.notApplied,
          body,
          see: f.links.see,
          live,
          api: f.links.api.replace('limit=0', 'limit=0&facet=' + (dim.facet === 'countryCode' ? 'country' : dim.facet) + '&facetLimit=' + size),
          hint: `Mention the Live view link to the user once. Pass canvas: "${id}" in later chart calls.`,
        });
        const item: CanvasItem = { id: `${Date.now().toString(36)}`, ts: Date.now(), kind: 'chart', title: spec.title, chart: spec, text, links: f.links };
        await store.append(id, item);
        return {
          text,
          structured: { chart: spec, summary: `${fmt(r.total)} records`, see: f.links.see, live },
        };
      }),
  );

  registerAppResource(
    server,
    'GBIF chart',
    WIDGET_URI,
    { description: 'A bar or line chart of GBIF occurrence counts.' },
    async () => ({
      contents: [{ uri: WIDGET_URI, mimeType: RESOURCE_MIME_TYPE, text: CHART_VIEW_HTML, _meta: { ui: { prefersBorder: true } } }],
    }),
  );

  return server;
}
