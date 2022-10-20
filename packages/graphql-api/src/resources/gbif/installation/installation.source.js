// const { ApolloError } = require('apollo-server');
import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class InstallationAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.gbif.apivg;
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
