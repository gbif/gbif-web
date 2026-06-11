const loggingMiddleware = require('./loggingMiddleware');
const errorLoggingMiddleware = require('./errorLoggingMiddleware');
const admissionGate = require('./admissionGate');

module.exports = {
  loggingMiddleware,
  errorLoggingMiddleware,
  admissionGate,
};
