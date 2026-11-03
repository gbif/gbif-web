// Throw if a request path could resolve outside the prefix it was built with.
//
// The WHATWG URL parser (used by `new URL()`) climbs a level for every "." or
// ".." segment, and it also:
//   - treats "\" as a path separator for http(s) URLs, and
//   - silently removes tab, CR and LF characters before parsing, so ".\t." is "..".
// So we reject raw backslashes and control characters outright, and reject any
// segment that is "." or ".." once percent decoded. Encoded slashes are allowed,
// since some keys (e.g. event ids) are legitimately encoded with
// encodeURIComponent and can contain them; the URL parser does not split on them.
// eslint-disable-next-line no-control-regex
const UNSAFE_CHARACTERS = /[\\\u0000-\u001f\u007f]/;

function assertSafeUpstreamPath(path) {
  const pathOnly = String(path).split(/[?#]/, 1)[0];
  if (UNSAFE_CHARACTERS.test(pathOnly)) {
    throw new Error('Invalid characters in upstream request path');
  }
  pathOnly.split('/').forEach((segment) => {
    let decoded = segment;
    try {
      decoded = decodeURIComponent(segment);
    } catch (err) {
      // malformed encoding: check the raw segment only
    }
    if (decoded === '.' || decoded === '..') {
      throw new Error('Path traversal is not allowed in upstream request paths');
    }
  });
}

export { assertSafeUpstreamPath };
export default assertSafeUpstreamPath;
