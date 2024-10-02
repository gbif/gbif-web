import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';
import { stringify } from 'qs';

class InstitutionAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.apiv1;
    this.context = context;
  }
  
  willSendRequest(_path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL);
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
