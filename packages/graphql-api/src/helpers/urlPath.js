import { UnsafeUpstreamPathError } from './assertSafeUpstreamPath';

// Build an upstream request path from a template literal, encoding every
// interpolated value so it is always exactly one path segment:
//
//   this.get(urlPath`/directory/person/${key}`)
//
// encodeURIComponent encodes "/", "\", "?", "#", ";", "%", spaces and control
// characters, but leaves "." alone, so "." and ".." are rejected here, and so is
// an empty value (which would point the request at a different endpoint).
//
// Values containing "/" or "\" are rejected too, even though they would be
// encoded: some servers and proxies decode "%2F" back into a separator. None of
// the keys we put in paths need them. A value that legitimately contains a slash
// (e.g. an event id) has to be handled explicitly at its call site.
//
// Only put values in the slots. Fixed parts such as a base URL from config belong
// in the template text, or in the data source's baseURL.
function encodePathSegment(value) {
  if (value === undefined || value === null) {
    throw new UnsafeUpstreamPathError('Missing value in upstream request path');
  }
  const text = String(value);
  if (/[/\\]/.test(text)) {
    throw new UnsafeUpstreamPathError('Invalid value in upstream request path');
  }
  let segment;
  try {
    segment = encodeURIComponent(text);
  } catch (err) {
    // a lone surrogate (possible in JSON input) makes encodeURIComponent throw
    throw new UnsafeUpstreamPathError('Invalid value in upstream request path');
  }
  if (segment === '' || segment === '.' || segment === '..') {
    throw new UnsafeUpstreamPathError('Invalid value in upstream request path');
  }
  return segment;
}

function urlPath(strings, ...values) {
  return strings.reduce(
    (path, text, i) => (i < values.length ? path + text + encodePathSegment(values[i]) : path + text),
    '',
  );
}

// Split a DOI (e.g. "10.15468/dd.abc123") into its prefix and suffix, for the
// upstream endpoints that take a DOI as two path segments. Returns null unless it
// is a DOI with a single "/" between prefix and suffix.
const DOI_PARTS = /^(10\.\d{4,9})\/([^/\s]+)$/;
function splitDoi(doi) {
  const match = DOI_PARTS.exec(String(doi ?? ''));
  return match ? { prefix: match[1], suffix: match[2] } : null;
}

export { urlPath, encodePathSegment, splitDoi };
export default urlPath;
