import { createHmac } from 'crypto';
import axios from 'axios';

const NEWLINE = '\n';

const createHeader = ({ canonicalPath, appKey, username }) => ({
  'x-url': canonicalPath,
  'x-gbif-user': username ?? appKey,
});

function signHeader(method, headers, appKey, appSecret) {
  let stringToSign = method + NEWLINE + headers['x-url'];
  stringToSign += NEWLINE + headers['x-gbif-user'];
  const signature = createHmac('sha1', appSecret)
    .update(stringToSign)
    .digest('base64');
  // eslint-disable-next-line no-param-reassign
  headers.Authorization = `GBIF ${appKey}:${signature}`;
  return headers;
}

function createSignedGetHeader(canonicalPath, config, username) {
  return signHeader(
    'GET',
    createHeader({ canonicalPath, appKey: config.appKey, username }),
    config.appKey,
    config.appSecret,
  );
}

async function authenticatedGet({ canonicalPath, query = {}, config }) {
  // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java
  const headers = createSignedGetHeader(canonicalPath, config);

  const response = await axios.get(canonicalPath, {
    baseURL: config.apiv1,
    params: query,
    headers,
    responseType: 'json',
  });

  return response.data;
}

export { authenticatedGet, createSignedGetHeader };
