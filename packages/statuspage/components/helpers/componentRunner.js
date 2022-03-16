/**
 * run several tests and return the most severe state.
 * The tests themselves should manage their own intervals.
 * 
 * Start tests
 * keep a joined status (update every say 10 seconds)
 * return the current status when asked.
 */
const _ = require('lodash');
const { getSummaryState, severity } = require('./severity');
// const { testRunner } = require('./testRunner');
const config = require('../../config');

function componentRunner(tests = [], config = {}) {
  let refreshInterval = _.get(config, 'refreshInterval', 2000);
  let status = {
    severity: severity.operational,
    messages: [],
    updated: new Date()
  }

  function updateStatus() {
    try {
      //get most severe status from list of tests
      const testResults = tests.map(test => test.getStatus());
      // testResults.forEach(test => console.log(test));

      // summarize the various tests
      statusSummary = getSummaryState(testResults.map(test => test.severity));
      // concatenate all the messages
      let messageSummary = [];
      testResults.forEach(test => messageSummary.push(...test.messages));
      //get last updated
      const updated = _.max(_.map(testResults, test => test.updated));
      //set the new status state
      status = {
        status: statusSummary,
        messages: messageSummary,
        updated
      }
      // console.log(status);
    } catch (err) {
      console.log('=====Component runner stopped due to an unhandled error =====');
      console.log(err);
    }
  }

  //get the intitial status
  function start() {
    //start the tests
    tests.forEach(test => test.start());
    //run the first check
    updateStatus();
    //schedule subsequent updates
    setInterval(updateStatus, refreshInterval);
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
  componentRunner
}