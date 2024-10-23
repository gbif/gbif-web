import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class NodeAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
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
    return this.get(`/node/country/${countryCode}`);
  }
}

export default NodeAPI;
