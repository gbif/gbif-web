import logger from '../../config/logger.mjs';
import { secretEnv } from '../../envConfig.mjs';
import { appendUser, generateGraphQLToken } from '../auth/utils.mjs';

/**
 * Backstage admin API (server side).
 *
 * The GraphQL API runs as several instances behind the load balancer. To
 * monitor and tune them we must address each instance directly, which the
 * shared (load-balanced) URL cannot do. So the list of instance base URLs is
 * configured here on the server (env `ADMIN_GRAPHQL_NODES`) and we fan requests
 * out to every instance, returning a per-instance result.
 *
 * The browser never sees the instance list or talks to the instances directly:
 * it calls these `/api/admin/*` endpoints, which run server-side over the
 * internal network. That keeps the instances' admin endpoints internal-only.
 *
 * The es-api instances are listed separately in `ADMIN_ES_API_NODES`.
 *
 * Authorisation: the caller must be a logged-in user (cookie JWT) who is on the
 * `ADMIN_USERS` allowlist.
 * Anyone else gets a 404 so the whole admin surface stays invisible. Writes are
 * signed to each instance with a freshly minted GraphQL JWT for the user.
 */

// Per-instance request timeout for the fan-out. Health is cheap; keep it short
// so one unreachable instance does not hold up the whole dashboard.
const NODE_TIMEOUT_MS = 8000;

function parseList(value) {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const ADMIN_USERS = parseList(secretEnv.ADMIN_USERS);

// Parse a comma-separated list of base URLs into { url, label } entries; the
// label shown in the UI is derived from the host. Potentially this could be some
// automated discovery later, but for now it is plain config.
function parseNodes(value) {
  return parseList(value).map((url) => {
    let label = url;
    try {
      label = new URL(url).host;
    } catch {
      // keep the raw string as the label if it is not a valid URL
    }
    return { url: url.replace(/\/$/, ''), label };
  });
}

// The GraphQL instances to manage (read + write).
function getNodes() {
  return parseNodes(secretEnv.ADMIN_GRAPHQL_NODES);
}

// The es-api instances to monitor. Different /health shape, no
// runtime settings exposed (yet), so this is monitoring only.
function getEsNodes() {
  return parseNodes(secretEnv.ADMIN_ES_API_NODES);
}

function isAuthorisedAdmin(user) {
  if (!user || !user.email || !Array.isArray(user.roles)) return false;
  // Users email must be included in ADMIN_USERS
  if (!ADMIN_USERS.includes(user.email)) return false;
  // Must have an gbif.org email
  if (!user.email.endsWith('@gbif.org')) return false;
  // Must be gbif registry admin
  if (!user.roles?.includes('REGISTRY_ADMIN')) return false;
  return true;
}

// 404 (not 403) for anyone not authorised. Runs after `appendUser`, which attaches
// `req.user` when a valid session cookie is present.
function requireAdmin(req, res, next) {
  if (!isAuthorisedAdmin(req.user)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  next();
}

async function fetchNodeJson(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'GBIF-portal',
      ...options?.headers,
    },
    signal: AbortSignal.timeout(NODE_TIMEOUT_MS),
  });
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, ok: response.ok, body };
}

// Run `perNode(node)` against every given instance, never rejecting: a failing
// instance becomes an `{ ok: false, error }` entry so one bad instance does not
// blank out the whole dashboard.
async function fanOut(nodes, perNode) {
  return Promise.all(
    nodes.map(async (node) => {
      try {
        const result = await perNode(node);
        return { node: node.label, url: node.url, ...result };
      } catch (err) {
        return {
          node: node.label,
          url: node.url,
          ok: false,
          error: err?.message ?? String(err),
        };
      }
    })
  );
}

