
const { severity, testRunner, componentRunner } = require('./helpers');
const config = require('../config');
const publicCrawlIndexName = 'prod-crawl-*';

const logs = testRunner({
  endpoint: `${config.PUBLIC_KIBANA}/_search?q=class:crawl%20AND%20@timestamp:%3E{{SECONDS_AGO}}&index=${publicCrawlIndexName}`,
  secondsAgo: 180,
  expect: response => response
    .hasStatusCode(200, severity.operational)
    .hasNumberAbove({path: 'hits.total.value', threshold: 0}, severity.major_outage)
});

const running = testRunner({
  endpoint: `https://${config.API_V1}/dataset/process/running?cachebust={{NOW}}`,
  intervals: {
    success: 3*60*1000,
    failure: 60*1000
  },
  expect: response => response
    .hasStatusCode(200)
    .hasMaxResponseTime(4000)
});

const tests = [
  logs,
  running
];

module.exports = componentRunner(tests)