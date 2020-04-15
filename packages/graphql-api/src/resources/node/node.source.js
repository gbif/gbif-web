// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const API_V1 = config.API_V1;

class NodeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchNodes({ query }) {
    return this.get('/node', query);
  }

  async getNodeByKey({ key }) {
    return this.get(`/node/${key}`);
  }

  async getEndorsedOrganizations({ key, query }) {
    return this.get(`/node/${key}/organization`, query);
  }

  async getOrganizationsPendingEndorsement({ key, query }) {
    return this.get(`/node/${key}/pendingEndorsement`, query);
  }

  async getDatasets({ key, query }) {
    return this.get(`/node/${key}/dataset`, query);
  }

  async getInstallations({ key, query }) {
    return this.get(`/node/${key}/installation`, query);
  }
}

module.exports = NodeAPI;