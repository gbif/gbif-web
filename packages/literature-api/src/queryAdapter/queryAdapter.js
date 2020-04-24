/*
Map queries to Elastic search
*/
const _ = require('lodash');

function transformQuery(query = [], config, log) {
  if (log) {
    console.log('query');
    console.log(JSON.stringify(query, null, 2));
    console.log('config');
    console.log(JSON.stringify(config, null, 2));
  }
  const filter = query
    .map(x => {
      const conf = config[x.field];

      // if an array and that should be interpreted as a nested bool of type should
      if (conf.interpretArraysAsBoolShould && Array.isArray(x.value)) {
        const boolShouldQuery = x.value.map(e => ({ field: x.field, value: e }));
        return {
          bool: {
            should: transformQuery(boolShouldQuery, config)
          }
        }
      }

      let value = conf.normalize ? conf.normalize(x.value, conf) : x.value;

      //if nested type, then get the nested query by recursion
      if (conf.nestedPath) {
        // console.log(JSON.stringify(value, null, 2));
        const nestedQuery = Object.keys(value).map(k => ({
          field: k,
          value: value[k]
        }));
        // console.log(JSON.stringify(nestedQuery, null, 2));
        return {
          nested: {
            path: conf.nestedPath,
            query: {
              bool: {
                filter: transformQuery(nestedQuery, conf.config)
              }
            }
          }
        }
      }

      const filterType = conf.filterType;
      if (filterType) {
        return filterType(value, conf);
      } else {
        throw new Error(`Unknown filter type for ${x.field}`)
      }
    });
  return filter;
}

function createQueryParts(query = [], config = {}) {
  // format the query as an array
  const queryList = normalizeQuery(query);

  // Split into those that have a config and those without
  const [hasConfig, noConfig] = _.partition(queryList, x => config[x.field]);

  // For those with conflicts, split fields that require scoring (must) and simple filters
  const [mustQuery, filterQuery] = _.partition(hasConfig, x => config[x.field].isScored);
  // for those without config, 
  // check if it is a negated query and we have a config for that
  // and that negation is allowed on the field
  const mustNotQuery = noConfig
    .map(x => ({
      ...x,
      field: x.field.startsWith('!') ? x.field.substr(1) : x.field
    })).filter(x => config[x.field] && config[x.field].supportsNegation);

  // console.log(mustQuery);
  // console.log(mustNotQuery);
  const must = transformQuery(mustQuery, config);
  const filter = transformQuery(filterQuery, config);
  const must_not = transformQuery(mustNotQuery, config);
  return { must, filter, must_not };
}

function createQuery({ query, preQuery, config }) {
  const mainQueryParts = createQueryParts(query, config);
  const baseQueryParts = preQuery ? createQueryParts(preQuery, config) : {};

  //a base query is not allowed anything but filters and must_not
  if (baseQueryParts.must && baseQueryParts.must.length > 0) throw new Error(`You base query (defaultQuery, preQuery) must be field filters only. No free text scoring.`);

  const boolQuery = {
    bool: {
      must: _.get(mainQueryParts, 'must', []),
      filter: _.concat(_.get(mainQueryParts, 'filter', []), _.get(baseQueryParts, 'filter', [])),
      must_not: _.concat(_.get(mainQueryParts, 'must_not', []), _.get(baseQueryParts, 'must_not', [])),
    }
  }
  return boolQuery;
}

/**
 * Normalize the query into an array
 * @param {Array|Object} query 
 */
function normalizeQuery(query = []) {
  if (_.isArray(query)) {
    // TODO perhaps we should validate the format here as well
    return query;
  } else if (_.isObjectLike(query)) {
    return Object.keys(query).sort().map(field => {
      return {
        field: field,
        value: query[field]
      }
    });
  } else {
    throw new Error('The query must be either an array or an object');
  }
}

module.exports = {
  createQuery,
  createQueryParts,
  transformQuery
};