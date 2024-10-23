import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class OrganizationAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
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
