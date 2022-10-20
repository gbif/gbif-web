import got from 'got';
import { stringify } from 'querystring';
import { createHmac } from 'crypto';

const NEWLINE = '\n';

const createHeader = ({ canonicalPath }) => ({
  'x-url': canonicalPath,
  'x-gbif-user': appKey,
});

function signHeader(method, headers, appSecret) {
  let stringToSign = method + NEWLINE + headers['x-url'];
  stringToSign += NEWLINE + headers['x-gbif-user'];
  const signature = createHmac('sha1', appSecret)
    .update(stringToSign)
    .digest('base64');
  // eslint-disable-next-line no-param-reassign
  headers.Authorization = `GBIF ${appKey}:${signature}`;
}

function createSignedGetHeader(canonicalPath, config) {
  return signHeader(
    'GET',
    createHeader({ canonicalPath, appKey: config.appKey }),
    config.appSecret,
  );
}

async function authenticatedGet({ canonicalPath, query, config }) {
  // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java

  const searchParams = stringify(query);

  const headers = createHeader({ canonicalPath });
  signHeader('GET', headers);

  const response = await got(canonicalPath, {
    prefixUrl: config.apiv1,
    searchParams,
    headers,
    responseType: 'json',
  });

  return response.body;
}

export { authenticatedGet, createSignedGetHeader };
