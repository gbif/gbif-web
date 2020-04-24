
const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');

const search = testRunner({
  endpoint: `https://${config.API_V1}/installation?cachebust={{NOW}}&q={{RANDOM_WORD}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(30000)
});

const key = testRunner({
  endpoint: `https://${config.API_V1}/installation/${config.INSTALLATIONKEY}?cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(4000)
});

const tests = [
  search,
  key
];

module.exports = componentRunner(tests)