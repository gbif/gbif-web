import { getEnumStatus } from './components/enum';
import { getInterpretationRemarkStatus } from './components/interpretationRemark';
import { getPoolStats } from '@/requestPools';
import { getOverloadStats } from '@/overloadGuard';

const SLOW_EVENT_LOOP_MS = 1000;

// Flat, greppable status line for Nagios-style checks. One token per subsystem
// reflecting its current state, so a check can "expect to see"
// QUEUE_OCCURRENCE_OPERATIONAL (alerting when it disappears) or "expect to NOT
// see" QUEUE_OCCURRENCE_OVERLOADED. The QUEUE_ prefix anchors each token so none
// is a substring of another (e.g. OCCURRENCE vs EVENT_OCCURRENCE).
function buildNagiosString(pools, overload) {
  const tokens = ['SERVICE_OPERATIONAL'];
  Object.entries(pools).forEach(([name, p]) => {
    const subject = name.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
    // Pools have no soft-shedding gate, so they go straight to OVERLOADED when
    // the backlog reaches the hard cap (maxQueueSize of -1 means unbounded).
    const status =
      p.maxQueueSize > 0 && p.waiting >= p.maxQueueSize
        ? 'OVERLOADED'
        : 'OPERATIONAL';
    tokens.push(`QUEUE_${subject}_${status}`);
  });
  const slow = overload.eventLoopDelayMaxMs > SLOW_EVENT_LOOP_MS;
  tokens.push(`EVENT_LOOP_${slow ? 'SLOW' : 'OK'}`);
  return tokens.join(' - ');
}

export default (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=5'); // 5 seconds
    const overload = getOverloadStats();
    const requestPools = getPoolStats();
    res.json({
      enums: getEnumStatus(),
      interpetationRemark: getInterpretationRemarkStatus(),
      // Flat, greppable status line for Nagios-style string checks.
      nagiosString: buildNagiosString(requestPools, overload),
      // seconds since the process started.
      uptimeSeconds: Math.round(process.uptime()),
      // requests being handled across the whole service right now (the guard
      // tracks this for /graphql, which is effectively all traffic).
      inflight: overload.inflight,
      // Per-upstream bulkhead depth/limits. During an incident this shows which
      // pool is backed up (high `waiting`) vs which upstream is just slow.
      requestPools,
      // Process health + the pre-Apollo guard. eventLoopDelayMs/heap are always
      // reported (cheap) so you can tune thresholds even with the guard off.
      overload,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
