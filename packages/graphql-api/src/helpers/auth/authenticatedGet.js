import axios from 'axios';
import { signingUser } from './userHeader';
import { gbifAuthHeaders } from './gbifSignature';

/**
 * @param {string | URL} url the absolute URL the request is sent to, with its query string. The
 *   signature covers the query string, so the request must be sent to exactly this URL.
 * @param {{ appKey: string, appSecret: string }} config
 * @param {{ userName: string } | { asApp: true }} identity who the request acts as. Signing as the
 *   app has to be asked for explicitly.
 */
function createSignedGetHeader(url, config, identity) {
  return gbifAuthHeaders({
    method: 'GET',
    url: String(url),
    user: signingUser(identity, config.appKey),
    appKey: config.appKey,
    appSecret: config.appSecret,
  });
}

async function authenticatedGet({ canonicalPath, query = {}, config }) {
  // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java
  // kept as a string, so the signer sees the path as it is written here and can refuse one that
  // the URL parser would rewrite
  const params = new URLSearchParams(query).toString();
  const url = `${config.apiv1.replace(/\/+$/, '')}/${canonicalPath.replace(/^\/+/, '')}${params ? `?${params}` : ''}`;
  const headers = createSignedGetHeader(url, config, { asApp: true });

  const response = await axios.get(url, {
    headers,
    responseType: 'json',
  });

  return response.data;
}

export { authenticatedGet, createSignedGetHeader };
