#!/usr/bin/env node
/**
 * Stand-alone check of the signed download request the portal sends to the GBIF API.
 *
 * It builds the same POST as createDownload() in gbif/routes/user/user.model.mjs, signs it the way
 * gbif/routes/auth/gbifSignature.mjs does (gbif-common-ws 2.1.4 scheme), sends it, and prints
 * everything: the string that was signed, the headers, and the full response. It has no
 * dependencies and does not import anything from the portal, so it can be handed to the backend
 * team as it is. Node 18 or later.
 *
 * NOTE: this creates a REAL download for GBIF_USER on whatever API_URL points at (use DRY_RUN=1
 * to only print the request).
 *
 * Usage:
 *   APP_KEY=... APP_SECRET=... GBIF_USER=... node debug-download-request.mjs
 *
 * Environment:
 *   APP_KEY, APP_SECRET  the portal's app credentials (the same as the portal's APP_KEY/APP_SECRET)
 *   GBIF_USER            the GBIF user the download is created for (x-gbif-user and "creator")
 *   API_URL              default https://api.gbif-test.org/v1/occurrence/download/request/
 *                        Use the portal's PUBLIC_API_V1 + /occurrence/download/request/
 *   SOURCE               optional, adds ?source=... as the portal does when it is set
 *   EMAIL                optional, put in notificationAddresses as the portal does
 *   SCHEME               "v2" (default, what the portal sends now) or "legacy" (what the portal
 *                        sent before 8209e6b: HMAC-SHA1, no date, relative x-url). Running both
 *                        shows whether the server only accepts one of them.
 *   DRY_RUN=1            print the request, do not send it
 */
import { createHash, createHmac } from 'node:crypto';

const NEWLINE = '\n';

// ---------------------------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------------------------
const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;
const user = process.env.GBIF_USER;
const scheme = process.env.SCHEME ?? 'v2';
const dryRun = process.env.DRY_RUN === '1';
const source = process.env.SOURCE;
const email = process.env.EMAIL;
let url = process.env.API_URL ?? 'https://api.gbif-test.org/v1/occurrence/download/request/';
if (source) url += '?source=' + encodeURIComponent(source);

if (!['v2', 'legacy'].includes(scheme)) fail('SCHEME must be "v2" or "legacy"');
if (!appKey || !appSecret || !user) {
  fail('Set APP_KEY, APP_SECRET and GBIF_USER (see the comment at the top of this file)');
}

// ---------------------------------------------------------------------------------------------
// The body: the same filters as the failing request, in the order createDownload() puts them.
// undefined values are dropped by JSON.stringify, exactly as in the portal.
// ---------------------------------------------------------------------------------------------
const checklistKey = '7ddf754f-d193-4cc9-b351-99906754a03b';
const requestBody = JSON.stringify({
  creator: user,
  notificationAddresses: email ? [email] : undefined,
  sendNotification: true,
  format: 'SIMPLE_CSV',
  predicate: {
    type: 'and',
    predicates: [
      { type: 'in', key: 'OCCURRENCE_STATUS', values: ['DETECTED'] },
      { type: 'in', key: 'TAXON_KEY', values: ['4YKZX'], checklistKey },
      { type: 'in', key: 'COUNTRY', values: ['EC'] },
      { type: 'equals', key: 'YEAR', value: '2026', checklistKey },
    ],
  },
  sql: undefined,
  verbatimExtensions: [],
  checklistKey,
  machineDescription: undefined,
  description: undefined,
});

// ---------------------------------------------------------------------------------------------
// Signing, v2 (copy of gbif/routes/auth/gbifSignature.mjs)
// ---------------------------------------------------------------------------------------------
// As GbifAuthUtils#encode: RFC 3986, only A-Z a-z 0-9 - _ . ~ are left as they are.
function encode(value) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function decode(value) {
  return decodeURIComponent(value.replace(/\+/g, ' '));
}

function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function canonicalQuery(rawQuery) {
  if (!rawQuery) return '';
  return rawQuery
    .split('&')
    .filter((param) => param !== '')
    .map((param) => {
      const idx = param.indexOf('=');
      return idx < 0
        ? [decode(param), '']
        : [decode(param.slice(0, idx)), decode(param.slice(idx + 1))];
    })
    .sort(([n1, v1], [n2, v2]) => compare(n1, n2) || compare(v1, v2))
    .map(([name, value]) => `${encode(name)}=${encode(value)}`)
    .join('&');
}

