import { NotFoundError } from '@/helpers/GraphQL404Error';
import { createSignedGetHeader } from '@/helpers/auth/authenticatedGet';
import { getDefaultAgent } from '@/requestAgents';
import { RESTDataSource } from '@/RESTDataSource';
import pick from 'lodash/pick';
import { stringify } from 'qs';

export class NodeAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers['referer'] = this.context.referer;
    if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
    if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
    if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async searchNodes({ query }) {
    return this.get('/node', stringify(query, { indices: false }));
  }

  async getNodeByKey({ key }) {
    return this.get(`/node/${key}`);
  }

  async getEndorsedOrganizations({ key, query }) {
    return this.get(
      `/node/${key}/organization`,
      stringify(query, { indices: false }),
    );
  }

  async getOrganizationsPendingEndorsement({ key, query }) {
    return this.get(
      `/node/${key}/pendingEndorsement`,
      stringify(query, { indices: false }),
    );
  }

  async getDatasets({ key, query }) {
    return this.get(
      `/node/${key}/dataset`,
      stringify(query, { indices: false }),
    );
  }

  async getInstallations({ key, query }) {
    return this.get(
      `/node/${key}/installation`,
      stringify(query, { indices: false }),
    );
  }

  async getNodeByCountryCode({ countryCode }) {
    const response = await this.get(`/node/country/${countryCode}`);
    // Will happen if a status of 204 (no content) is returned. Might also happen in other cases, the docs are unclear.
    if (response === '') throw new NotFoundError();
    return response;
  }
}

/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */
export class NodeDirectoryAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(path, request) {
    const header = createSignedGetHeader(path, this.config);
    Object.keys(header).forEach((x) => { request.headers[x] = header[x]; });
    request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers['referer'] = this.context.referer;
    if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
    if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
    if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  /*
   * The schemas already limits what is public, but to make it more difficult to
   * add something, we also sanitize the data before returning it.
   */
  // eslint-disable-next-line class-methods-use-this
  reduceNode(node) {
    return pick(node, ['deleted', 'nodeUrl']);
  }

  async getNodeByKey({ key }) {
    const node = await this.get(`/directory/node/${key}`);
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    return this.reduceNode(node);
  }
}
