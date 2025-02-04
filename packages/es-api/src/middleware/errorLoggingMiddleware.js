const logger = require('../logger');

function errorLoggingMiddleware(error, req, res, next) {
  // Mark that the error has been logged so that the logging middleware doesn't log it again
  req.loggedAsError = true;

  const date = new Date();

  logger.error({
    message: 'ES-API Error',
    error,
    time: date.toISOString(),
    timeInCopenhagen: date.toLocaleString('en-GB', { timeZone: 'Europe/Copenhagen' }),
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
}

module.exports = errorLoggingMiddleware;
