const _ = require('lodash');
const { severity, severityMap } = require('./severity');
const { getExpectData, expect, scheduleNextUpdate } = require('./util');

function getTestFromConfig(config) {
  let status = {
    severity: severity.operational,
    messages: []
  }
  let failures = 0;
  let refreshInterval = _.get(config, 'intervals.success', 2*60*1000);
  let failureInterval = _.get(config, 'intervals.failure', 30*1000);

  async function updateStatus() {
    // fetch data
    const response = await getExpectData({
      endpoint: config.endpoint,
      timeoutMilliSeconds: config.hasMaxResponseTime ? config.hasMaxResponseTime + 1000 : 60000,
      secondsAgo: config.secondsAgo
    });

    //run tests on data
    let intermediateResult = expect(response);
    const availableActions = [
      'hasStatusCode',
      'hasMaxResponseTime',
      'hasNumberBelow',
      'hasNumberAbove',
      'contains',
      'hasProperty',
      'hasValue'
    ];
    availableActions.forEach(action => {
      if (config[action])
        intermediateResult = intermediateResult[action](config[action], config.severity);
    });
    const result = intermediateResult.result();

    //check for errors in result
    const hasError = severityMap[result.severity] > severityMap.operational;
    if (hasError) failures++; //if there is an error, then increase counter
    // suppress initial errors
    if (failures > config.failureThreshold || 1) {
      failures = 0;
      status = result;
    }
    // console.log(result);
    //schedule the next update, but make it dependent on the currenst status. if failed, then run again quickly.
    scheduleNextUpdate(updateStatus, result.severity, refreshInterval, failureInterval);
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
  getTestFromConfig
}

