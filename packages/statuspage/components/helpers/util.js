const qs = require('qs');
const axios = require('axios');
const _ = require('lodash');
const randomWords = require('random-words');
const { severity, severityMap, getMostSevere } = require('./severity');
const defaultInterval = 2*60*1000;
const defaultFailureInteval = 30*1000;

function getData({ url, timeoutMilliSeconds }) {
  timeoutMilliSeconds = timeoutMilliSeconds || 60 * 1000 // 1 minute
  return axios({
    method: 'get',
    url: url,
    timeout: timeoutMilliSeconds,
    headers: { 'User-Agent': 'gbif-statuspage' }
  });
}

async function getExpectData({ endpoint, query, timeoutMilliSeconds, secondsAgo=60*5 }) {
  const urlTemplate = query ? endpoint + '?' + qs.stringify(query) : endpoint

  const url = urlTemplate
    .replace('{{NOW}}', Date.now())
    .replace('{{RANDOM_WORD}}', randomWords())
    .replace('{{SECONDS_AGO}}', Date.now() - secondsAgo * 1000);  
  
  let start = new Date();
  try {
    const response = await getData({ url, timeoutMilliSeconds });
    let elapsed = new Date() - start;
    return {
      response,
      elapsed,
      config: {
        endpoint, timeoutMilliSeconds, start, url
      }
    }
  } catch (error) {
    let elapsed = new Date() - start;
    return {
      error,
      elapsed,
      config: {
        endpoint, timeoutMilliSeconds, start, url
      }
    }
  }
}

function expect(context) {
  let skipDataChecks = false;
  let endpoint = _.get(context, 'config.endpoint');
  let testResult = {
    severity: severity.operational,
    messages: [],
    updated: context.config.start
  }

  return {
    hasStatusCode: function (statusCode, sev = severity.major_outage) {
      let actualStatusCode = _.get(context, 'response.status') || _.get(context, 'error.response.status');
      if (actualStatusCode !== statusCode) {
        skipDataChecks = true;
        testResult.severity = getMostSevere(testResult.severity, sev);
        testResult.messages.push(`expected statusCode to equal ${statusCode}, but found ${actualStatusCode} for endpoint ${endpoint}`);
      }
      return this;
    },
    hasProperty: function (path, sev = severity.partial_outage) {
      if (skipDataChecks) return this;
      const actualValue = _.get(context, `response.data.${path}`);
      if (typeof actualValue === 'undefined') {
        testResult.severity = getMostSevere(testResult.severity, sev);
        testResult.messages.push(`expected ${path} to be a defined for endpoint ${endpoint}`);
      }
      return this;
    },
    hasValue: function ({ value, path }, sev = severity.partial_outage) {
      if (skipDataChecks) return this;
      const actualValue = _.get(context, `response.data.${path}`);
      if (actualValue !== value) {
        testResult.severity = getMostSevere(testResult.severity, sev);
        testResult.messages.push(`expected ${path} to be equal ${value} for endpoint ${endpoint}`);
      }
      return this;
    },
    hasNumberAbove: function ({ threshold, path }, sev = severity.partial_outage) {
      if (skipDataChecks) return this;
      const actualValue = _.get(context, `response.data.${path}`);
      if (typeof actualValue === 'undefined' || actualValue <= threshold) {
        testResult.severity = getMostSevere(testResult.severity, sev);
        testResult.messages.push(`expected ${path} to be above ${threshold}, but found ${actualValue} for endpoint ${endpoint}`);
      }
      return this;
    },
    hasNumberBelow: function ({ threshold, path }, sev = severity.partial_outage) {
      if (skipDataChecks) return this;
      const actualValue = _.get(context, `response.data.${path}`);
      if (typeof actualValue === 'undefined' || actualValue >= threshold) {
        testResult.severity = getMostSevere(testResult.severity, sev);
        testResult.messages.push(`expected ${path} to be above ${threshold}, but found ${actualValue} for endpoint ${endpoint}`);
      }
      return this;
    },
    contains: function (searchString, sev = severity.partial_outage) {
      if (skipDataChecks) return this;
      try {
        const stringContent = JSON.stringify(_.get(context, `response.data`, ''));
        const hasMatch = stringContent.includes(searchString);
        if (!hasMatch) {
          testResult.severity = getMostSevere(testResult.severity, sev);
          testResult.messages.push(`expected content to contain ${searchString} for endpoint ${endpoint}`);
        }
      } catch (error) {
        testResult.severity = getMostSevere(testResult.severity, sev);
        testResult.messages.push(`expected content to contain ${searchString}, but was unable to get any text for endpoint ${endpoint}`);
      }
      return this;
    },
    hasMaxResponseTime: function (maxTime, sev = severity.degraded_performance) {
      if (_.get(context, 'elapsed') > maxTime && context.config.timeoutMilliSeconds > maxTime) {
        skipDataChecks = true;
        testResult.severity = getMostSevere(testResult.severity, sev);
        testResult.messages.push(`expected elapsed time to be below ${maxTime} for endpoint ${endpoint}`);
      }
      return this;
    },
    result: function () { return testResult; }
  }
}

function scheduleNextUpdate(fn, currentSeverity = severity.operational, refreshInterval = defaultInterval, failureInterval = defaultFailureInteval) {
  if (!fn) return;
  const hasError = severityMap[currentSeverity] > severityMap.operational;
  const interval = hasError ? failureInterval : refreshInterval;
  setTimeout(fn, interval);
}

module.exports = {
  getData,
  getExpectData,
  expect,
  scheduleNextUpdate
}