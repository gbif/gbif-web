// Request handlers shared by the Vercel functions and the local dev server.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';
import { defaultStore, isCanvasId, type CanvasStore } from './canvas.js';

export function baseUrlFor(req: IncomingMessage): string {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL;
  const host = (req.headers['x-forwarded-host'] as string) ?? req.headers.host ?? 'localhost';
  const proto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0] ?? (/^localhost|^127\./.test(host) ? 'http' : 'https');
  return `${proto}://${host}`;
}

const json = (res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) => {
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers });
  res.end(JSON.stringify(body));
};

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, mcp-protocol-version, mcp-session-id, authorization',
  'access-control-allow-methods': 'POST, OPTIONS',
};

/** Stateless Streamable HTTP: a fresh server and transport for every POST. */
export async function handleMcp(req: IncomingMessage, res: ServerResponse, body: unknown, store: CanvasStore = defaultStore()) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    return res.end();
  }
  if (req.method !== 'POST') {
    return json(res, 405, { jsonrpc: '2.0', error: { code: -32000, message: 'Use POST. This server keeps no sessions.' }, id: null }, { ...CORS, allow: 'POST' });
  }
  for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v);
  const server = createServer({ store, baseUrl: baseUrlFor(req) });
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  res.on('close', () => {
    void transport.close();
    void server.close();
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) json(res, 500, { jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null });
  }
}

/** GET /api/canvas?id=... returns the items of one canvas. Read-only. */
export async function handleCanvasApi(req: IncomingMessage, res: ServerResponse, store: CanvasStore = defaultStore()) {
  const id = new URL(req.url ?? '', 'http://x').searchParams.get('id');
  if (!isCanvasId(id)) return json(res, 400, { error: 'Missing or malformed canvas id' });
  const items = await store.list(id);
  if (!items) return json(res, 404, { error: 'Unknown or expired canvas' });
  return json(res, 200, { items });
}
