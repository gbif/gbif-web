/**
 * Utility functions for handling flash cookies that contain temporary authentication messages
 */

export interface FlashInfo {
  authProvider?: string;
  error?: string;
}

/**
 * Reads and clears a flash cookie by name
 * @param cookieName - The name of the cookie to read
 * @returns The parsed flash info object or null if cookie doesn't exist or can't be parsed
 */
export function readAndClearFlashCookie(cookieName: string): FlashInfo | null {
  if (typeof document === 'undefined') return null;

  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split('=')[1];

  if (!cookieValue) return null;

  try {
    const decoded = decodeURIComponent(cookieValue);
    const flashInfo = JSON.parse(decoded);

    // Clear the cookie after reading
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;

    return flashInfo;
  } catch (e) {
    // If parsing fails, still try to clear the cookie
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    return null;
  }
}

/**
 * Reads and clears the login flash cookie specifically
 */
export function readLoginFlashInfo(): FlashInfo | null {
  return readAndClearFlashCookie('loginFlashInfo');
}

/**
 * Reads and clears the profile flash cookie specifically
 */
export function readProfileFlashInfo(): FlashInfo | null {
  return readAndClearFlashCookie('profileFlashInfo');
}