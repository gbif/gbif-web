// const { ApolloError } = require('apollo-server');
import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class InstitutionAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.gbif.apiv1;
  }

  async searchInstitutions({ query }) {
    return this.get(
      '/grscicoll/institution',
      stringify(query, { indices: false }),
    );
  }

  async getInstitutionByKey({ key }) {
    return this.get(`/grscicoll/institution/${key}`);
  }

  /*
  getInstitutionsByKeys({ institutionKeys }) {
    return Promise.all(
      institutionKeys.map(key => this.getInstitutionByKey({ key })),
    );
  }
  */
}

export default InstitutionAPI;
