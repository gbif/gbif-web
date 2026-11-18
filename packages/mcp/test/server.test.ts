// Drives the real MCP server through an in-memory client, with GBIF mocked. No network.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';
import { MemoryCanvasStore } from '../src/canvas.js';

const realFetch = globalThis.fetch;
const calls: { url: string; body?: any }[] = [];

function mockGbif() {
  globalThis.fetch = (async (input: any, init?: any) => {
    const url = String(input);
    const body = init?.body ? JSON.parse(init.body) : undefined;
    calls.push({ url, body });
    const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
    if (url.includes('/v2/species/match')) {
      return json({
        usage: { key: '2435099', name: 'Puma concolor (Linnaeus, 1771)', canonicalName: 'Puma concolor', authorship: '(Linnaeus, 1771)', rank: 'SPECIES', status: 'ACCEPTED' },
        classification: [{ name: 'Animalia', rank: 'KINGDOM' }, { name: 'Puma concolor', rank: 'SPECIES' }],
        diagnostics: { matchType: 'EXACT', confidence: 98, alternatives: [] },
      });
    }
    if (url.includes('/v1/species/')) return json({ key: 2435099, scientificName: 'Puma concolor (Linnaeus, 1771)', canonicalName: 'Puma concolor', rank: 'SPECIES', taxonomicStatus: 'ACCEPTED' });
    if (url.includes('/graphql')) {
      const q: string = body.query;
      const field = /facet \{ (\w+)\(/.exec(q)?.[1];
      const data: any = { occurrenceSearch: { documents: { total: 1234, results: q.includes('results') ? [{ key: 1, verbatimScientificName: 'puma', classification: { usage: { name: 'Puma concolor (Linnaeus, 1771)' } }, countryCode: 'DK', year: 2020, basisOfRecord: 'HUMAN_OBSERVATION', datasetTitle: 'iNat', publisherTitle: 'iNaturalist', license: 'CC0_1_0' }] : undefined } } };
      if (field === 'year') data.occurrenceSearch.facet = { year: [{ key: 2021, count: 30, label: '2021' }, { key: 2019, count: 10, label: '2019' }, { key: 2020, count: 20, label: '2020' }] };
      if (field === 'countryCode') data.occurrenceSearch.facet = { countryCode: [{ key: 'DK', count: 900, label: 'Denmark' }, { key: 'SE', count: 300, label: 'Sweden' }] };
      if (field) data.occurrenceSearch.cardinality = { [field]: field === 'countryCode' ? 5 : 3 };
      return json({ data });
    }
    throw new Error(`unexpected fetch ${url}`);
  }) as typeof fetch;
}

let client: Client;
let store: MemoryCanvasStore;
beforeEach(async () => {
  calls.length = 0;
  mockGbif();
  store = new MemoryCanvasStore();
  const server = createServer({ store, baseUrl: 'https://example.test' });
  const [a, b] = InMemoryTransport.createLinkedPair();
  client = new Client({ name: 'test', version: '0' });
  await Promise.all([server.connect(a), client.connect(b)]);
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

const text = (r: any) => r.content[0].text as string;

test('lists the tools and the widget resource', async () => {
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((t) => t.name).sort(), ['chart', 'match_taxon', 'search_occurrences']);
  const chart = tools.tools.find((t) => t.name === 'chart')!;
  assert.equal((chart._meta as any).ui.resourceUri, 'ui://gbif/chart.html');
  const res = await client.readResource({ uri: 'ui://gbif/chart.html' });
  assert.match((res.contents[0] as any).text, /<!doctype html>/i);
});

test('match_taxon gives the key, the lineage and a reusable filter', async () => {
  const r = await client.callTool({ name: 'match_taxon', arguments: { name: 'puma concolor' } });
  assert.match(text(r), /taxonKey 2435099/);
  assert.match(text(r), /Reuse: taxonKey=2435099/);
  assert.match(text(r), /See it: https:\/\/www\.gbif\.org\/species\/2435099/);
});

test('search_occurrences counts, states completeness and links to the site and the API', async () => {
  const r = await client.callTool({ name: 'search_occurrences', arguments: { filter: 'country=DK year=2020', limit: 1, facet: 'country' } });
  const t = text(r);
  assert.match(t, /1,234 records/);
  assert.match(t, /By country \(top 2 of 5 values\)/);
  assert.match(t, /Denmark\t900/);
  assert.match(t, /Sample \(1 of 1,234, not random\)/);
  assert.match(t, /\n1\tPuma concolor \(Linnaeus, 1771\)\tDK\t2020/);
  assert.match(t, /iNat \(iNaturalist, CC0_1_0\)/);
  const labels = t.split('\n').filter((l) => /^(Reuse|Not applied|See it|Live view|API|Hint):/.test(l)).map((l) => l.split(':')[0]);
  assert.deepEqual(labels, ['Reuse', 'See it', 'API']);
});

test('search_occurrences reports ignored tokens and runs no query when nothing is usable', async () => {
  const ok = await client.callTool({ name: 'search_occurrences', arguments: { filter: 'country=DK invasive=true' } });
  assert.match(text(ok), /Not applied: invasive=true \(not a filter field\)\. Results are NOT limited by it\./);
  const before = calls.length;
  const bad = await client.callTool({ name: 'search_occurrences', arguments: { filter: 'hello' } });
  assert.match(text(bad), /No query was run/);
  assert.equal(calls.length, before);
});

test('chart returns text, structured data for the widget, and adds to the canvas', async () => {
  const r: any = await client.callTool({ name: 'chart', arguments: { filter: 'taxonKey=2435099 country=DK', x: 'year', canvas: 'new' } });
  const t = text(r);
  assert.match(t, /Drew a line chart of records per year: 3 values/);
  assert.match(t, /Highest: 2021 \(30\)\. Lowest: 2019 \(10\)\./);
  assert.ok(t.indexOf('2019\t10') < t.indexOf('2021\t30'), 'years are in ascending order');
  const live = /Live view: (\S+)/.exec(t)![1];
  assert.match(live, /^https:\/\/example\.test\/canvas\/[A-Za-z0-9_-]{22}$/);
  assert.equal(r.structuredContent.chart.type, 'line');
  assert.deepEqual(r.structuredContent.chart.rows.map((x: any) => x.label), ['2019', '2020', '2021']);
  const id = live.split('/').pop()!;
  const items = await store.list(id);
  assert.equal(items?.length, 1);

  // a second chart with the id from the Live view link lands on the same canvas
  const r2: any = await client.callTool({ name: 'chart', arguments: { filter: 'country=DK', x: 'country', canvas: id } });
  assert.match(text(r2), new RegExp(`Live view: https://example.test/canvas/${id}`));
  assert.match(text(r2), /Showing the top 2 of 5 values/);
  assert.equal((await store.list(id))?.length, 2);
});

test('an unknown canvas id starts a new canvas and says so', async () => {
  const r: any = await client.callTool({ name: 'chart', arguments: { filter: 'country=DK', x: 'year', canvas: 'AAAAAAAAAAAAAAAAAAAAAA' } });
  assert.match(text(r), /was not found or has expired; a new one was started/);
});

test('GBIF failures come back as a tool error the model can read', async () => {
  globalThis.fetch = (async () => new Response('nope', { status: 503 })) as typeof fetch;
  const r: any = await client.callTool({ name: 'search_occurrences', arguments: { filter: 'country=DK' } });
  assert.equal(r.isError, true);
  assert.match(text(r), /GBIF answered 503/);
});

test('a long series is described by its peaks and its latest values, not its oldest', async () => {
  const many = Array.from({ length: 40 }, (_, i) => ({ key: 1980 + i, count: 100 + (i === 7 ? 5000 : i), label: String(1980 + i) }));
  const prev = globalThis.fetch;
  globalThis.fetch = (async (input: any, init?: any) => {
    const body = init?.body ? JSON.parse(init.body) : {};
    if (String(input).includes('/graphql')) {
      return new Response(JSON.stringify({ data: { occurrenceSearch: { documents: { total: 99999 }, facet: { year: many }, cardinality: { year: 40 } } } }));
    }
    return prev(input, init);
  }) as typeof fetch;
  const r: any = await client.callTool({ name: 'chart', arguments: { filter: 'country=DK', x: 'year' } });
  const t = text(r);
  assert.match(t, /Highest 5 of 40 \(1980 to 2019\)/);
  assert.match(t, /1987\t5,100/);
  assert.match(t, /Most recent 10:\n2010\t/);
  assert.doesNotMatch(t, /\n1981\t/);
});
