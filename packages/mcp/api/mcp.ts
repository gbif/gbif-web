// Vercel function: POST /mcp (rewritten to /api/mcp). Must be a committed file: Vercel only detects functions that exist before the build runs.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleMcp } from '../src/http.js';

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  await handleMcp(req, res, req.body);
}
