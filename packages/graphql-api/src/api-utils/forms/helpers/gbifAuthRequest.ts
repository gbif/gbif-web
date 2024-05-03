import crypto from 'node:crypto';
import logger from '#/logger';
import request from './request';
import { z } from 'zod';
import config from '#/config';

const NEWLINE = '\n';

export async function authenticatedRequest(options: any) {
  // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java
  validateOptions(options);

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

  const expectJSON = typeof options.json === 'undefined' || options.json;
  if (requestOptions.method == 'GET' && expectJSON) {
    requestOptions.json = true;
  }

  const headers = createHeader(options);
  signHeader(requestOptions.method, headers, expectJSON);
  requestOptions.headers = headers;

  const response = await request(requestOptions);
  return response;
}

function createHeader(options: any) {
  const headers: Record<string, string> = {};
  headers['x-url'] = options.canonicalPath || options.url;
  headers['x-gbif-user'] = options.userName || config.appKey;
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
