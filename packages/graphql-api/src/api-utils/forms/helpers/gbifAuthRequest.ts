import logger from '@/logger';
import request from './request';
import { z } from 'zod';
import config from '@/config';
import { signingUser } from '@/helpers/auth/userHeader';
import { gbifAuthHeaders } from '@/helpers/auth/gbifSignature';

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
  const hasBody = options.method == 'POST' || options.method == 'PUT';
  return gbifAuthHeaders({
    method: options.method,
    url: options.url,
    user: signingUser(options, config.appKey),
    // the request is sent with `json: body`, which serializes it with JSON.stringify and sets this
    // content type
    body: hasBody ? JSON.stringify(options.body) : undefined,
    contentType: hasBody ? 'application/json' : undefined,
    appKey: config.appKey,
    appSecret: config.appSecret,
  });
}

const OptionsSchema = z.union([
  z.object({
    method: z.enum(['GET', 'DELETE']),
    url: z.string(),
  }),
  z.object({
    method: z.enum(['POST', 'PUT']),
    url: z.string(),
    body: z.object({}),
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
