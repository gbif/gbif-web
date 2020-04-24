
const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');

const search = testRunner({
  endpoint: `https://${config.API_V1}/species/search?cachebust={{NOW}}&q={{RANDOM_WORD}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(40000)
});

const searchPostgres = testRunner({
  endpoint: `https://${config.API_V1}/species?cachebust={{NOW}}&q={{RANDOM_WORD}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(40000)
});

const key = testRunner({
  endpoint: `https://${config.API_V1}/species/1?cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(5000)
});

const suggest = testRunner({
  endpoint: `https://${config.API_V1}/species/suggest?datasetKey=${config.DATASETKEY_BACKBONE}&limit=10&q=puma+concolor+(Linnaeus,+1771)&cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(3000)
    .hasValue({path: '[0].scientificName', value: 'Puma concolor (Linnaeus, 1771)'})
});

const match = testRunner({
  endpoint: `https://${config.API_V1}/species/match?q=po&cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(3000)
});

const tests = [
  search,
  searchPostgres,
  key,
  suggest,
  match
];

module.exports = componentRunner(tests)