// avg request time for occurrence
// avg request time for species
// avg request time for other
// total number of requests per interval (sum)

const _ = require('lodash');
const { runMetrics } = require('./runMetrics');
const config = require('../config');
const metricID = config.METRIC_OCCURRENCE_SEARCH_API;
const esUrl = `${config.PRIVATE_KIBANA}/${config.ELK_VARNISH_INDEX}/_search`;
// const endpointPrefix = 'http://';

const query = {
  "size": 0,
  "query": {
      "bool": {
          "filter": [
              {
                  "query_string": {
                      "default_field": "request",
                      "query": `\"${config.API_V1}/occurrence/search\"`
                  }
              },
              {
                  "range": {
                      "@timestamp": {
                          "gte": "now-2m",
                          "lt": "now"
                      }
                  }
              }
          ]
      }
  },
  "aggs": {
    "metrics": {
      "avg": {
        "field": "duration"
      }
    }
  }
};

const getValue = body => {
  const value = _.get(body, 'aggregations.metrics.value');
  if (value) return Math.round(value / 1000);// duration is in microseconds
};

module.exports = runMetrics(esUrl, query, metricID, getValue);