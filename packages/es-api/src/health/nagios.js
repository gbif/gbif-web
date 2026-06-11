/**
 * Build a flat, greppable status line for Nagios-style checks (call /health,
 * look for a specific string). Each subsystem contributes exactly one token for
 * its current state, joined by " - ", so a check can "expect to see"
 * QUEUE_OCCURRENCE_OPERATIONAL (and alert when it disappears) or "expect to NOT
 * see" QUEUE_OCCURRENCE_OVERLOADED.
 *
 * Tokens are prefixed (QUEUE_) and uppercased so none is a substring of another:
 * without the prefix, matching OCCURRENCE_OPERATIONAL would also hit inside
 * EVENT_OCCURRENCE_OPERATIONAL. QUEUE_OCCURRENCE_... is not a substring of
 * QUEUE_EVENT_OCCURRENCE_... .
 */

const SLOW_EVENT_LOOP_MS = 1000;

function subject(name) {
  return String(name)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_');
}

function queueStatus(q) {
  if (q.queueFullNow) return 'OVERLOADED'; // backlog at the hard cap
  if (q.shedding && q.shedding.rejecting) return 'REDUCED_CAPACITY'; // gate shedding
  return 'OPERATIONAL';
}

function buildNagiosString(queues, eventLoop) {
  const tokens = ['SERVICE_OPERATIONAL'];
  Object.entries(queues).forEach(([name, q]) => {
    tokens.push(`QUEUE_${subject(name)}_${queueStatus(q)}`);
  });
  const slow = eventLoop && eventLoop.eventLoopDelayMaxMs > SLOW_EVENT_LOOP_MS;
  tokens.push(`EVENT_LOOP_${slow ? 'SLOW' : 'OK'}`);
  return tokens.join(' - ');
}

module.exports = { buildNagiosString };
