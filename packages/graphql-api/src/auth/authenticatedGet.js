const env = require('../config');
const got = require('got');
const querystring = require('querystring');
const crypto = require('crypto');

const { appKey, appSecret, apiv1: API_V1 } = env;

const createHeader = () => ({
  'x-url': canonicalPath,
  'x-gbif-user': appKey,
});

function signHeader(method, headers) {
  const stringToSign = `${method}\n${headers['x-url']}\n${headers['x-gbif-user']}`;
  const signature = crypto
    .createHmac('sha1', appSecret)
    .update(stringToSign)
    .digest('base64');
  headers.Authorization = `GBIF ${appKey}:${signature}`;
}

async function authenticatedGet({ canonicalPath, query }) {
  // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java

  const searchParams = querystring.stringify(query);

  const headers = createHeader({ canonicalPath });
  signHeader('GET', headers);

  const response = await got(canonicalPath, {
    prefixUrl: API_V1,
    searchParams,
    headers,
    responseType: 'json',
  });

  return response.body;
}

function createSignedGetHeader(canonicalPath) {
  const headers = createHeader({ canonicalPath });
  signHeader('GET', headers);
  return headers;
}

module.exports = {
  authenticatedGet,
  createSignedGetHeader,
};
