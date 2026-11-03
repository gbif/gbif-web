import { GraphQLError } from 'graphql';

// Thrown when a request path is rejected. It carries a 400 status so it is not
// retried as if it were a network error, and is reported as bad user input.
class UnsafeUpstreamPathError extends GraphQLError {
  constructor(message = 'Invalid upstream request path') {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: { status: 400 },
      },
    });
  }
}

// The WHATWG URL parser (used by `new URL()`) climbs a level for every "." or
// ".." segment, and before parsing it also:
//   - trims leading and trailing spaces and control characters from the input,
//     so a path ending in ".. " ends in "..",
//   - removes tab, CR and LF characters anywhere, so ".\t." is "..", and
//   - treats "\" as a path separator for http(s) URLs.
// So we reject raw backslashes and control characters outright, trim the ends
// the same way the parser does, and reject any segment that is "." or ".." once
// percent decoded. Encoded slashes are allowed, since some keys (e.g. event ids)
// are legitimately encoded with encodeURIComponent and can contain them; the URL
// parser does not split on them.
// eslint-disable-next-line no-control-regex
const UNSAFE_CHARACTERS = /[\\\u0000-\u001f\u007f]/;
// eslint-disable-next-line no-control-regex
const TRIMMED_BY_PARSER = /^[\u0000- ]+|[\u0000- ]+$/g;

function assertSafeUpstreamPath(path) {
  const trimmed = String(path).replace(TRIMMED_BY_PARSER, '');
  const pathOnly = trimmed.split(/[?#]/, 1)[0];
  if (UNSAFE_CHARACTERS.test(pathOnly)) {
    throw new UnsafeUpstreamPathError('Invalid characters in upstream request path');
  }
  pathOnly.split('/').forEach((segment) => {
    let decoded = segment;
    try {
      decoded = decodeURIComponent(segment);
    } catch (err) {
      // malformed encoding: check the raw segment only
    }
    if (decoded === '.' || decoded === '..') {
      throw new UnsafeUpstreamPathError('Path traversal is not allowed in upstream request paths');
    }
  });
}

// A path that starts with a scheme ("https:", "http:", ...) is an absolute URL
// chosen by the data source itself. Anything else is relative to the baseURL.
function isAbsoluteUrl(path) {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(String(path));
}

// Throw unless `url` is on the same origin as `baseURL` and inside its path.
// Catches relative paths that the parser turns into another host ("//host",
// "/http://host") or that leave the base path ("/admin" against ".../v1/").
function assertWithinBaseURL(url, baseURL) {
  const base = new URL(baseURL);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
    throw new UnsafeUpstreamPathError('Upstream request path resolves outside the base URL');
  }
}

export { assertSafeUpstreamPath, assertWithinBaseURL, isAbsoluteUrl, UnsafeUpstreamPathError };
export default assertSafeUpstreamPath;
