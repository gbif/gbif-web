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
    request.headers['referer'] = this.context.referer;
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
