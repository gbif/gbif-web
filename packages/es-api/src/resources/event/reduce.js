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

  // Additional event verbatim fields
  const eventVerbatim = removeUndefined({
    eventRemarks: source.verbatim.core['http://rs.tdwg.org/dwc/terms/eventRemarks'],
  });

  return removeUndefined({
    ...source.event,
    // eventDate: source.event.eventDateSingle,
    // eventDateSingle: undefined,
    eventDate:
      source.event.eventDateInterval ??
      (source.event.eventDateSingle ? source.event.eventDateSingle.substring(0, 10) : undefined),
    ...source.metadata,
    ...source.derivedMetadata,
    ...eventVerbatim,
    extensions: source.verbatim.extensions,
  });
}

module.exports = {
  reduce,
};
