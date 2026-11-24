import { createHmac } from 'crypto';
import axios from 'axios';
import { signingUser } from './userHeader';

const NEWLINE = '\n';

const createHeader = ({ canonicalPath, appKey, identity }) => ({
  'x-url': canonicalPath,
  'x-gbif-user': signingUser(identity, appKey),
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

/**
 * @param {string} canonicalPath
 * @param {{ appKey: string, appSecret: string }} config
 * @param {{ userName: string } | { asApp: true }} identity who the request acts as. Signing as the
 *   app has to be asked for explicitly.
 */
function createSignedGetHeader(canonicalPath, config, identity) {
  return signHeader(
    'GET',
    createHeader({ canonicalPath, appKey: config.appKey, identity }),
    config.appKey,
    config.appSecret,
  );
}

async function authenticatedGet({ canonicalPath, query = {}, config }) {
  // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java
  const headers = createSignedGetHeader(canonicalPath, config, { asApp: true });

  const response = await axios.get(canonicalPath, {
    baseURL: config.apiv1,
    params: query,
    headers,
    responseType: 'json',
  });

  return response.data;
}

export { authenticatedGet, createSignedGetHeader };
