const { ResponseError } = require('./errorHandler');

async function search({ client, index, query, req }) {
  try {
    const request = client.search({
      index,
      body: query
    }, {
      headers: {
        'user-agent': 'gbif-web-map'
      }
    });

    req.on('close', function () {
      request.abort();
    });

    const response = await request;
    return response;
  } catch (err) {
    if (err.name === 'RequestAbortedError') {
      throw new ResponseError(204, 'RequestAbortedError', 'Request aborted');
    };
    debugger;
    console.log(err);
    if (err.meta && err.meta.statusCode) {
      // TODO log error
      throw new ResponseError(err.meta.statusCode || 503, err.displayName || err.name || 'backendFailure', err.message || 'Backend failure');
    } else {
      // TODO log error
      throw new ResponseError(503, err.displayName || 'networkError', 'Unable to connect');
    }
  }
}

module.exports = {
  search
};