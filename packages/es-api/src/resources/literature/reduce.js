const _ = require('lodash');

// function removeUndefined(obj) {
//   for (let k in obj) if (obj[k] === undefined) delete obj[k];
//   return obj;
// }

const whitelist = [
  'createdAt',
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

//api v1
// ['discovered', 'authors', 'countriesOfCoverage', 'countriesOfResearcher', 'added', 'published', 'day', 'gbifDownloadKey', 'gbifOccurrenceKey', 'gbifTaxonKey', 'gbifHigherTaxonKey', 'citationType', 'gbifRegion', 'id', 'identifiers', 'keywords', 'language', 'literatureType', 'month', 'notes', 'openAccess', 'peerReview', 'publisher', 'relevance', 'source', 'tags', 'title', 'topics', 'modified', 'websites', 'year', 'abstract'];

//es
// ['title', 'authors', 'year', 'source', 'keywords', 'pages', 'volume', 'websites', 'id', 'created', 'tags', 'read', 'starred', 'authored', 'confirmed', 'hidden', 'abstract', 'fileAttached', 'profileId', 'updatedAt', 'citationKey', 'sourceType', 'privatePublication', 'literatureType', 'searchable', 'createdAt', 'countriesOfResearcher', 'countriesOfCoverage', 'gbifRegion', 'gbifDatasetKey', 'publishingOrganizationKey', 'relevance', 'topics', 'gbifDownloadKey', 'gbifDerivedDatasetDoi', 'gbifTaxonKey', 'gbifHigherTaxonKey', 'gbifOccurrenceKey', 'gbifFeatureId', 'peerReview', 'openAccess', 'contentType', 'identifiers', 'month', 'publisher', 'day', 'accessed', 'language', 'country', 'notes', 'userContext', 'citationType', 'issue', 'editors', 'code', 'city', 'institution', 'department', 'shortTitle']
// new
// ['discovered', 'added', 'published', 'modified']
// which corresponds to what`?, created, ?, updatedAt

/**
 * Map ES response to something similar to v1
 */
function reduce(item) {
  const source = item._source;
  const pruned = _.pick(item._source, whitelist);

  // rename
  pruned.discovered = source.accessed;
  pruned.added = source.created;
  return pruned;
}

module.exports = {
  reduce,
};
