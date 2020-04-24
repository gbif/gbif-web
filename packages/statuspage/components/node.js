
const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');

const search = testRunner({
  endpoint: `https://${config.API_V1}/node?cachebust={{NOW}}&q={{RANDOM_WORD}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(30000)
});

const key = testRunner({
  endpoint: `https://${config.API_V1}/node/${config.NODEKEY}?cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(4000)
});

const suggest = testRunner({
  endpoint: `https://${config.API_V1}/node/suggest?q=da&cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(3000)
});

const tests = [
  search,
  key,
  suggest
];

module.exports = componentRunner(tests)