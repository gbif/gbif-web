// Vercel function: GET /api/canvas?id=...
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleCanvasApi } from '../http.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await handleCanvasApi(req, res);
}
