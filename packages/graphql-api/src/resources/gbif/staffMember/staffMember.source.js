import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';
import { stringify } from 'qs';

class StaffMemberAPI extends RESTDataSource {
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

  async searchStaff({ query }) {
    return this.get('/grscicoll/person', stringify(query, { indices: false }));
  }

  async getStaffByKey({ key }) {
    return this.get(`/grscicoll/person/${key}`);
  }

  /*
  getPersonsByKeys({ personKeys }) {
    return Promise.all(
      personKeys.map(key => this.getPersonByKey({ key })),
    );
  }
  */
}

export default StaffMemberAPI;
