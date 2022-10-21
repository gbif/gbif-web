import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class NodeAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.gbif.apiv1;
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
}

export default NodeAPI;
