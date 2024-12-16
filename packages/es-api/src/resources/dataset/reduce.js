const _ = require('lodash');

const whitelist = [
  'key',
  'title',
  'type',
  'subtype',
  'publishingOrganizationKey',
  'publishingOrganizationTitle',
  'abbreviation',
  'additionalInfo',
  'alias',
  // 'all',
  'citation',
  'city',
  'collectionKey',
  'continent',
  'country',
  'countryCoverage',
  'created',
  'createdBy',
  'dataDescriptions',
  'dataLanguage',
  // 'dataScore',
  'decade',
  'deleted',
  'description',
  'doi',
  'duplicateOfDatasetKey',
  // 'external',
  'geographicCoverages',
  // 'gridDerivedMetadata',
  'homepage',
  'hostingOrganizationKey',
  'hostingOrganizationTitle',
  // 'hostingOrganizationTitleAutocomplete',
  'installationKey',
  'installationTitle',
  // 'installationTitleAutocomplete',
  'institutionKey',
  'keyword',
  'keywordCollections',
  'language',
  'license',
  'lockedForAutoUpdate',
  'logoUrl',
  'maintenanceDescription',
  'maintenanceUpdateFrequency',
  // 'metadata',
  'modified',
  'modifiedBy',
  // 'nameUsagesCount',
  // 'nameUsagesPercentage',
  'numConstituents',
  // 'occurrenceCount',
  // 'occurrencePercentage',
  'parentDatasetKey',
  'postalCode',
  'programmeAcronym',
  'project',
  'projectId',
  'province',
  'pubDate',
  'publishingCountry',
  // 'publishingOrganizationTitleAutocomplete',
  'purpose',
  'rights',
  'samplingDescription',
  // 'taxonKey',
  // 'titleAutocomplete',
  'version',
  'year',
  'taxonomicCoverages',
  'temporalCoverages',
  'collections',
  'contacts',
  'bibliographicCitations',
  'machineTags',
  'tags',
  // 'comments',
  'endpoints',
  'identifiers',
];

function removeUndefined(obj) {
  for (let k in obj) if (typeof obj[k] === 'undefined' || obj[k] === null) delete obj[k];
  return obj;
}

function formatDates(source, fields) {
  fields = fields || ['created', 'modified'];
  return {
    ...source,
    ...fields.reduce((map, field) => {
      if (source[field]) {
        map[field] = new Date(source[field]).toISOString();
      }
      return map;
    }, {}),
  };
}

/**
 * Map ES response to something similar to v1
 */
function reduce(item) {
  const source = removeUndefined(_.pick(item._source, whitelist));
  const sourceWithDates = {
    ...source,
    ...formatDates(source, ['pubDate', 'created', 'modified']),
    endpoints: source.endpoints.map((x) => removeUndefined(formatDates(x))),
    machineTags: source.endpoints.map((x) => removeUndefined(formatDates(x))),
    identifiers: source.endpoints.map((x) => removeUndefined(formatDates(x))),
    tags: source.endpoints.map((x) => removeUndefined(formatDates(x))),
    contacts: source.contacts.map((x) => removeUndefined(formatDates(x))),
    temporalCoverages: source.temporalCoverages.map((x) =>
      removeUndefined(formatDates(x, ['end', 'start', 'date'])),
    ),
  };

  return sourceWithDates;
}

module.exports = {
  reduce,
};
