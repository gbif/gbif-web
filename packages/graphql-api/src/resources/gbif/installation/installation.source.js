import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';
import { stringify } from 'qs';

class InstallationAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.apiv1;
    this.context = context;
  }

  willSendRequest(_path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL);
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
