const { AsyncLocalStorage } = require('async_hooks');

// Holds per-request fields (requestId, siteUrl) that logger.js stamps onto
// every log line. Opened per request by the middleware in index.js.
const requestContextStorage = new AsyncLocalStorage();

function getRequestLogContext() {
  return requestContextStorage.getStore();
}

module.exports = { requestContextStorage, getRequestLogContext };
