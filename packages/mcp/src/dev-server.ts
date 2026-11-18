// Local server: npm run dev. Same handlers as the Vercel functions, plus the static canvas page.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleCanvasApi, handleMcp } from './http.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT ?? 3333);

async function readBody(req: import('node:http').IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : undefined;
}

const staticFile = async (res: import('node:http').ServerResponse, file: string, type: string) => {
  try {
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
    res.end(await readFile(join(root, 'public', file)));
  } catch {
    res.writeHead(404).end('Not built. Run npm run build.');
  }
};

createServer(async (req, res) => {
  const path = new URL(req.url ?? '/', 'http://x').pathname;
  try {
    if (path === '/mcp') return await handleMcp(req, res, req.method === 'POST' ? await readBody(req) : undefined);
    if (path === '/api/canvas') return await handleCanvasApi(req, res);
    if (path.startsWith('/canvas/')) return await staticFile(res, 'canvas.html', 'text/html; charset=utf-8');
    if (path === '/canvas.js') return await staticFile(res, 'canvas.js', 'text/javascript; charset=utf-8');
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end(`GBIF MCP (local). MCP endpoint: POST /mcp\nTry: npm run smoke\n`);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}).listen(port, () => {
  console.log(`GBIF MCP listening on http://localhost:${port}/mcp  (canvas pages at /canvas/<id>)`);
});
