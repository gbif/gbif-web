import { getEnumStatus } from './components/enum';
import { getInterpretationRemarkStatus } from './components/interpretationRemark';
import { getPoolStats } from '@/requestPools';
import { getOverloadStats } from '@/overloadGuard';

export default (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=5'); // 5 seconds
    const overload = getOverloadStats();
    res.json({
      enums: getEnumStatus(),
      interpetationRemark: getInterpretationRemarkStatus(),
      // seconds since the process started.
      uptimeSeconds: Math.round(process.uptime()),
      // requests being handled across the whole service right now (the guard
      // tracks this for /graphql, which is effectively all traffic).
      inflight: overload.inflight,
      // Per-upstream bulkhead depth/limits. During an incident this shows which
      // pool is backed up (high `waiting`) vs which upstream is just slow.
      requestPools: getPoolStats(),
      // Process health + the pre-Apollo guard. eventLoopDelayMs/heap are always
      // reported (cheap) so you can tune thresholds even with the guard off.
      overload,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