function canonicalUrl(absoluteUrl) {
  const parsed = new URL(absoluteUrl);
  const path = decodeURIComponent(parsed.pathname);
  const query = canonicalQuery(parsed.search.slice(1));
  return query ? `${path}?${query}` : path;
}

function signV2({ method, url, user, body, contentType, date }) {
  const parsed = new URL(url);
  const headers = {
    'x-url': parsed.origin + parsed.pathname,
    'x-gbif-user': user,
    'x-gbif-date': date.toUTCString(),
  };
  const lines = [method, canonicalUrl(url)];
  if (contentType !== undefined) lines.push(contentType.toLowerCase());
  if (body !== undefined) {
    headers['Content-MD5'] = createHash('md5').update(body, 'utf8').digest('base64');
    lines.push(headers['Content-MD5']);
  }
  lines.push(user, headers['x-gbif-date']);
  const stringToSign = lines.join(NEWLINE);
  const signature = createHmac('sha256', appSecret).update(stringToSign, 'utf8').digest('base64');
  headers.Authorization = `GBIF ${appKey}:${signature}`;
  return { headers, stringToSign };
}

// ---------------------------------------------------------------------------------------------
// Signing, legacy (reconstructed from the portal code before 8209e6b): HMAC-SHA1, no date,
// x-url is the path relative to the API root ("occurrence/download/request/"), and the query
// string is not signed.
// ---------------------------------------------------------------------------------------------
function signLegacy({ method, url, user, body, contentType }) {
  const parsed = new URL(url);
  const apiRoot = parsed.pathname.indexOf('/occurrence/');
  const relativePath = apiRoot < 0 ? parsed.pathname.replace(/^\//, '') : parsed.pathname.slice(apiRoot + 1);
  const headers = { 'x-url': relativePath, 'x-gbif-user': user };
  const lines = [method, headers['x-url']];
  if (body !== undefined) {
    headers['Content-MD5'] = createHash('md5').update(body).digest('base64');
    lines.push(contentType, headers['Content-MD5']);
  }
  lines.push(user);
  const stringToSign = lines.join(NEWLINE);
  const signature = createHmac('sha1', appSecret).update(stringToSign).digest('base64');
  headers.Authorization = `GBIF ${appKey}:${signature}`;
  return { headers, stringToSign };
}

// ---------------------------------------------------------------------------------------------
// Build, show, send
// ---------------------------------------------------------------------------------------------
const signArgs = {
  method: 'POST',
  url,
  user,
  body: requestBody,
  contentType: 'application/json',
  date: new Date(),
};
const { headers: signedHeaders, stringToSign } =
  scheme === 'v2' ? signV2(signArgs) : signLegacy(signArgs);

const headers = {
  ...signedHeaders,
  'User-Agent': 'GBIF-portal',
  'Content-Type': 'application/json',
};

console.log(`Scheme:   ${scheme}`);
console.log(`Request:  POST ${url}`);
console.log('Signed string (each line is separated by a newline):');
console.log(stringToSign.split(NEWLINE).map((l) => '  | ' + l).join('\n'));
console.log('Headers (secret never printed):');
for (const [name, value] of Object.entries(headers)) {
  const shown = name === 'Authorization' ? `GBIF ${appKey}:${value.split(':')[1].slice(0, 6)}...` : value;
  console.log(`  ${name}: ${shown}`);
}
console.log(`Body (${Buffer.byteLength(requestBody)} bytes): ${requestBody}`);

if (dryRun) {
  console.log('\nDRY_RUN=1, nothing sent.');
  process.exit(0);
}

console.log('\nSending...');
const response = await fetch(url, { method: 'POST', headers, body: requestBody });
const text = await response.text();
console.log(`\nResponse: ${response.status} ${response.statusText}`);
for (const [name, value] of response.headers) console.log(`  ${name}: ${value}`);
console.log(`Body: ${text}`);

if (response.status === 201) {
  console.log(`\nOK: the API accepted the signed request. Download key: ${text}`);
} else if (response.status === 401) {
  console.log(
    '\nThe API rejected the signature (401). Compare the "Signed string" above with what the' +
      ' server computes, and check which gbif-common-ws version that API runs.'
  );
  process.exitCode = 1;
} else {
  process.exitCode = 1;
}

function fail(message) {
  console.error(message);
  process.exit(2);
}
