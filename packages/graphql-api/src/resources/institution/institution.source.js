// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const API_V1 = config.API_V1;

class InstitutionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchInstitutions({ query }) {
    return this.get('/institution', query);
  }

  async getInstitutionByKey({ key }) {
    return this.get(`/institution/${key}`);
  }

  /*
  getInstitutionsByKeys({ institutionKeys }) {
    return Promise.all(
      institutionKeys.map(key => this.getInstitutionByKey({ key })),
    );
  }
  */
}

module.exports = InstitutionAPI;