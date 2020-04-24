
const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');
const varnishIndexName = config.ELK_VARNISH_INDEX;

const nonsenseSearch = testRunner({
  endpoint: `https://${config.API_V1}/occurrence/search?basisOfRecord=NONSENSE&cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(400)
});

const search = testRunner({
  endpoint: `https://${config.API_V1}/occurrence/search?cachebust={{NOW}}&q={{RANDOM_WORD}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(20000, severity.degraded_performance)
    .hasMaxResponseTime(40000, severity.partial_outage)
});

const key = testRunner({
  endpoint: `https://${config.API_V1}/occurrence/${config.OCCURRENCEKEY}?cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(5000)
});

const logs = testRunner({
  endpoint: `${config.PRIVATE_KIBANA}/elasticsearch/${varnishIndexName}/_search?q=response:>499%20AND%20request:("//api.gbif.org/v1/occurrence/search*")%20AND%20@timestamp:>{{SECONDS_AGO}}`,
  timeoutMilliSeconds: 300,
  expect: response => response
    .hasStatusCode(200, severity.operational)
    .hasNumberBelow({path: 'hits.total', threshold: 100}, severity.degraded_performance)
});

const tests = [
  nonsenseSearch,
  search,
  key,
  logs
];

module.exports = componentRunner(tests)