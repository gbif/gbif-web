
const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');

const login = testRunner({
  endpoint: `https://${config.API_V1}/user/login?cachebust={{NOW}}`,
  expect: response => response
    .hasStatusCode(401)
    .hasMaxResponseTime(30000)
});

const tests = [
  login
];

module.exports = componentRunner(tests)