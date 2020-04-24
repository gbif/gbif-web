
const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');

const capabilities = testRunner({
  endpoint: `https://${config.API_V2}/map/occurrence/density/capabilities.json?taxonKey=5&cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(10000)
    .hasNumberAbove({path: 'total', threshold: 1000})
});

const density = testRunner({
  endpoint: `https://${config.API_V2}/map/occurrence/density/0/0/0@1x.png?cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(30000)
});

const baseMap = testRunner({
  endpoint: `https://${config.BASEMAP_TILE_API}/4326/omt/2/3/1@1x.png?cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(30000)
});

const tests = [
  capabilities,
  density,
  baseMap
];

module.exports = componentRunner(tests)