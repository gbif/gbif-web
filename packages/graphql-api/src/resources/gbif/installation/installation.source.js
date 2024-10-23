import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class InstallationAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
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
