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

    logger.info({
      message: 'ES-API Request',
      time: date.toISOString(),
      timeInCopenhagen: date.toLocaleString('en-GB', { timeZone: 'Europe/Copenhagen' }),
      executionTimeMs: Math.round(elapsedMilliseconds),
      request: {
        headers: req.headers,
        body: req.body,
        method: req.method,
        url: req.url,
      },
      response: {
        statusCode: res.statusCode,
        headers: res.headers,
        body: res.body,
      },
    });
  });

  next();
}

module.exports = loggingMiddleware;
