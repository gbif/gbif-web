// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class OrganizationAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', `GBIF GraphQL API`);
  }

  async searchOrganizations({ query }) {
    return this.get('/organization', qs.stringify(query, { indices: false }));
  }

  async getOrganizationByKey({ key }) {
    return this.get(`/organization/${key}`);
  }

  getOrganizationsByKeys({ organizationKeys }) {
    return Promise.all(
      organizationKeys.map(key => this.getOrganizationByKey({ key })),
    );
  }

  async getHostedDatasets({ key, query }) {
    return this.get(`/organization/${key}/hostedDataset`, qs.stringify(query, { indices: false }));
  }

  async getPublishedDatasets({ key, query }) {
    return this.get(`/organization/${key}/publishedDataset`, qs.stringify(query, { indices: false }));
  }

  async getInstallations({ key, query }) {
    return this.get(`/organization/${key}/installation`, qs.stringify(query, { indices: false }));
  }
}

module.exports = OrganizationAPI;