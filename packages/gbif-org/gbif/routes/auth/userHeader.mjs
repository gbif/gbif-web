/**
 * The value is put in the x-gbif-user header and the signed string. Real accounts include old
 * ones named after their email address, so only what can't be a user name is rejected: non-strings,
 * blank values, very long values and control characters.
 */
export function isValidUserHeader(userName) {
  return (
    typeof userName === 'string' &&
    userName.trim() !== '' &&
    userName.length <= 255 &&
    !/[\u0000-\u001f\u007f]/.test(userName)
  );
}
