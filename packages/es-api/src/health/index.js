const { getStats, getInflight, getPriorityCounts } = require('./metrics');
const { getEventLoopStats } = require('./eventLoop');
const { buildNagiosString } = require('./nagios');

/**
 * /health endpoint. Reports per-endpoint queue backlog, how many requests have
 * been rejected (queue full vs shed by priority), whether anything is being
 * rejected right now, and event-loop lag. Mirrors the graphql-api /health in
 * spirit.
 *
 * Not cached: it must reflect live state for ops/probes.
 */
module.exports = (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const { rejecting, queues } = getStats();
    const eventLoop = getEventLoopStats();
    res.json({
      status: 'ok',
      // Flat, greppable status line for Nagios-style string checks.
      nagiosString: buildNagiosString(queues, eventLoop),
      // seconds since the process started.
      uptimeSeconds: Math.round(process.uptime()),
      // requests being handled across the whole service right now.
      inflight: getInflight(),
      // histogram of x-client-priority on incoming requests (which we see most).
      priorityCounts: getPriorityCounts(),
      // true when a priority gate is shedding or a queue is at its hard cap.
      rejecting,
      queues,
      // Event-loop lag (ms): mean and max over the last window, plus the sticky
      // worst since startup. Reported for visibility only — nothing acts on it.
      eventLoop,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
