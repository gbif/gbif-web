/**
 * Given an ES endpoint, then try to extract a sensible configuration given its mappings.
 * It is not intended to be used blindly, but as a starting point.
 */
const got = require('got');
const _ = require('lodash');
const config = require('../config');
const LITERATURE_ES_INDEX = config.LITERATURE_ES_INDEX;

async function suggestConfig(esIndexEndpoint) {
  // extract the mapping data
  const response = await got.get('_mapping', {
    prefixUrl: LITERATURE_ES_INDEX,
    responseType: 'json'
  });
  const result = response.body;
  const mappings = result[Object.keys(result)[0]].mappings.literature;

  //process them
  const fieldConfigs = Object.keys(mappings.properties).map(field => {
    const fieldConfig = mappings.properties[field];
    switch(fieldConfig.type) {
      case 'text': return {
        field,
        filterType: 'match',
        isScored: true,
        arraysForbidden: true,
        normalize: 'asString'
      }
      case 'date': return {
        field,
        filterType: 'range_or_term',
        interpretArraysAsBoolShould: true,
        normalize: 'range_or_term',
        get: {
          type: 'range_or_term',
          defaultUpperBound: 'gte',
          defaultLowerBound: 'lte'
        }
      }
      case 'integer': return {
        field,
        filterType: 'range_or_term',
        interpretArraysAsBoolShould: true,
        normalize: 'range_or_term',
        get: {
          type: 'range_or_term',
          defaultUpperBound: 'gte',
          defaultLowerBound: 'lte'
        }
      }
      case 'keyword': return {
        field,
        filterType: 'term_s'
      }
      default: return {
        field,
        discarded: true
      }
    }
  });

  const queryAll = {
    filterType: 'match',
    field: '_all',
    isScored: true,
    arraysForbidden: true,
    normalize: 'asString'
  };

  const config = _.keyBy(fieldConfigs.filter(x => !x.discarded), 'field');
  config.q = queryAll;
  console.log(JSON.stringify(config, null, 2));
}

suggestConfig(LITERATURE_ES_INDEX);