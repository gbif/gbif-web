/**
 * The value is put in the x-gbif-user header and the signed string. Real accounts include old
 * ones named after their email address, so this is not the signup pattern. It rejects what can't
 * be sent or signed as a user:
 * - non-strings, blank values and values over 255 characters
 * - surrounding whitespace, which fetch trims from the header but which would still be signed
 * - anything outside printable Latin-1 (control characters, and characters above U+00FF, which
 *   fetch refuses to put in a header)
 * - the app's own key, which would make the request run as the app without asApp
 *
 * A copy of this check lives in packages/graphql-api/src/helpers/auth/userHeader.js. Keep them the
 * same.
 */
export function isValidUserHeader(userName, appKey) {
  return (
    typeof userName === 'string' &&
    userName !== '' &&
    userName.length <= 255 &&
    userName === userName.trim() &&
    /^[\u0020-\u007e\u00a0-\u00ff]+$/.test(userName) &&
    !isAppKey(userName, appKey)
  );
}

function isAppKey(userName, appKey) {
  return (
    typeof appKey === 'string' &&
    appKey.trim() !== '' &&
    userName.trim().toLowerCase() === appKey.trim().toLowerCase()
  );
}
