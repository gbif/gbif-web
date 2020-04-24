const _ = require('lodash');
const { filterTypes, normalizer } = require('../../queryAdapter');

const config = {
  "abstract": {
    "field": "abstract",
    "filterType": "match",
    "isScored": true,
    "arraysForbidden": true,
    "normalize": "asString"
  },
  "accessed": {
    "field": "accessed",
    "filterType": "range_or_term",
    "interpretArraysAsBoolShould": true,
    "normalize": "range_or_term",
    "get": {
      "type": "range_or_term",
      "defaultUpperBound": "gte",
      "defaultLowerBound": "lte"
    }
  },
  "chapter": {
    "field": "chapter",
    "filterType": "term_s"
  },
  "citationKey": {
    "field": "citationKey",
    "filterType": "term_s"
  },
  "city": {
    "field": "city",
    "filterType": "term_s"
  },
  "code": {
    "field": "code",
    "filterType": "term_s"
  },
  "contentType": {
    "field": "contentType",
    "filterType": "term_s"
  },
  "countriesOfCoverage": {
    "field": "countriesOfCoverage",
    "filterType": "term_s"
  },
  "countriesOfResearcher": {
    "field": "countriesOfResearcher",
    "filterType": "term_s"
  },
  "country": {
    "field": "country",
    "filterType": "term_s"
  },
  "created": {
    "field": "created",
    "filterType": "range_or_term",
    "interpretArraysAsBoolShould": true,
    "normalize": "range_or_term",
    "get": {
      "type": "range_or_term",
      "defaultUpperBound": "gte",
      "defaultLowerBound": "lte"
    }
  },
  "createdAt": {
    "field": "createdAt",
    "filterType": "range_or_term",
    "interpretArraysAsBoolShould": true,
    "normalize": "range_or_term",
    "get": {
      "type": "range_or_term",
      "defaultUpperBound": "gte",
      "defaultLowerBound": "lte"
    }
  },
  "day": {
    "field": "day",
    "filterType": "range_or_term",
    "interpretArraysAsBoolShould": true,
    "normalize": "range_or_term",
    "get": {
      "type": "range_or_term",
      "defaultUpperBound": "gte",
      "defaultLowerBound": "lte"
    }
  },
  "department": {
    "field": "department",
    "filterType": "term_s"
  },
  "edition": {
    "field": "edition",
    "filterType": "term_s"
  },
  "gbifDatasetKey": {
    "field": "gbifDatasetKey",
    "filterType": "term_s"
  },
  "gbifDownloadKey": {
    "field": "gbifDownloadKey",
    "filterType": "term_s"
  },
  "gbifRegion": {
    "field": "gbifRegion",
    "filterType": "term_s"
  },
  "genre": {
    "field": "genre",
    "filterType": "term_s"
  },
  "groupId": {
    "field": "groupId",
    "filterType": "term_s"
  },
  "id": {
    "field": "id",
    "filterType": "term_s"
  },
  "institution": {
    "field": "institution",
    "filterType": "term_s"
  },
  "issue": {
    "field": "issue",
    "filterType": "term_s"
  },
  "keywords": {
    "field": "keywords",
    "filterType": "term_s"
  },
  "language": {
    "field": "language",
    "filterType": "term_s"
  },
  "literatureType": {
    "field": "literatureType",
    "filterType": "term_s"
  },
  "medium": {
    "field": "medium",
    "filterType": "term_s"
  },
  "month": {
    "field": "month",
    "filterType": "range_or_term",
    "interpretArraysAsBoolShould": true,
    "normalize": "range_or_term",
    "get": {
      "type": "range_or_term",
      "defaultUpperBound": "gte",
      "defaultLowerBound": "lte"
    }
  },
  "notes": {
    "field": "notes",
    "filterType": "match",
    "isScored": true,
    "arraysForbidden": true,
    "normalize": "asString"
  },
  "pages": {
    "field": "pages",
    "filterType": "term_s"
  },
  "patentApplicationNumber": {
    "field": "patentApplicationNumber",
    "filterType": "term_s"
  },
  "patentLegalStatus": {
    "field": "patentLegalStatus",
    "filterType": "term_s"
  },
  "patentOwner": {
    "field": "patentOwner",
    "filterType": "term_s"
  },
  "profileId": {
    "field": "profileId",
    "filterType": "term_s"
  },
  "publisher": {
    "field": "publisher",
    "filterType": "term_s"
  },
  "publishingOrganizationKey": {
    "field": "publishingOrganizationKey",
    "filterType": "term_s"
  },
  "relevance": {
    "field": "relevance",
    "filterType": "term_s"
  },
  "reprintEdition": {
    "field": "reprintEdition",
    "filterType": "term_s"
  },
  "revision": {
    "field": "revision",
    "filterType": "term_s"
  },
  "series": {
    "field": "series",
    "filterType": "term_s"
  },
  "seriesEditor": {
    "field": "seriesEditor",
    "filterType": "term_s"
  },
  "shortTitle": {
    "field": "shortTitle",
    "filterType": "term_s"
  },
  "source": {
    "field": "source",
    "filterType": "term_s"
  },
  "sourceType": {
    "field": "sourceType",
    "filterType": "term_s"
  },
  "tags": {
    "field": "tags",
    "filterType": "term_s"
  },
  "title": {
    "field": "title",
    "filterType": "match",
    "isScored": true,
    "arraysForbidden": true,
    "normalize": "asString"
  },
  "topics": {
    "field": "topics",
    "filterType": "term_s"
  },
  "updatedAt": {
    "field": "updatedAt",
    "filterType": "range_or_term",
    "interpretArraysAsBoolShould": true,
    "normalize": "range_or_term",
    "get": {
      "type": "range_or_term",
      "defaultUpperBound": "gte",
      "defaultLowerBound": "lte"
    }
  },
  "userContext": {
    "field": "userContext",
    "filterType": "term_s"
  },
  "volume": {
    "field": "volume",
    "filterType": "term_s"
  },
  "websites": {
    "field": "websites",
    "filterType": "term_s"
  },
  "year": {
    "field": "year",
    "filterType": "range_or_term",
    "interpretArraysAsBoolShould": true,
    "normalize": "range_or_term",
    "get": {
      "type": "range_or_term",
      "defaultUpperBound": "gte",
      "defaultLowerBound": "lte"
    }
  },
  "q": {
    "filterType": "match",
    "field": "_all",
    "isScored": true,
    "arraysForbidden": true,
    "normalize": "asString"
  },

  author: {
    'filterType': filterTypes.term_s,
    'nestedPath': 'authors',
    'normalize': normalizer.asObject(['firstName', 'lastName']),
    'interpretArraysAsBoolShould': true,
    'config': {
      'firstName': {
        'filterType': filterTypes.term_s,
        'field': 'authors.firstName'
      },
      'lastName': {
        'filterType': filterTypes.term_s,
        'field': 'authors.lastName'
      }
    },
    'get': {
      'type': 'delimted',
      'delimter': '__',
      'nestedFields': ['firstName', 'lastName']
    }
  },

  editor: {
    'filterType': filterTypes.term_s,
    'nestedPath': 'editors',
    'normalize': normalizer.asObject(['firstName', 'lastName']),
    'interpretArraysAsBoolShould': true,
    'config': {
      'firstName': {
        'filterType': filterTypes.term_s,
        'field': 'editors.firstName'
      },
      'lastName': {
        'filterType': filterTypes.term_s,
        'field': 'editors.lastName'
      }
    },
    'get': {
      'type': 'delimted',
      'delimter': '__',
      'nestedFields': ['firstName', 'lastName']
    }
  },
};

function getParsedConfig(config) {
  const c = {};
  for (let [key, value] of Object.entries(config)) {
    if (typeof value.filterType === 'string' && !filterTypes[value.filterType]) throw new Error(`Unknown type of filter provided in config: ${value.type} for ${key}`);
    if (typeof value.normalize === 'string' && !normalizer[value.normalize]) throw new Error(`Unknown type of normalizer provided in config: ${value.normalize} for ${key}`);
    c[key] = {
      ...value,
      filterType: typeof value.filterType === 'string' ? filterTypes[value.filterType] : value.filterType,
      normalize: typeof value.normalize === 'string' ? normalizer[value.normalize] : value.normalize
    };
  }
  return c;
}

function getNormalizeConfig(config) {
  return _
  .chain(config)
  .pickBy(x => x.get)
  .mapValues(x => x.get)
  .value();
}

const parsedConfig = getParsedConfig(config);
const normalizeGetConfig = getNormalizeConfig(config);
console.log(normalizeGetConfig);

module.exports = {
  config,
  parsedConfig,
  normalizeGetConfig
}