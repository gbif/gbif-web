class ResponseError extends Error {
  constructor(statusCode, displayName, message) {
    super();
    this.statusCode = statusCode;
    this.displayName = displayName;
    this.message = message;
  }
}

module.exports = {
  ResponseError
}