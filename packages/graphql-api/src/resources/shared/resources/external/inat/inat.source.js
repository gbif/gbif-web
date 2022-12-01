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
    const { results, total_results: total } = await this.get(
      `/taxa?q=${taxon}`,
    );
    return total > 0 ? results[0].default_photo : null;
  }
}

export default PersonAPI;
