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

// Test crypto functionality with a simple operation
async function testCryptoFunctionality(
  cryptoApi: Crypto
): Promise<{ working: boolean; errorMessage?: string }> {
  try {
    // Test basic crypto operations
    const testData = new TextEncoder().encode('test');

    // Test random number generation
    const randomBytes = cryptoApi.getRandomValues(new Uint8Array(16));
    if (!randomBytes || randomBytes.length !== 16) {
      return { working: false, errorMessage: 'Random number generation is not working properly.' };
    }

    // Test SHA-256 hashing
    const hashBuffer = await cryptoApi.subtle.digest('SHA-256', testData);
    if (!hashBuffer || hashBuffer.byteLength !== 32) {
      return { working: false, errorMessage: 'SHA-256 hashing is not working properly.' };
    }

    return { working: true };
  } catch (error) {
    return {
      working: false,
      errorMessage: `Crypto operations failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    };
  }
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

  // Test crypto functionality
  const functionalityTest = await testCryptoFunctionality(cryptoCheck.crypto!);
  if (!functionalityTest.working) {
    self.postMessage({
      error: true,
      errorMessage: functionalityTest.errorMessage,
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
    while (true) {
      // Create timestamp-based nonce (8 bytes timestamp + random bytes)
      // This prevents replay attacks and nonce reuse
      const timestamp = Date.now();
      const timestampBytes = new ArrayBuffer(8);
      const timestampView = new DataView(timestampBytes);
      timestampView.setBigUint64(0, BigInt(timestamp), false); // Big Endian

      // Add random bytes to the timestamp
      const randomBytes = cryptoApi.getRandomValues(new Uint8Array(8));
      const nonceBytes = new Uint8Array(16);
      nonceBytes.set(new Uint8Array(timestampBytes), 0);
      nonceBytes.set(randomBytes, 8);

      // Convert to hex string for hashing
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
        console.log('Worker: Found solution! Hash:', hash, 'Nonce:', nonceHex);

        // Send the solution back to main thread
        self.postMessage({
          success: true,
          nonce: nonceHex,
          hash: hash,
          attempts: attempts + 1,
        } as WorkerResponse);
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
