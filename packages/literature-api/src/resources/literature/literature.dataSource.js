const got = require('got');
const config = require('../../config');
const LITERATURE_ES_INDEX = config.LITERATURE_ES_INDEX;
// const _ = require('lodash');
// const pick = _.pick;
const queryConfig = require('./literature.config').parsedConfig;
const { createQuery } = require('../../queryAdapter');

function sanitize(item) {
  return item;
}

async function literatureQuery({ query }) {
  const boolQuery = createQuery({ query, config: queryConfig });
  
  const esQuery = {
    query: boolQuery
  }
  let body = await getData({url: '_search', query: esQuery});
  body = sanitize(body);
  body.hits.hits = body.hits.hits.map(n => sanitize(n._source));
  return {
    esBody: esQuery,
    ...body
  };
}

async function literatureKey({ key }) {
  let body = await getData({ canonicalPath: `directory/node/${key}` });
  return sanitize(body);
}

async function getData({url, query}) {
  try {
    const response = await got.post(url, {
      prefixUrl: LITERATURE_ES_INDEX,
      json: query,
      responseType: 'json'
    });
    return response.body;
  } catch(err) {
    console.log(err);
    console.log(err.response);
    console.log(err.response.message);
    return err.response.body;
  }
}

module.exports = {
  literatureQuery,
  literatureKey
};