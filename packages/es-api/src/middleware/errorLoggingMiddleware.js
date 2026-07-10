const logger = require('../logger');

function errorLoggingMiddleware(error, req, res, next) {
  // Mark that the error has been logged so that the logging middleware doesn't log it again
  req.loggedAsError = true;

  const date = new Date();

  // Per-request log fields, set on req by the middleware in index.js.
  const { requestId, siteUrl } = req.logContext || {};

  logger.error({
    message: error.message ?? 'ES-API Error',
    ...(requestId ? { requestId } : {}),
    ...(siteUrl ? { siteUrl } : {}),
    errors: [error],
    request: {
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl,
      ip: req.ip,
      referrer: req.get('Referrer'),
      userAgent: req.get('User-Agent'),
      body: req.body,
    },
    response: {
      statusCode: res.statusCode,
      cacheControl: res.get('Cache-Control'),
      body: res.body,
    },
  });
}

module.exports = errorLoggingMiddleware;
