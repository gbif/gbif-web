// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class NodeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', `GBIF GraphQL API`);
  }

  async searchNodes({ query }) {
    return this.get('/node', qs.stringify(query, { indices: false }));
  }

  async getNodeByKey({ key }) {
    return this.get(`/node/${key}`);
  }

  async getEndorsedOrganizations({ key, query }) {
    return this.get(`/node/${key}/organization`, qs.stringify(query, { indices: false }));
  }

  async getOrganizationsPendingEndorsement({ key, query }) {
    return this.get(`/node/${key}/pendingEndorsement`, qs.stringify(query, { indices: false }));
  }

  async getDatasets({ key, query }) {
    return this.get(`/node/${key}/dataset`, qs.stringify(query, { indices: false }));
  }

  async getInstallations({ key, query }) {
    return this.get(`/node/${key}/installation`, qs.stringify(query, { indices: false }));
  }
}

module.exports = NodeAPI;