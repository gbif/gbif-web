// const { ApolloError } = require('apollo-server');
import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class NetworkAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.gbif.apiv1;
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
}

export default NetworkAPI;
