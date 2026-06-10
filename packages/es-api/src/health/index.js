const { getStats } = require('./metrics');
const { getEventLoopStats } = require('./eventLoop');

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
    res.json({
      status: 'ok',
      // true when a priority gate is shedding or a queue is at its hard cap.
      rejecting,
      queues,
      // Event-loop lag (ms): mean and max over the last window, plus the sticky
      // worst since startup. Reported for visibility only — nothing acts on it.
      eventLoop: getEventLoopStats(),
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
