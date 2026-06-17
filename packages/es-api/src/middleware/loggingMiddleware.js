const logger = require('../logger');

function loggingMiddleware(req, res, next) {
  const startTime = process.hrtime();

  // Keep track of wether the request has been logged as an error
  req.loggedAsError = false;

  res.on('finish', () => {
    // Don't log if the request has been logged as an error
    if (req.loggedAsError) return;

    const date = new Date();

    const executionTime = process.hrtime(startTime);
    const elapsedMilliseconds = (executionTime[0] * 1e9 + executionTime[1]) / 1e6;

    // Per-request log fields, set on req by the middleware in index.js.
    const { requestId, siteUrl } = req.logContext || {};

    logger.info({
      message: 'ES-API Request',
      ...(requestId ? { requestId } : {}),
      ...(siteUrl ? { siteUrl } : {}),
      durationMs: Math.round(elapsedMilliseconds),
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
  });

  next();
}

module.exports = loggingMiddleware;
