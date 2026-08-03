import crypto from 'crypto';
import NodeCache from 'node-cache';
import { secretEnv } from '../../envConfig.mjs';

const CHALLENGE_TTL_MS = 5 * 60 * 1000; // challenges expire after 5 minutes
const DIFFICULTY = 4;

// Challenges are stateless: the challengeId sent to the client is a signed token
// (payload + HMAC) that any instance can verify, so the flow works across multiple
// instances behind a load balancer without shared storage.
// JWT_SECRET is already shared across instances; the label separates this use from JWT signing.
const HMAC_KEY = 'gbif-pow-challenge_' + secretEnv.JWT_SECRET;

// Best-effort replay protection: remembers used challengeIds until they expire anyway.
// Per-instance only, so a solution could be replayed once per other instance within the
// TTL — acceptable given the PoW cost, and no worse than the abuse this feature deters.
const usedChallenges = new NodeCache({
  stdTTL: CHALLENGE_TTL_MS / 1000,
  checkperiod: 60,
});

function sign(payload) {
  return crypto.createHmac('sha256', HMAC_KEY).update(payload).digest('base64url');
}

export function getChallenge(req, res) {
  const payload = Buffer.from(
    JSON.stringify({
      data: crypto.randomBytes(16).toString('hex'),
      difficulty: DIFFICULTY,
      timestamp: Date.now(),
    })
  ).toString('base64url');

  res.json({
    challengeId: `${payload}.${sign(payload)}`,
    data: JSON.parse(Buffer.from(payload, 'base64url')).data,
    difficulty: DIFFICULTY,
  });
}

function verifyChallengeId(challengeId) {
  if (typeof challengeId !== 'string') return null;
  const [payload, signature] = challengeId.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, Buffer.from(expected))) {
    return null;
  }

  try {
    const challenge = JSON.parse(Buffer.from(payload, 'base64url'));
    if (Date.now() - challenge.timestamp > CHALLENGE_TTL_MS) return null;
    return challenge;
  } catch (err) {
    return null;
  }
}

export function requireProofOfWork(req, res, next) {
  const { challengeId, nonce } = req.body;

  const challenge = verifyChallengeId(challengeId);
  if (!challenge || usedChallenges.has(challengeId)) {
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
    usedChallenges.set(challengeId, true);
    // Proof of work verified, continue to next middleware
    next();
  } else {
    return res.status(400).json({
      error: 'Invalid solution',
      needNewChallenge: true,
    });
  }
}
