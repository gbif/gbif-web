// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const API_V1 = config.API_V1;

class NetworkAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchNetworks({ query }) {
    return this.get('/network', query);
  }

  async getNetworkByKey({ key }) {
    return this.get(`/network/${key}`);
  }

  async getConstituents({ key, query }) {
    return this.get(`/network/${key}/constituents`, query);
  }
}

module.exports = NetworkAPI;