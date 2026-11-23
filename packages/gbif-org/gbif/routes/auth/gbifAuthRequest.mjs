import { fetchWithRetry } from './utils.mjs';
import { secretEnv } from '../../envConfig.mjs';
import { isValidUserHeader } from './userHeader.mjs';
import { gbifAuthHeaders } from './gbifSignature.mjs';

const appKey = secretEnv.APP_KEY;
const secret = secretEnv.APP_SECRET;

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
    (typeof options.body !== 'object' || options.body === null)
  ) {
    throw new Error('POST/PUT requests require a body (object)');
  }
  // The request is signed either as a user or as the app itself. Signing as the app gives the app's
  // own rights, so that has to be asked for explicitly and never happens because a user name is
  // missing.
  if (options.asApp === true) {
    if (options.userName !== undefined) {
      throw new Error('Use either userName or asApp, not both');
    }
  } else if (!isValidUserHeader(options.userName, appKey)) {
    throw new Error('A request needs a valid userName, or asApp: true to run as the app');
  }

  const requestBody = options.body ? JSON.stringify(options.body) : undefined;
  const fetchOptions = {
    method: options.method,
    headers: createHeaders(options, requestBody),
    body: requestBody,
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

  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
    // it's JSON
  } catch {
    body = text;
    // it's plain text
  }
  return { body, statusCode: response.status };
}

function createHeaders(options, body) {
  const contentType = body === undefined ? undefined : 'application/json';
  const headers = gbifAuthHeaders({
    method: options.method,
    url: options.url,
    user: options.asApp === true ? appKey : options.userName,
    body,
    contentType,
    appKey,
    appSecret: secret,
  });
  headers['User-Agent'] = 'GBIF-portal';
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
}
