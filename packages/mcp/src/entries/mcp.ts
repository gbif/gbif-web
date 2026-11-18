// Vercel function: POST /mcp (rewritten to /api/mcp). Bundled to api/mcp.js by scripts/build.mjs.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleMcp } from '../http.js';

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  await handleMcp(req, res, req.body);
}
