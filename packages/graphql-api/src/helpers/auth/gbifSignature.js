import { createHash, createHmac } from 'crypto';

/**
 * Signing for the GBIF Authorization scheme, as checked by GbifAuthServiceImpl in gbif-common-ws
 * 2.1.4 and later. The scheme is described in the gbif-common-ws README, "GBIF request signing".
 *
 * A copy of this file lives in packages/gbif-org/gbif/routes/auth/gbifSignature.mjs. Keep them the
 * same.
 */

const NEWLINE = '\n';

// As GbifAuthUtils#encode: RFC 3986, only A-Z a-z 0-9 - _ . ~ are left as they are.
function encode(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function decode(value) {
  return decodeURIComponent(value.replace(/\+/g, ' '));
}

function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * The canonical form of a raw query string (without the leading "?"): parameters are decoded,
 * sorted by name and then value, and encoded again. As GbifAuthUtils#getCanonicalizedQuery.
 */
export function canonicalQuery(rawQuery) {
  if (!rawQuery) return '';
  return rawQuery
    .split('&')
    .filter((param) => param !== '')
    .map((param) => {
      const idx = param.indexOf('=');
      return idx < 0 ? [decode(param), ''] : [decode(param.slice(0, idx)), decode(param.slice(idx + 1))];
    })
    .sort(([n1, v1], [n2, v2]) => compare(n1, n2) || compare(v1, v2))
    .map(([name, value]) => `${encode(name)}=${encode(value)}`)
    .join('&');
}

/**
 * The URL as it is signed: the decoded path of the request URL, followed by the canonical form of
 * the query string actually sent.
 *
 * @param {string} url the absolute URL the request is sent to
 */
export function canonicalUrl(url) {
  const parsed = new URL(url);
  const path = decodeURIComponent(parsed.pathname);
  const query = canonicalQuery(parsed.search.slice(1));
  return query ? `${path}?${query}` : path;
}

/**
 * Throws unless the path of the URL, as it is written, is the path that will be requested. The URL
 * parser resolves "." and ".." segments (percent encoded or not), treats "\" as "/" and drops tabs
 * and line breaks, so a value interpolated into the path could otherwise move a signed request to
 * another endpoint, such as /admin/user. Callers validate what they put in a path; this is the
 * check that holds if one of them doesn't.
 *
 * @param {string} url the URL as the caller wrote it, before it is parsed
 */
export function assertPathIsNotRewritten(url) {
  // eslint-disable-next-line no-control-regex
  const path = url.replace(/^[\u0000- ]+|[\u0000- ]+$/g, '').split(/[?#]/, 1)[0];
  // eslint-disable-next-line no-control-regex
  if (/[\\\u0000-\u001f\u007f]/.test(path)) {
    throw new Error('Refusing to sign a URL with a backslash or control character in its path');
  }
  path.split('/').forEach((segment) => {
    let decoded = segment;
    try {
      decoded = decodeURIComponent(segment);
    } catch (err) {
      // malformed encoding: the raw segment is checked
    }
    if (decoded === '.' || decoded === '..') {
      throw new Error('Refusing to sign a URL with a "." or ".." segment in its path');
    }
  });
}

/**
 * The headers that sign a request: x-url, x-gbif-user, x-gbif-date, Content-MD5 when there is a
 * body, and Authorization. The signature covers the method, the URL with its query string, the
 * content type, the body, the user and the date, so every value must be exactly the one sent.
 *
 * @param {object} request
 * @param {string} request.method
 * @param {string} request.url the absolute URL the request is sent to, with its query string,
 *   exactly as it is given to the HTTP client
 * @param {string} request.user the user the request acts as
 * @param {string} [request.body] the body exactly as sent
 * @param {string} [request.contentType] the Content-Type header, when one is sent
 * @param {string} request.appKey
 * @param {string} request.appSecret
 * @param {Date} [request.date] when the request is signed, now by default
 */
export function gbifAuthHeaders({ method, url, user, body, contentType, appKey, appSecret, date = new Date() }) {
  assertPathIsNotRewritten(url);
  const parsed = new URL(url);
  const headers = {
    'x-url': parsed.origin + parsed.pathname,
    'x-gbif-user': user,
    'x-gbif-date': date.toUTCString(),
  };
  const lines = [method, canonicalUrl(url)];
  if (contentType !== undefined) {
    lines.push(contentType.toLowerCase());
  }
  if (body !== undefined) {
    headers['Content-MD5'] = createHash('md5').update(body, 'utf8').digest('base64');
    lines.push(headers['Content-MD5']);
  }
  lines.push(user, headers['x-gbif-date']);
  const signature = createHmac('sha256', appSecret).update(lines.join(NEWLINE), 'utf8').digest('base64');
  headers.Authorization = `GBIF ${appKey}:${signature}`;
  return headers;
}
