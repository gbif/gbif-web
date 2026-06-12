const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../logger');
const {
  getQueueNames,
  getQueueLimits,
  setQueueLimits,
  getShedSettings,
  setShedSettings,
} = require('../health/metrics');

/**
 * Runtime admin endpoint for the es-api.
 *
 * Exposes the settings that are safe to change without a redeploy — log level,
 * per-queue concurrency / max queue size, and the occurrence priority-shedding
 * config — and lets an authorised user adjust them live. Changes are in-memory
 * and ephemeral (reset on restart); this is for incident response / tuning.
 *
 * Authorisation reuses the GraphQL JWT: gbif-org mints a short-lived token for
 * the logged-in user (signed with the shared GraphQL JWT secret) and forwards
 * it here as a Bearer token. We verify the signature with that same secret and
 * read the user from the verified claims (userName + roles, which gbif-org
 * embeds). The user must be on the configured allowlist (`adminUsers`). The endpoint is fail-closed until
 * explicitly opened per environment.
 *
 * Config (.env): `graphqlJwtSecret`, `adminUsers`.
 */

const adminUsers = Array.isArray(config.adminUsers) ? config.adminUsers : [];
const secret = config.graphqlJwtSecret;

// Verify the Bearer GraphQL JWT. Returns { user } on success, otherwise
// { error } describing why (for server-side logging — never sent to the client).
function resolveUser(authorization) {
  if (typeof authorization !== 'string' || authorization === '') {
    return { error: 'no Authorization header' };
  }
  const [type, value] = authorization.split(' ');
  if (type !== 'Bearer' || !value) {
    return { error: 'Authorization header is not a Bearer token' };
  }
  if (!secret) {
    return { error: 'graphqlJwtSecret is not configured on this es-api instance' };
  }
  try {
    const decoded = jwt.verify(value, secret, { algorithms: ['HS256'] });
    let roles = [];
    if (Array.isArray(decoded.roles)) {
      roles = decoded.roles;
    } else if (typeof decoded.roles === 'string') {
      // gbif-org embeds roles as a JSON string.
      try {
        roles = JSON.parse(decoded.roles);
      } catch (e) {
        roles = [];
      }
    }
    return { user: { userName: decoded.userName, roles } };
  } catch (err) {
    return { error: `token verification failed: ${err.message}` };
  }
}

function isAuthorised(user) {
  if (!user || !user.userName) return false;
  if (adminUsers.includes(user.userName)) return true;
  return false;
}

function requireAdmin(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  const { user, error } = resolveUser(req.headers.authorization || req.headers.Authorization);
  if (!isAuthorised(user)) {
    // Log the precise reason so a 403 is debuggable; the response stays generic.
    logger.warn('admin endpoint rejected request', {
      reason: error || `user '${user && user.userName}' is not in adminUsers allowlist`,
      userName: user && user.userName,
      adminUsersConfigured: adminUsers.length,
      secretConfigured: !!secret,
    });
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  req.adminUser = user;
  next();
}

function currentSettings() {
  return {
    logLevel: logger.getLogLevel(),
    queues: getQueueLimits(),
    shedding: getShedSettings(),
  };
}

function applySettings(req, res) {
  const body = req.body || {};
  const before = currentSettings();
  try {
    if (typeof body.logLevel !== 'undefined') logger.setLogLevel(body.logLevel);

    if (body.queues && typeof body.queues === 'object') {
      // Validate queue names before applying any changes.
      const known = new Set(getQueueNames());
      const unknown = Object.keys(body.queues).filter((q) => !known.has(q));
      if (unknown.length) {
        res
          .status(400)
          .json({ error: `Unknown queue(s): ${unknown.join(', ')}`, knownQueues: [...known] });
        return;
      }
      // Apply patches (partial updates) to the specified queues.
      Object.entries(body.queues).forEach(([name, patch]) => {
        setQueueLimits(name, patch || {});
      });
    }

    if (body.shedding && typeof body.shedding === 'object') {
      Object.entries(body.shedding).forEach(([name, patch]) => {
        setShedSettings(name, patch || {});
      });
    }
  } catch (err) {
    logger.error('admin runtime settings update failed', { error: err.message });
    res.status(400).json({ error: err.message });
    return;
  }

  const after = currentSettings();
  // Audit trail: who changed what (warn so it survives the default log level).
  logger.warn('admin runtime settings changed', {
    actor: req.adminUser && req.adminUser.userName,
    requested: body,
    before,
    after,
  });

  res.json({ settings: after });
}

module.exports = function adminController(app) {
  app.get('/admin/settings', requireAdmin, (req, res) => {
    res.json({ settings: currentSettings() });
  });
  app.post('/admin/settings', requireAdmin, applySettings);
};
