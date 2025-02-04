const _ = require('lodash');

// function removeUndefined(obj) {
//   for (let k in obj) if (obj[k] === undefined) delete obj[k];
//   return obj;
// }

const includeList = [
  'authors',
  'countriesOfCoverage',
  'countriesOfResearcher',
  'day',
  'gbifDownloadKey',
  'gbifOccurrenceKey',
  'gbifTaxonKey',
  'gbifHigherTaxonKey',
  'citationType',
  'gbifRegion',
  'id',
  'identifiers',
  'keywords',
  'language',
  'literatureType',
  'month',
  'notes',
  'openAccess',
  'peerReview',
  'publisher',
  'relevance',
  'source',
  'tags',
  'title',
  'topics',
  'websites',
  'year',
  'abstract',
];

function reduce(item) {
  const source = item._source;
  return source;
  // return _.pick(item._source, includeList);
}

module.exports = {
  reduce,
};
