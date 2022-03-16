const _ = require('lodash');
const { severity, severityMap } = require('./severity');
const { getExpectData, expect, scheduleNextUpdate } = require('./util');

function testRunner(config) {
  let status = {
    severity: severity.operational,
    messages: [],
    updated: new Date()
  }
  let failures = 0;
  let refreshInterval = _.get(config, 'intervals.success', 2 * 60 * 1000);
  let failureInterval = _.get(config, 'intervals.failure', 30 * 1000);
  let failureThreshold = _.get(config, 'failureThreshold', 1);

  async function updateStatus() {
    try {
      // fetch data
      const response = await getExpectData({
        endpoint: config.endpoint,
        timeoutMilliSeconds: config.timeoutMilliSeconds || 60000,
        secondsAgo: config.secondsAgo
      });

      //run tests on data
      let intermediateResult = expect(response);
      let result = config.expect(intermediateResult).result();

      //check for errors in result
      const hasError = severityMap[result.severity] > severityMap.operational;
      if (hasError) failures++; //if there is an error, then increase counter

      // for debugging in this initial phase to dianogse if we report errors at the appropriate times
      if (hasError) {
        console.warn(response);
      }

      // suppress initial errors
      if (!hasError || failures > failureThreshold) {
        failures = 0;
        status = result;
      }
      //schedule the next update, but make it dependent on the currenst status. if failed, then run again quickly.
      scheduleNextUpdate(updateStatus, result.severity, refreshInterval, failureInterval);
    } catch (err) {
      console.log('=====Test runner stopped due to an unhandled error =====');
      console.log(err);
    }
  }

  //get the intitial status
  function start() {
    updateStatus();
  }

  //Expose it to other components
  function getStatus() {
    return status;
  };

  return {
    start,
    getStatus
  }
}

module.exports = {
  testRunner
}

