const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');

const website = testRunner({
  endpoint: `${config.WEBSITE}/favicon.ico?cachebust={{NOW}}`,
  expect: (response) => response.hasStatusCode(200).hasMaxResponseTime(40000),
});

const tests = [website];

module.exports = componentRunner(tests);
