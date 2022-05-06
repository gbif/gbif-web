class ResponseError extends Error {
  constructor(statusCode, displayName, message) {
    super();
    this.statusCode = statusCode;
    this.displayName = displayName;
    this.message = message;
  }
}

function errorHandler(err, req, res, next) {
  const { statusCode, message } = err;
  console.log(err);
  res.setHeader('Cache-Control', 'no-cache');
  res.status(statusCode || 503).json({
    statusCode: statusCode || 503,
    message
  });
}

function unknownRouteHandler(req, res) {
  res.status(404).json({
    statusCode: 404,
    message: 'Not found'
  });
}

function asyncMiddleware(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
}

module.exports = {
  ResponseError,
  errorHandler,
  asyncMiddleware,
  unknownRouteHandler
}