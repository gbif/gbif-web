// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class InstitutionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
  }

  async searchInstitutions({ query }) {
    return this.get('/grscicoll/institution', qs.stringify(query, { indices: false }));
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

module.exports = InstitutionAPI;