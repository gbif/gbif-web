// This code runs in the Web Worker (separate thread)
// Using browser's built-in Web Crypto API with fallbacks for older browsers

import { checkBrowserCryptoSupport } from './proofOfWork';

interface WorkerMessage {
  challengeData: string;
  difficulty: number;
}

interface WorkerResponse {
  success?: boolean;
  progress?: boolean;
  error?: boolean;
  errorMessage?: string;
  nonce?: string;
  hash?: string;
  attempts: number;
}

// Listen for messages from the main thread
self.onmessage = async function (e: MessageEvent<WorkerMessage>) {
  const { challengeData, difficulty } = e.data;

  // First, check if crypto is supported
  const cryptoCheck = checkBrowserCryptoSupport();
  if (!cryptoCheck.supported) {
    self.postMessage({
      error: true,
      errorMessage: cryptoCheck.errorMessage,
      attempts: 0,
    } as WorkerResponse);
    return;
  }

  const cryptoApi = cryptoCheck.crypto!;
  let attempts = 0; // Counter for tracking attempts
  const target = '0'.repeat(difficulty); // Target pattern (e.g., "0000" for difficulty 4)

  try {
    // Keep trying different nonce values until we find a valid hash
    let found = false;
    while (!found) {
      // Generate random nonce (16 bytes = 32 hex chars)
      const nonceBytes = cryptoApi.getRandomValues(new Uint8Array(16));
      const nonceHex = Array.from(nonceBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      // Create hash using Web Crypto API: SHA256(prefix + challenge + nonce)
      const input = 'gbif_' + challengeData + nonceHex;
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await cryptoApi.subtle.digest('SHA-256', data);
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      // Check if hash starts with required number of zeros
      if (hash.startsWith(target)) {
        // Send the solution back to main thread
        self.postMessage({
          success: true,
          nonce: nonceHex,
          hash: hash,
          attempts: attempts + 1,
        } as WorkerResponse);
        found = true;
        break;
      }

      attempts++; // Track attempts for progress reporting

      // Report progress every 1000 attempts so user knows it's working
      if (attempts % 10000 === 0) {
        self.postMessage({
          progress: true,
          attempts: attempts,
        } as WorkerResponse);
      }
    }
  } catch (error) {
    self.postMessage({
      error: true,
      errorMessage: `Cryptographic computation failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      attempts: attempts,
    } as WorkerResponse);
  }
};
