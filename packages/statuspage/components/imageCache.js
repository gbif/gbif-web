
const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');

const image = testRunner({
  endpoint: `https://${config.API_V1}/image/unsafe/${encodeURIComponent('http://www.gbif.org/img/logo/GBIF-2015.png')}?cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(10000)
});

const tests = [
  image
];

module.exports = componentRunner(tests)