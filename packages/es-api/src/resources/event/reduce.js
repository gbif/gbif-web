const _ = require('lodash');

function removeUndefined(obj) {
  for (let k in obj) if (obj[k] === undefined) delete obj[k];
  return obj;
}

/**
 * Map ES response to something similar to v1
 */
function reduce(item) {
  const source = item._source;
  const event = {...source.event, ...source.metadata, ...source.derivedMetadata};
  return removeUndefined(event);
}

module.exports = {
  reduce
}