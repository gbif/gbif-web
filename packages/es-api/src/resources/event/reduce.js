const _ = require('lodash');
const gadmLevels = [0,1,2,3,4,5];

const indexedExtraFields = [
  "collectionKey",
  "datasetPublishingCountry",
  "institutionKey",
];

function removeUndefined(obj) {
  for (let k in obj) if (obj[k] === undefined) delete obj[k];
  return obj;
}

/**
 * Map ES response to something similar to v1
 */
function reduce(item) {
  const source = item._source;
  const event = {...source.event, ...source.metadata};
  return removeUndefined(event);
}

module.exports = {
  reduce
}