// The canvas: a page at /canvas/<id> that shows what has been charted in a conversation. The server holds
// the state; the browser only reads it. The id is a random capability: anyone with the link can look.
import { randomBytes } from 'node:crypto';
import type { CanvasItem } from './types.js';

export const CANVAS_TTL_SECONDS = 60 * 60 * 24;
const ID_RE = /^[A-Za-z0-9_-]{22}$/;

export const newCanvasId = () => randomBytes(16).toString('base64url');
export const isCanvasId = (s: unknown): s is string => typeof s === 'string' && ID_RE.test(s);

export interface CanvasStore {
  create(): Promise<string>;
  /** null when the canvas does not exist or has expired */
  list(id: string): Promise<CanvasItem[] | null>;
  append(id: string, item: CanvasItem): Promise<void>;
}

/** In memory. Fine for `npm run dev`; useless on serverless, where every request may be a new process. */
export class MemoryCanvasStore implements CanvasStore {
  private canvases = new Map<string, { expires: number; items: CanvasItem[] }>();

  async create() {
    const id = newCanvasId();
    this.canvases.set(id, { expires: Date.now() + CANVAS_TTL_SECONDS * 1000, items: [] });
    return id;
  }

  async list(id: string) {
    const c = this.canvases.get(id);
    if (!c || c.expires < Date.now()) return null;
    return c.items;
  }

  async append(id: string, item: CanvasItem) {
    const c = this.canvases.get(id);
    if (!c) return;
    c.items.push(item);
    c.expires = Date.now() + CANVAS_TTL_SECONDS * 1000;
  }
}

/** Upstash Redis over its REST API (what Vercel's Redis integration provides). No client library needed. */
export class RestRedisCanvasStore implements CanvasStore {
  constructor(private url: string, private token: string) {}

  private async run(commands: (string | number)[][]): Promise<any[]> {
    const res = await fetch(`${this.url}/pipeline`, {
      method: 'POST',
      headers: { authorization: `Bearer ${this.token}`, 'content-type': 'application/json' },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Canvas store answered ${res.status}`);
    return ((await res.json()) as { result: unknown }[]).map((r) => r.result);
  }

  async create() {
    const id = newCanvasId();
    await this.run([['SET', `canvas:${id}:meta`, '1', 'EX', CANVAS_TTL_SECONDS]]);
    return id;
  }

  async list(id: string) {
    const [meta, items] = await this.run([['EXISTS', `canvas:${id}:meta`], ['LRANGE', `canvas:${id}`, 0, -1]]);
    if (!meta) return null;
    return (items as string[]).map((s) => JSON.parse(s) as CanvasItem);
  }

  async append(id: string, item: CanvasItem) {
    await this.run([
      ['RPUSH', `canvas:${id}`, JSON.stringify(item)],
      ['EXPIRE', `canvas:${id}`, CANVAS_TTL_SECONDS],
      ['EXPIRE', `canvas:${id}:meta`, CANVAS_TTL_SECONDS],
    ]);
  }
}

let shared: CanvasStore | undefined;
/** The store for this process: Redis when configured, memory otherwise. */
export function defaultStore(): CanvasStore {
  if (!shared) {
    const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
    shared = url && token ? new RestRedisCanvasStore(url, token) : new MemoryCanvasStore();
  }
  return shared;
}

/**
 * `canvas` is "new", an id from an earlier Live view link, or missing. The server cannot tell whether a
 * call starts a new conversation (there is no conversation id in MCP, and this transport keeps no session),
 * so a missing or unknown value starts a fresh canvas, and the result says which link to keep using.
 */
export async function resolveCanvas(store: CanvasStore, input?: string): Promise<{ id: string; note?: string }> {
  if (input && input !== 'new' && isCanvasId(input) && (await store.list(input))) return { id: input };
  const id = await store.create();
  if (input && input !== 'new') return { id, note: 'The canvas you passed was not found or has expired; a new one was started.' };
  return { id };
}
