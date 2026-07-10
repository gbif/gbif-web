import type { Express, Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { z } from 'zod';
import config from '@/config';
import logger, { getLogLevel, setLogLevel } from '@/logger';
import extractUser from '@/helpers/auth/extractUser';
import { getOverloadSettings, setOverloadSettings } from '@/overloadGuard';
import { getPoolNames, getPoolSettings, setPoolSettings } from '@/requestPools';
import type { PoolName } from '@/requestAgents';

/**
 * Runtime admin endpoint.
 *
 * Exposes the subset of settings that are safe to change without a redeploy
 * (log level, overload guard thresholds, per-pool limits) and lets an
 * authorised user adjust them live. Changes are in-memory and ephemeral — they
 * reset on restart by design — so this is for incident response / tuning, not
 * durable configuration.
 *
 * This instance is one of several behind the load balancer; the caller
 * (gbif-org's server) is expected to fan a change out to every instance. Each
 * instance authorizes requests independently.
 *
 * Authorisation: the request must carry a `Bearer` GBIF JWT (the same token the
 * GraphQL API already verifies). The resolved user must be on the configured
 * allowlist (`adminUsers`). The endpoint is fail-closed until explicitly opened per environment.
 */

const adminUsers: string[] = (get(config, 'adminUsers', []) as string[]) ?? [];

type AdminUser =
  | { userName?: string; email?: string; roles?: string[] }
  | null
  | undefined;

function isAuthorised(user: AdminUser): boolean {
  if (!user || !user.email || !Array.isArray(user.roles)) return false;
  // Users email must be included in adminUsers in the config
  if (!adminUsers.includes(user.email)) return false;
  // Must have an gbif.org email
  if (!user.email.endsWith('@gbif.org')) return false;
  // Must be gbif registry admin
  if (!user.roles?.includes('REGISTRY_ADMIN')) return false;
  return true;
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Cache-Control', 'no-store');
  const user = (await extractUser(
    get(req, 'headers.authorization'),
  )) as AdminUser;
  if (!isAuthorised(user)) {
    // Deliberately uniform 403 — do not distinguish "not authenticated" from
    // "authenticated but not allowed".
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  (req as Request & { adminUser?: AdminUser }).adminUser = user;
  next();
}

function currentSettings() {
  return {
    logLevel: getLogLevel(),
    overload: getOverloadSettings(),
    pools: getPoolSettings(),
  };
}

// A pool knob accepts a number or the string sentinels the resolvers already
// understand ('unbounded' / 'none' / -1 all mean "no limit").
const limitValue = z.union([z.number(), z.enum(['unbounded', 'none'])]);

const PoolPatchSchema = z
  .object({
    concurrency: limitValue.optional(),
    maxQueueDepth: limitValue.optional(),
    timeoutMs: limitValue.optional(),
    perRequestConcurrency: limitValue.optional(),
  })
  .strict();

const BodySchema = z
  .object({
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).optional(),
    overload: z
      .object({
        enabled: z.boolean().optional(),
        maxEventLoopDelayMs: z.number().nullable().optional(),
        maxInFlight: z.number().nullable().optional(),
        maxHeapUsedFraction: z.number().nullable().optional(),
        retryAfterSeconds: z.number().optional(),
      })
      .strict()
      .optional(),
    pools: z.record(z.string(), PoolPatchSchema).optional(),
  })
  .strict();

async function applySettings(req: Request, res: Response) {
  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: 'Invalid settings', details: parsed.error.issues });
    return;
  }
  const patch = parsed.data;

  // Reject unknown pool names up-front, before applying any changes.
  // This prevents typos from silently being ignored and causing confusion.
  // alternatively we could hardcode the allowed pools in the schema, but
  // this way the endpoint doesn't need to change if we add new pools.
  if (patch.pools) {
    const known = new Set(getPoolNames());
    const unknown = Object.keys(patch.pools).filter(
      (p) => !known.has(p as PoolName),
    );
    if (unknown.length) {
      res.status(400).json({
        error: `Unknown pool(s): ${unknown.join(', ')}`,
        knownPools: [...known],
      });
      return;
    }
  }

  const before = currentSettings();
  try {
    if (patch.logLevel) setLogLevel(patch.logLevel);
    if (patch.overload) setOverloadSettings(patch.overload);
    if (patch.pools) {
      Object.entries(patch.pools).forEach(([pool, poolPatch]) => {
        setPoolSettings(pool as PoolName, poolPatch);
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('admin runtime settings update failed', { error: message });
    res.status(400).json({ error: message });
    return;
  }

  const after = currentSettings();
  // Audit trail: who changed what. warn level so it survives the default
  // production log level.
  logger.warn('admin runtime settings changed', {
    actor: get(req, 'adminUser.userName'),
    requested: patch,
    before,
    after,
  });

  res.json({ settings: after });
}

export default function adminController(app: Express) {
  // Current effective values (for the dashboard to render before editing).
  app.get('/admin/settings', requireAdmin, (req: Request, res: Response) => {
    res.json({ settings: currentSettings() });
  });

  // Apply a partial update to this instance.
  app.post('/admin/settings', requireAdmin, applySettings);
}
