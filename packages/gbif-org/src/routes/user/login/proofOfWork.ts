interface Challenge {
  challengeId: string;
  data: string;
  difficulty: number;
}

export interface ProofOfWorkResult {
  challengeId: string;
  nonce: string;
}

export class ProofOfWorkError extends Error {
  constructor(
    message: string,
    public readonly code: 'CRYPTO_NOT_SUPPORTED' | 'PROOF_OF_WORK_FAILED'
  ) {
    super(message);
    this.name = 'ProofOfWorkError';
  }
}

/**
 * Checks if the browser supports the required cryptographic operations
 * Returns detailed error information if crypto is not supported
 */
export function checkBrowserCryptoSupport(): {
  supported: boolean;
  crypto?: Crypto;
  errorMessage?: string;
} {
  // Secure context is required for crypto.subtle operations
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return {
      supported: false,
      errorMessage:
        'Cryptographic operations require a secure context (HTTPS). Please access the site over HTTPS.',
    };
  }

  // Check for standard Web Crypto API
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return { supported: true, crypto };
  }

  // Check for IE11 msCrypto prefix (legacy support)
  if (typeof (window as any)?.msCrypto !== 'undefined' && (window as any).msCrypto.subtle) {
    return { supported: true, crypto: (self as any).msCrypto };
  }

  // Check for legacy webkit prefix (older Safari/Chrome)
  if (typeof (window as any)?.webkitCrypto !== 'undefined' && (window as any).webkitCrypto.subtle) {
    return { supported: true, crypto: (self as any).webkitCrypto };
  }

  return {
    supported: false,
    errorMessage:
      'Your browser does not support modern cryptography. Please use a recent version of Chrome, Firefox, Safari, or Edge.',
  };
}

/**
 * Fetches a proof-of-work challenge from the server
 * The challenge contains data that must be combined with a nonce to produce a hash with the required difficulty
 */
export async function getChallenge(): Promise<Challenge> {
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
 * Solves the proof-of-work challenge using a Web Worker to prevent UI blocking
 * Returns an object with a cancel function and a promise that resolves to the solution
 *
 * @param challenge - The challenge object from the server
 */
export function solveProofOfWork(challenge: Challenge): {
  cancel: () => void;
  promise: Promise<ProofOfWorkResult>;
} {
  const worker = new Worker(new URL('./proofOfWorkWorker.ts', import.meta.url), {
    type: 'module',
  });

  return {
    cancel: () => worker.terminate(),
    promise: new Promise((resolve, reject) => {
      // Handle messages from the worker
      worker.onmessage = function (e) {
        if (e.data.success) {
          worker.terminate();
          resolve({
            nonce: e.data.nonce,
            challengeId: challenge.challengeId,
          });
        } else if (e.data.error) {
          worker.terminate();
          reject(new ProofOfWorkError(e.data.errorMessage, 'PROOF_OF_WORK_FAILED'));
        }
      };

      // Handle worker errors
      worker.onerror = function () {
        worker.terminate();
        reject(
          new ProofOfWorkError(
            'Proof of work computation failed due to worker error',
            'PROOF_OF_WORK_FAILED'
          )
        );
      };

      // Start the computation
      worker.postMessage({
        challengeData: challenge.data,
        difficulty: challenge.difficulty,
      });
    }),
  };
}
