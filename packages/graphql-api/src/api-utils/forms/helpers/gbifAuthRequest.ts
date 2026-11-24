import crypto from 'node:crypto';
import logger from '@/logger';
import request from './request';
import { z } from 'zod';
import config from '@/config';
import { signingUser } from '@/helpers/auth/userHeader';

const NEWLINE = '\n';

// Thrown when an upstream call answers with an unexpected status. It keeps only
// the status code and body: the full response holds the signed request headers
// (Authorization, x-gbif-user), which must not end up in the logs.
export class UnexpectedResponseError extends Error {
  statusCode: number;
  body: unknown;

  constructor(message: string, response: { statusCode: number; body?: unknown }) {
    super(message);
    this.name = 'UnexpectedResponseError';
    this.statusCode = response.statusCode;
    this.body = response.body;
  }
}

export async function authenticatedRequest(options: any) {
  // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java
  validateOptions(options);
  const headers = createSignedHeaders(options);

  const requestOptions: any = {
    maxAttempts: 5, // (default) try 5 times
    retryDelay: 5000, // (default) wait for 5s before trying again
    fullResponse: true,
    method: options.method,
    url: options.url,
  };

  if (options.body) {
    requestOptions.json = options.body;
  }

  if (requestOptions.method == 'GET' && expectJson(options)) {
    requestOptions.json = true;
  }

  requestOptions.headers = headers;

  const response = await request(requestOptions);
  return response;
}

function expectJson(options: any) {
  return typeof options.json === 'undefined' || options.json;
}

/**
 * The signed headers for a request. Exported for tests. Throws, before anything is sent, unless the
 * options name a valid userName or ask for asApp: true.
 */
export function createSignedHeaders(options: any) {
  const headers = createHeader(options, signingUser(options, config.appKey));
  signHeader(options.method, headers, expectJson(options));
  return headers;
}

function createHeader(options: any, gbifUser: string) {
  const headers: Record<string, string> = {};
  headers['x-url'] = options.canonicalPath || options.url;
  headers['x-gbif-user'] = gbifUser;
  if (options.method == 'POST' || options.method == 'PUT') {
    headers['Content-MD5'] = crypto
      .createHash('md5')
      .update(JSON.stringify(options.body))
      .digest('base64');
  }
  return headers;
}

function signHeader(
  method: Method,
  headers: Record<string, string>,
  isJson: boolean,
) {
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
  let signature = crypto
    .createHmac('sha1', config.appSecret)
    .update(stringToSign)
    .digest('base64');
  headers.Authorization = 'GBIF ' + config.appKey + ':' + signature;
}

type Method = z.infer<typeof OptionsSchema>['method'];

const OptionsSchema = z.union([
  z.object({
    method: z.enum(['GET', 'DELETE']),
    url: z.string(),
  }),
  z.object({
    method: z.enum(['POST', 'PUT']),
    url: z.string(),
    body: z.object({}),
    canonicalPath: z.string(),
  }),
]);

function validateOptions(options: any) {
  const result = OptionsSchema.safeParse(options);
  if (!result.success) {
    logger.error({
      message: 'Invalid options for authenticatedRequest',
      options,
    });
    throw new Error(result.error.errors.join('\n'));
  }
}
