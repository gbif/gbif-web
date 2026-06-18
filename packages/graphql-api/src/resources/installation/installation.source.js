import { getDefaultAgent } from '@/requestAgents';
import { RESTDataSource } from '@/RESTDataSource';
import { stringify } from 'qs';

class InstallationAPI extends RESTDataSource {
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

  async searchInstallations({ query }) {
    return this.get('/installation', stringify(query, { indices: false }));
  }

  async getInstallationByKey({ key }) {
    return this.get(`/installation/${key}`);
  }

  async getDatasets({ key, query }) {
    return this.get(
      `/installation/${key}/dataset`,
      stringify(query, { indices: false }),
    );
  }
}

export default InstallationAPI;
