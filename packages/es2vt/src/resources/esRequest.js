const { ResponseError } = require('./errorHandler');

async function searchMvt({ client, index, body, field, x, y, z }) {
  try {
    const tile = await client.searchMvt({
      index: index,
      body,
      field: field,
      zoom: parseInt(z),
      x: parseInt(x),
      y: parseInt(y),
      track_total_hits: false,
      size: 0
    });
    return tile;

  } catch (err) {
    console.log(err);
    debugger;
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
  searchMvt
};