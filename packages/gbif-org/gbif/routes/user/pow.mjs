import crypto from 'crypto';
import NodeCache from 'node-cache';

// Create cache with TTL (e.g., 5 minutes for challenges to expire)
const challenges = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired items every minute
});

export function getChallenge(req, res) {
  const challenge = {
    id: crypto.randomUUID(),
    data: crypto.randomBytes(16).toString('hex'),
    difficulty: 4,
    timestamp: Date.now(),
  };

  // Store with TTL
  challenges.set(challenge.id, challenge);

  res.json({
    challengeId: challenge.id,
    data: challenge.data,
    difficulty: challenge.difficulty,
  });
}

export function requireProofOfWork(req, res, next) {
  const { challengeId, nonce } = req.body;
  // Get and immediately delete (atomic operation) so should prevent replay attacks
  const challenge = challenges.take(challengeId); // .take() gets and deletes

  if (!challenge) {
    return res.status(400).json({
      error: 'Challenge not found or expired',
      needNewChallenge: true, // Signal client to get new challenge
    });
  }

  // Validate solution
  const hash = crypto
    .createHash('sha256')
    .update('gbif_' + challenge.data + nonce) // the prefix just generates a unique hash for GBIF to lower the risk of replay attacks
    .digest('hex');

  if (hash.startsWith('0'.repeat(challenge.difficulty))) {
    // Proof of work verified, continue to next middleware
    next();
  } else {
    return res.status(400).json({
      error: 'Invalid solution',
      needNewChallenge: true,
    });
  }
}
