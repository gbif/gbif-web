import { getEnumStatus } from './components/enum';
import { getInterpretationRemarkStatus } from './components/interpretationRemark';
import { getPoolStats } from '@/requestPools';
import { getOverloadStats } from '@/overloadGuard';

export default (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=5'); // 5 seconds
    res.json({
      enums: getEnumStatus(),
      interpetationRemark: getInterpretationRemarkStatus(),
      // Per-upstream bulkhead depth/limits. During an incident this shows which
      // pool is backed up (high `waiting`) vs which upstream is just slow.
      requestPools: getPoolStats(),
      // Process health + the pre-Apollo guard. eventLoopDelayMs/heap are always
      // reported (cheap) so you can tune thresholds even with the guard off.
      overload: getOverloadStats(),
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
