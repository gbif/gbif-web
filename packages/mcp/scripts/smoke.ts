// End-to-end check against a RUNNING server and LIVE GBIF.
//   npm run dev                       (in one terminal)
//   npm run smoke                     (in another; defaults to http://localhost:3333)
//   MCP_URL=https://your-app.vercel.app/mcp npm run smoke     (a deployed one)
// Exits non-zero if anything is off, so it also works as a deploy check.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const url = process.env.MCP_URL ?? 'http://localhost:3333/mcp';
const failures: string[] = [];
const check = (ok: boolean, what: string) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`);
  if (!ok) failures.push(what);
};
const text = (r: any) => r.content?.[0]?.text as string;

const client = new Client({ name: 'smoke', version: '0' });
await client.connect(new StreamableHTTPClientTransport(new URL(url)));
console.log(`connected to ${url}\n`);

const tools = (await client.listTools()).tools.map((t) => t.name);
check(['match_taxon', 'search_occurrences', 'chart'].every((t) => tools.includes(t)), `tools: ${tools.join(', ')}`);
const widget = await client.readResource({ uri: 'ui://gbif/chart.html' });
check(/<html/i.test((widget.contents[0] as any).text), 'widget resource is readable');

const match: any = await client.callTool({ name: 'match_taxon', arguments: { name: 'Puma concolor' } });
console.log(`\n--- match_taxon\n${text(match)}`);
const key = /taxonKey (\S+?)[.,]/.exec(text(match))?.[1];
check(!!key, `matched Puma concolor to key ${key}`);

const search: any = await client.callTool({ name: 'search_occurrences', arguments: { filter: `taxonKey=${key} country=US`, facet: 'basisOfRecord', limit: 3 } });
console.log(`\n--- search_occurrences\n${text(search)}`);
check(/[\d,]+ records/.test(text(search)), 'search returned a count');

// The plainest call, with no breakdown and no sample, builds a different GraphQL query than the one above.
const countOnly: any = await client.callTool({ name: 'search_occurrences', arguments: { filter: 'country=DK' } });
check(!countOnly.isError && /[\d,]+ records/.test(text(countOnly)), `count-only search: ${text(countOnly).split('\n')[0]}`);

const chart: any = await client.callTool({ name: 'chart', arguments: { filter: `taxonKey=${key}`, x: 'year', canvas: 'new' } });
console.log(`\n--- chart\n${text(chart)}`);
check(chart.structuredContent?.chart?.rows?.length > 0, 'chart has rows for the widget');
const live = /Live view: (\S+)/.exec(text(chart))?.[1];
check(!!live, `chart gave a Live view link: ${live}`);

if (live) {
  const api = new URL(live);
  const page = await fetch(live);
  check(page.ok && /GBIF live canvas/.test(await page.text()), 'canvas page is served');
  const items: any = await (await fetch(`${api.origin}/api/canvas?id=${api.pathname.split('/').pop()}`)).json();
  check(items.items?.length === 1, 'canvas API shows the chart');
}

await client.close();
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nall good');
process.exit(failures.length ? 1 : 0);
