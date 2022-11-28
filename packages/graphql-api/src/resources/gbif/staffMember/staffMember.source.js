import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class StaffMemberAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
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
