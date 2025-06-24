interface Challenge {
  challengeId: string;
  data: string;
  difficulty: number;
}

interface ProofOfWorkSolution {
  nonce: string;
  hash: string;
  attempts: number;
}

interface ProofOfWorkProgress {
  attempts: number;
}

export interface ProofOfWorkResult {
  challengeId: string;
  nonce: string;
  verified: boolean;
}

export class ProofOfWorkError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ProofOfWorkError';
  }
}

/**
 * Check if the browser supports the required crypto operations
 */
export function checkBrowserCryptoSupport(): { supported: boolean; errorMessage?: string } {
  // Check if we're in a secure context (required for crypto.subtle)
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return {
      supported: false,
      errorMessage:
        'Cryptographic operations require a secure context (HTTPS). Please access the site over HTTPS.',
    };
  }

  // Check for standard crypto
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return { supported: true };
  }

  // Check for IE11 msCrypto prefix
  if (typeof (window as any)?.msCrypto !== 'undefined' && (window as any).msCrypto.subtle) {
    return { supported: true };
  }

  // Check for legacy webkit prefix (older Safari/Chrome)
  if (typeof (window as any)?.webkitCrypto !== 'undefined' && (window as any).webkitCrypto.subtle) {
    return { supported: true };
  }

  return {
    supported: false,
    errorMessage:
      'Your browser does not support modern cryptography. Please use a recent version of Chrome, Firefox, Safari, or Edge.',
  };
}

/**
 * Fetch a proof-of-work challenge from the server
 */
export async function getChallenge(): Promise<Challenge> {
  // Check crypto support before attempting to get challenge
  const cryptoSupport = checkBrowserCryptoSupport();
  if (!cryptoSupport.supported) {
    throw new ProofOfWorkError(cryptoSupport.errorMessage!, 'CRYPTO_NOT_SUPPORTED');
  }

  const response = await fetch('/api/user/challenge', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get challenge from server');
  }

  return await response.json();
}

/**
 * Solves the proof of work challenge using a Web Worker
 * This prevents the computation from blocking the main UI thread
 */
export async function solveProofOfWork(
  challenge: Challenge,
  progressCallback?: (progress: ProofOfWorkProgress) => void
): Promise<ProofOfWorkSolution> {
  return new Promise((resolve, reject) => {
    console.log('🔄 Creating Web Worker for proof of work computation');

    // Create the worker from the external TypeScript file
    // Note: In production, this would typically be compiled and served as a separate JS file
    const worker = new Worker(new URL('./proofOfWorkWorker.ts', import.meta.url), {
      type: 'module',
    });

    // Handle messages from the worker
    worker.onmessage = function (e) {
      if (e.data.success) {
        console.log(`✅ Proof of work completed in ${e.data.attempts} attempts`);
        worker.terminate(); // Clean up the worker
        resolve({
          nonce: e.data.nonce,
          hash: e.data.hash,
          attempts: e.data.attempts,
        });
      } else if (e.data.error) {
        console.error('❌ Crypto error from worker:', e.data.errorMessage);
        worker.terminate();
        reject(new ProofOfWorkError(e.data.errorMessage, 'CRYPTO_ERROR'));
      } else if (e.data.progress) {
        // Update UI with progress (optional)
        console.log(`🔄 Proof of work progress: ${e.data.attempts} attempts`);
        if (progressCallback) {
          progressCallback({ attempts: e.data.attempts });
        }
      }
    };

    // Handle worker errors
    worker.onerror = function (error) {
      console.error('❌ Worker error:', error);
      worker.terminate();
      reject(
        new ProofOfWorkError('Proof of work computation failed due to worker error', 'WORKER_ERROR')
      );
    };

    // Start the computation by sending challenge to worker
    worker.postMessage({
      challengeData: challenge.data,
      difficulty: challenge.difficulty,
    });

    console.log('🔄 Proof of work computation started in background');
  });
}
