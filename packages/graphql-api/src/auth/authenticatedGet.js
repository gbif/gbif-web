'use strict';
const env = require('../config');
const got = require('got');
const querystring = require('querystring');
const crypto = require('crypto');
const NEWLINE = '\n';

const appKey = env.appKey;
const appSecret = env.appSecret;
const API_V1 = env.apiv1;

async function authenticatedGet({ canonicalPath, query }) {
    // https://github.com/gbif/gbif-common-ws/blob/master/src/main/java/org/gbif/ws/security/GbifAuthService.java

    const searchParams = querystring.stringify(query)

    let headers = createHeader({ canonicalPath });
    signHeader('GET', headers);

    const response = await got(canonicalPath, {
        prefixUrl: API_V1,
        searchParams,
        headers,
        responseType: 'json'
    });

    return response.body;
}

function createHeader({ canonicalPath }) {
    let headers = {};
    headers['x-url'] = canonicalPath;
    headers['x-gbif-user'] = appKey;
    return headers;
}

function signHeader(method, headers) {
    let stringToSign = method + NEWLINE + headers['x-url'];
    stringToSign += NEWLINE + headers['x-gbif-user'];
    let signature = crypto.createHmac('sha1', appSecret).update(stringToSign).digest('base64');
    headers.Authorization = 'GBIF ' + appKey + ':' + signature;
}

function createSignedGetHeader(canonicalPath) {
    let headers = createHeader({ canonicalPath });
    signHeader('GET', headers);
    return headers;
}

module.exports = {
    authenticatedGet,
    createSignedGetHeader
}