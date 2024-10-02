import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';
import { stringify } from 'qs';

class NetworkAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.apiv1;
    this.config = context.config;
    this.context = context;
  }

  willSendRequest(_path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL);
  }

  async searchNetworks({ query }) {
    return this.get('/network', stringify(query, { indices: false }));
  }

  async getNetworkByKey({ key }) {
    return this.get(`/network/${key}`);
  }

  async getConstituents({ key, query }) {
    return this.get(
      `/network/${key}/constituents`,
      stringify(query, { indices: false }),
    );
  }

  async getOrganizations({ key, query }) {
    return this.get(
      `/network/${key}/organization`,
      stringify(query, { indices: false }),
    );
  }

}

export default NetworkAPI;
