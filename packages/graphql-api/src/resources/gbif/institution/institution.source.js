import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class InstitutionAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async searchInstitutions({ query }) {
    const response = await this.get(
      '/grscicoll/institution/search',
      stringify(query, { indices: false }),
    );
    response._query = query;
    return response;
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
