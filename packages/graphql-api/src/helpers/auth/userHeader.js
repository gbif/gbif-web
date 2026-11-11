/**
 * Signed requests carry the identity they act as in the x-gbif-user header, and that value is part
 * of the signed string. Real accounts include old ones named after their email address, so only
 * what can't be a user name is rejected: non-strings, blank values, very long values and control
 * characters.
 */
export function isValidUserHeader(userName) {
  return (
    typeof userName === 'string' &&
    userName.trim() !== '' &&
    userName.length <= 255 &&
    !/[\u0000-\u001f\u007f]/.test(userName)
  );
}

/**
 * Works out who a signed request acts as. Signing as the app gives the app's own rights, so it has
 * to be asked for with `asApp: true` and never happens because a user name is missing.
 *
 * @param {{ userName?: unknown, asApp?: boolean }} identity
 * @param {string} appKey
 * @returns {string} the value for the x-gbif-user header
 */
export function signingUser(identity, appKey) {
  const { userName, asApp } = identity ?? {};
  if (asApp === true) {
    if (userName !== undefined) {
      throw new Error('Use either userName or asApp, not both');
    }
    return appKey;
  }
  if (!isValidUserHeader(userName)) {
    throw new Error('A signed request needs a valid userName, or asApp: true to run as the app');
  }
  return userName;
}
