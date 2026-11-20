import express from 'express';
import {
  CLIENT_ERROR_PATH,
  MAX_BODY_SIZE,
  clientAddress,
  createLimiter,
  fingerprint,
  isBot,
  isCrossSite,
  isNoise,
  parseReport,
  shortUserAgent,
} from './clientErrors.mjs';

// Must be registered before the app's general body parsers: they would otherwise parse the body
// first (with a 1 MB limit), and this route's smaller limit would never apply.
export function register(app, { logger, limiter = createLimiter() }) {
  app.post(
    CLIENT_ERROR_PATH,
    // sendBeacon sends text/plain, to avoid a CORS preflight; fetch sends application/json.
    express.json({ limit: MAX_BODY_SIZE, type: ['application/json', 'text/plain'] }),
    (req, res) => {
      res.set('Cache-Control', 'no-store');
      // This route runs before the app's other middleware; don't advertise the framework.
      res.removeHeader('X-Powered-By');
      if (isCrossSite(req)) return res.status(403).end();
      const report = parseReport(req.body);
      if (!report) return res.status(400).end();

      const userAgent = req.get('User-Agent');
      // Accepted but not logged: the browser has nothing useful to do with a refusal.
      if (isBot(userAgent) || isNoise(report)) return res.status(204).end();

      const id = fingerprint(report);
      const { allowed, droppedInLastWindow } = limiter.take(id, clientAddress(req));
      if (droppedInLastWindow) {
        logger.warn(`Dropped ${droppedInLastWindow} client error reports over the limit`, {
          clientErrorsDropped: droppedInLastWindow,
        });
      }
      if (!allowed) return res.status(204).end();

      const { commit, ...details } = report;
      logger.warn(`Client error: ${report.name}: ${report.message}`.slice(0, 300), {
        clientError: { ...details, fingerprint: id, userAgent: shortUserAgent(userAgent) },
        // Same name as graphql-api uses for the commit of the browser's build. The logger adds the
        // server's own as `commit`; they differ when a tab has been open across a deploy.
        clientCommit: commit,
      });
      res.status(204).end();
    },
    // Body too large or not JSON.
    // eslint-disable-next-line no-unused-vars
    (err, req, res, next) => {
      res.status(err.status >= 400 && err.status < 500 ? err.status : 400).end();
    }
  );
}
