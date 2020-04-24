const severity = Object.freeze({
  operational: 'operational',
  degraded_performance: 'degraded_performance',
  partial_outage: 'partial_outage',
  major_outage: 'major_outage'
});

const severityMap = Object.freeze({
  operational: 1,
  degraded_performance: 2,
  partial_outage: 4,
  major_outage: 5
});

function getMostSevere(a, b) {
  let typeA = severityMap[a] || 0,
    typeB = severityMap[b] || 0;
  return typeA < typeB ? b : a;
}

function getLeastSevere(a, b) {
  let typeA = severityMap[a] || 0,
    typeB = severityMap[b] || 0;
  return typeA > typeB ? b : a;
}

function getMostSevereInList(states) {
  const status = states.reduce((accumulator, state) => getMostSevere(state, accumulator), severity.unknown);
  return status;
}

function getLestSevereInList(states) {
  const status = states.reduce((accumulator, state) => getLeastSevere(state, accumulator), severity.unknown);
  return status;
}

function getSummaryState(states) {
  // any part is under maintanance, then label the general status as being so
  if (states.includes(severity.under_maintenance)) return severity.under_maintenance;
  // if no elements are operational, then return the most severe status
  if (!states.includes(severity.operational)) return getMostSevereInList(states);
  // if all elements are at least functional, then return worst
  const most = getMostSevereInList(states);
  if (severityMap[most] <= severityMap[severity.degraded_performance]) return most;
  //if not under maintainance and has both operational and and problematic parts, then return partial.
  return severity.partial_outage;
}

module.exports = { 
  severity, 
  severityMap, 
  getMostSevere, 
  getLeastSevere,
  getLestSevereInList, 
  getMostSevereInList, 
  getSummaryState
};
