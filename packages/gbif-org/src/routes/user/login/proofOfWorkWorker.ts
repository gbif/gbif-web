// This code runs in the Web Worker (separate thread)
// Using browser's built-in Web Crypto API with fallbacks for older browsers

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

// Check if crypto is available and working
function checkCryptoSupport(): { supported: boolean; crypto?: Crypto; errorMessage?: string } {
  // Check for standard crypto
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return { supported: true, crypto };
  }

  // Check for IE11 msCrypto prefix
  if (typeof (self as any).msCrypto !== 'undefined' && (self as any).msCrypto.subtle) {
    return { supported: true, crypto: (self as any).msCrypto };
  }

  // Check for legacy webkit prefix (older Safari/Chrome)
  if (typeof (self as any).webkitCrypto !== 'undefined' && (self as any).webkitCrypto.subtle) {
    return { supported: true, crypto: (self as any).webkitCrypto };
  }

  return {
    supported: false,
    errorMessage:
      'Web Crypto API is not supported in this browser. Please use a modern browser like Chrome, Firefox, Safari, or Edge.',
  };
}

// Listen for messages from the main thread
self.onmessage = async function (e: MessageEvent<WorkerMessage>) {
  const { challengeData, difficulty } = e.data;

  // First, check if crypto is supported
  const cryptoCheck = checkCryptoSupport();
  if (!cryptoCheck.supported) {
    self.postMessage({
      error: true,
      errorMessage: cryptoCheck.errorMessage,
      attempts: 0,
    } as WorkerResponse);
    return;
  }

  console.log('Worker: Starting proof of work with difficulty', difficulty);

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
      const input = 'gbifx_' + challengeData + nonceHex;
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await cryptoApi.subtle.digest('SHA-256', data);
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      // Check if hash starts with required number of zeros
      if (hash.startsWith(target)) {
        console.log('Worker: Found solution! Hash:', hash, 'Nonce:', nonceHex);

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
      if (attempts % 1000 === 0) {
        self.postMessage({
          progress: true,
          attempts: attempts,
        } as WorkerResponse);
      }
    }
  } catch (error) {
    console.error('Worker: Crypto operation failed:', error);
    self.postMessage({
      error: true,
      errorMessage: `Cryptographic computation failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      attempts: attempts,
    } as WorkerResponse);
  }
};
