/* eslint-disable class-methods-use-this */

import { RESTDataSource } from 'apollo-datasource-rest';

class PersonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.inat;
  }

  willSendRequest(request) {
    request.headers.set('Accept', 'application/json');
  }

  async getRepresentativeImage({ taxon }) {
    return (await this.get(`/taxa?q=${taxon}`)).results || [];
  }
}

export default PersonAPI;
