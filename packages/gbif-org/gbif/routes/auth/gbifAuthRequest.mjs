import crypto from 'crypto';
import dotenv from 'dotenv';
import { fetchWithRetry } from './utils.mjs';

dotenv.config();

const appKey = process.env.APP_KEY;
const secret = process.env.APP_SECRET;
const NEWLINE = '\n';

export async function authenticatedRequest(options) {
  // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java
  if (typeof options !== 'object' || options === null) {
    throw new Error('Options must be an object');
  }
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(options.method)) {
    throw new Error('Invalid request method');
  }
  if (typeof options.url !== 'string') {
    throw new Error('URL must be a string');
  }
  if (
    (options.method === 'POST' || options.method === 'PUT') &&
    (typeof options.canonicalPath !== 'string' || typeof options.body !== 'object')
  ) {
    throw new Error('POST/PUT requests require a canonicalPath (string) and body (object)');
  }

  let expectJSON = options.json !== false;
  let headers = createHeader(options);
  signHeader(options.method, headers, expectJSON);

  let fetchOptions = {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    retries: 5,
    retryDelay: 5000,
  };

  let response = await fetchWithRetry(options.url, fetchOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  try {
    return expectJSON ? await response.json() : await response.text();
  } catch (error) {
    throw new Error('Failed to parse response');
  }
}

function createHeader(options) {
  let headers = {};
  headers['x-url'] = options.canonicalPath || options.url;
  headers['x-gbif-user'] = options.userName || appKey;
  if (options.method == 'POST' || options.method == 'PUT') {
    headers['Content-MD5'] = crypto
      .createHash('md5')
      .update(JSON.stringify(options.body))
      .digest('base64');
  }
  return headers;
}

function signHeader(method, headers, isJson) {
  let stringToSign = method + NEWLINE + headers['x-url'];
  if (headers['Content-MD5']) {
    if (isJson) {
      stringToSign += NEWLINE + 'application/json';
    }
    stringToSign += NEWLINE + headers['Content-MD5'];
  }
  if (headers['x-gbif-user']) {
    stringToSign += NEWLINE + headers['x-gbif-user'];
  }
  let signature = crypto.createHmac('sha1', secret).update(stringToSign).digest('base64');
  headers.Authorization = 'GBIF ' + appKey + ':' + signature;
}
