import { getDefaultAgent } from '@/requestAgents';
import { RESTDataSource } from '@/RESTDataSource';
import { stringify } from 'qs';

class OrganizationAPI extends RESTDataSource {
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

  async searchOrganizations({ query }) {
    return this.get('/organization', stringify(query, { indices: false }));
  }

  async getOrganizationByKey({ key }) {
    return this.get(`/organization/${key}`);
  }

  getOrganizationsByKeys({ organizationKeys }) {
    return Promise.all(
      organizationKeys.map((key) => this.getOrganizationByKey({ key })),
    );
  }

  async getHostedDatasets({ key, query }) {
    return this.get(
      `/organization/${key}/hostedDataset`,
      stringify(query, { indices: false }),
    );
  }

  async getPublishedDatasets({ key, query }) {
    return this.get(
      `/organization/${key}/publishedDataset`,
      stringify(query, { indices: false }),
    );
  }

  async getInstallations({ key, query }) {
    return this.get(
      `/organization/${key}/installation`,
      stringify(query, { indices: false }),
    );
  }
}

export default OrganizationAPI;
