const { ResponseError } = require('./errorHandler');

async function search({ client, index, query }) {
  try {
    const response = await client.search({
      index,
      body: query,
      headers: {
        'user-agent': 'gbif-es-wrapper'
      }
    });
    return response;
  } catch (err) {
    if (!err.status) {
      // TODO log error
      throw new ResponseError(503, err.displayName || 'networkError', 'Unable to connect');
    } else {
      // TODO log error
      throw new ResponseError(err.status || 503, err.displayName || 'backendFailure', err.message || 'Backend failure');
    }
  }
}

module.exports = {
  search
};