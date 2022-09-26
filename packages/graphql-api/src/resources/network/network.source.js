// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class NetworkAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', `GBIF GraphQL API`);
  }

  async searchNetworks({ query }) {
    return this.get('/network', qs.stringify(query, { indices: false }));
  }

  async getNetworkByKey({ key }) {
    return this.get(`/network/${key}`);
  }

  async getConstituents({ key, query }) {
    return this.get(`/network/${key}/constituents`, qs.stringify(query, { indices: false }));
  }
}

module.exports = NetworkAPI;