export function register(app) {
  // Cheap auth probe for the UI gate: 200 if the caller passes the full admin
  // check, 404 otherwise (via requireAdmin). No fan-out, no data. The backstage
  // route loader hits this so non-admins get the standard 404 page instead of
  // the (empty) dashboard shell.
  app.get('/api/admin/me', appendUser, requireAdmin, (req, res) => {
    res.json({ ok: true });
  });

  // List the instances under management (so the UI can render one column each).
  app.get('/api/admin/nodes', appendUser, requireAdmin, (req, res) => {
    res.json({ nodes: getNodes().map(({ label, url }) => ({ label, url })) });
  });

  // Read: each instance's /health, per instance.
  app.get('/api/admin/health', appendUser, requireAdmin, async (req, res) => {
    const results = await fanOut(getNodes(), async (node) => {
      const { status, ok, body } = await fetchNodeJson(`${node.url}/health`);
      return ok ? { ok: true, status, health: body } : { ok: false, status, error: body };
    });
    res.json({ results });
  });

  // Read: each es-api instance's /health
  app.get('/api/admin/es-health', appendUser, requireAdmin, async (req, res) => {
    const results = await fanOut(getEsNodes(), async (node) => {
      const { status, ok, body } = await fetchNodeJson(`${node.url}/health`);
      return ok ? { ok: true, status, health: body } : { ok: false, status, error: body };
    });
    res.json({ results });
  });

  // Read: each es-api instance's current editable settings (auth: the es-api
  // validates the same GraphQL JWT we mint here).
  app.get('/api/admin/es-settings', appendUser, requireAdmin, async (req, res) => {
    const token = generateGraphQLToken(req.user);
    const results = await fanOut(getEsNodes(), async (node) => {
      const { status, ok, body } = await fetchNodeJson(`${node.url}/admin/settings`, {
        headers: { authorization: `Bearer ${token}` },
      });
      return ok
        ? { ok: true, status, settings: body?.settings ?? body }
        : { ok: false, status, error: body };
    });
    res.json({ results });
  });

  // Write: apply a settings patch to the targeted es-api instances (default all).
  // Body: { settings: {...}, targets?: string[] (instance urls) }
  app.post('/api/admin/es-settings', appendUser, requireAdmin, async (req, res) => {
    const { settings, targets } = req.body ?? {};
    if (!settings || typeof settings !== 'object') {
      res.status(400).json({ error: 'Missing "settings" object in body' });
      return;
    }
    const token = generateGraphQLToken(req.user);
    const targetSet = Array.isArray(targets) && targets.length ? new Set(targets) : null;

    const results = await fanOut(getEsNodes(), async (node) => {
      if (targetSet && !targetSet.has(node.url)) {
        return { ok: true, skipped: true };
      }
      const { status, ok, body } = await fetchNodeJson(`${node.url}/admin/settings`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      return ok
        ? { ok: true, status, settings: body?.settings ?? body }
        : { ok: false, status, error: body };
    });

    logger.info('admin settings change to es-api instances', {
      actor: req.user?.userName,
      targets: targetSet ? [...targetSet] : 'all',
      settings,
    });

    res.json({ results });
  });

  // Read: each instance's current editable settings.
  app.get('/api/admin/settings', appendUser, requireAdmin, async (req, res) => {
    const token = generateGraphQLToken(req.user);
    const results = await fanOut(getNodes(), async (node) => {
      const { status, ok, body } = await fetchNodeJson(`${node.url}/admin/settings`, {
        headers: { authorization: `Bearer ${token}` },
      });
      return ok
        ? { ok: true, status, settings: body?.settings ?? body }
        : { ok: false, status, error: body };
    });
    res.json({ results });
  });

  // Write: apply a settings patch to the targeted instances (default: all).
  // Body: { settings: {...}, targets?: string[] (instance urls) }
  app.post('/api/admin/settings', appendUser, requireAdmin, async (req, res) => {
    const { settings, targets } = req.body ?? {};
    if (!settings || typeof settings !== 'object') {
      res.status(400).json({ error: 'Missing "settings" object in body' });
      return;
    }
    const token = generateGraphQLToken(req.user);
    const targetSet = Array.isArray(targets) && targets.length ? new Set(targets) : null;

    const results = await fanOut(getNodes(), async (node) => {
      if (targetSet && !targetSet.has(node.url)) {
        return { ok: true, skipped: true };
      }
      const { status, ok, body } = await fetchNodeJson(`${node.url}/admin/settings`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      return ok
        ? { ok: true, status, settings: body?.settings ?? body }
        : { ok: false, status, error: body };
    });

    // Audit trail on the gbif-org server too, so "who changed the settings" is
    // visible
    logger.info('admin settings change to graphql instances', {
      actor: req.user?.userName,
      targets: targetSet ? [...targetSet] : 'all',
      settings,
    });

    res.json({ results });
  });
}
