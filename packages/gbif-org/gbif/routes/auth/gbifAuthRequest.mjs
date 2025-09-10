import crypto from 'crypto';
import { fetchWithRetry } from './utils.mjs';
import { secretEnv } from '../../envConfig.mjs';

const appKey = secretEnv.APP_KEY;
const secret = secretEnv.APP_SECRET;
const NEWLINE = '\n';

export class RequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

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

  let hasJsonBody = options.body && typeof options.body === 'object';
  let headers = createHeader(options);
  signHeader(options.method, headers, hasJsonBody);

  let fetchOptions = {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const response = await fetchWithRetry(options.url, fetchOptions);

  if (!response.ok) {
    let responseText;
    try {
      responseText = await response.text();
    } catch (error) {
      throw new RequestError('FAILED', response.status);
    }

    let errorObj;
    try {
      errorObj = JSON.parse(responseText);
    } catch (parseError) {
      throw new RequestError(responseText || 'FAILED', response.status);
    }
    throw new RequestError(errorObj?.error ?? 'FAILED', response.status);
  }

  let body;
  try {
    body = await response.json();
  } catch (error) {
    // ignore error
  }
  if (body === null) {
    try {
      body = await response.text();
    } catch (error) {
      // ignore error
    }
  }
  return { body, statusCode: response.status };
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
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function signHeader(method, headers, hasJsonBody) {
  let stringToSign = method + NEWLINE + headers['x-url'];
  if (headers['Content-MD5']) {
    if (hasJsonBody) {
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
