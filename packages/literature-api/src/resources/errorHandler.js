class ResponseError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

function errorHandler(err, req, res) {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message
  });
}

function unknownRouteHandler(req, res) {
  res.status(404).json({
    status: "error",
    statusCode: 404
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