// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class InstallationAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchInstallations({ query }) {
    return this.get('/installation', qs.stringify(query, { indices: false }));
  }

  async getInstallationByKey({ key }) {
    return this.get(`/installation/${key}`);
  }

  async getDatasets({ key, query }) {
    return this.get(`/installation/${key}/dataset`, qs.stringify(query, { indices: false }));
  }
}

module.exports = InstallationAPI;